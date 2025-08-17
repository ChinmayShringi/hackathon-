#!/usr/bin/env tsx

import { execSync, spawn } from 'child_process';
import { createInterface } from 'readline';
import { Octokit } from '@octokit/rest';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuration constants
const DEFAULT_DEPLOYMENT_BRANCH = "aws-test-deployment";
const DEFAULT_PR_TARGET = "main";

// Parse command line arguments
const args = process.argv.slice(2);
const helpFlag = args.includes('--help') || args.includes('-h');
const versionFlag = args.includes('--version') || args.includes('-v');
const deployFlag = args.includes('--deploy') || args.includes('-d');

if (helpFlag) {
  console.log(`
${chalk.blue('🚀 Create PR Script')}

${chalk.white('Creates a pull request with interactive prompts')}

${chalk.yellow('Usage:')}
  npm run create-pr                    # Create PR to main (default)
  npm run create-pr --deploy          # Create PR to aws-test-deployment
  npx tsx scripts/create-pr.ts
  npx tsx scripts/create-pr.ts --help

${chalk.yellow('Options:')}
  --deploy, -d    Target deployment branch (${DEFAULT_DEPLOYMENT_BRANCH})
  --help, -h      Show this help message
  --version, -v   Show version

${chalk.yellow('Features:')}
  • Interactive prompts for reason, issue number, and mode
  • Branch selection with auto-completion
  • Automatic commit summary and PR generation
  • GitHub API integration
  • Comprehensive error handling
  • Branch creation if needed

${chalk.yellow('Prerequisites:')}
  • GITHUB_TOKEN environment variable set OR gh CLI authenticated
  • Git repository with main branch
  • GitHub remote configured

${chalk.yellow('Environment Variables:')}
  GITHUB_TOKEN    GitHub personal access token (optional if gh CLI is authenticated)

${chalk.yellow('Examples:')}
  export GITHUB_TOKEN=your_token_here
  npm run create-pr                    # PR to main
  npm run create-pr --deploy          # PR to aws-test-deployment
`);
  process.exit(0);
}

if (versionFlag) {
  console.log('create-pr v2.0.0');
  process.exit(0);
}

// Helper to get GitHub token from gh CLI
async function getTokenFromGh(): Promise<string | null> {
  try {
    const { execSync } = await import('child_process');
    // gh auth status --show-token outputs the token in the last line
    const output = execSync('gh auth status --show-token', { encoding: 'utf8' });
    const match = output.match(/Token: ([a-zA-Z0-9_]+)/);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  } catch (err) {
    return null;
  }
}

// Helper to validate a GitHub token
async function validateToken(token: string): Promise<boolean> {
  try {
    const { Octokit } = await import('@octokit/rest');
    const octokit = new Octokit({ auth: token });
    await octokit.users.getAuthenticated();
    return true;
  } catch {
    return false;
  }
}

// Helper to get available branches
async function getAvailableBranches(): Promise<string[]> {
  try {
    const { execSync } = await import('child_process');
    const branches = execSync('git branch -r', { encoding: 'utf8' });
    return branches
      .split('\n')
      .map(b => b.trim())
      .filter(b => b && !b.includes('HEAD'))
      .map(b => b.replace('origin/', ''))
      .filter(b => b);
  } catch (err) {
    return [];
  }
}

// Helper to get current branch
function getCurrentBranch(): string {
  try {
    return execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  } catch (err) {
    return '';
  }
}

interface PRConfig {
  reason: string;
  issueNumber?: number;
  mode: 'Debugging' | 'Production';
  username: string;
  repoOwner: string;
  repoName: string;
  baseBranch: string;
  headBranch: string;
}

interface CommitInfo {
  hash: string;
  author: string;
  date: string;
  message: string;
}

class PRCreator {
  private config: PRConfig;
  private octokit: Octokit;

  constructor() {
    this.config = {
      reason: 'New build from `main` branch',
      mode: 'Debugging',
      username: '',
      repoOwner: '',
      repoName: '',
      baseBranch: deployFlag ? DEFAULT_DEPLOYMENT_BRANCH : DEFAULT_PR_TARGET,
      headBranch: 'main'
    };
  }

  private async initializeGitHub(): Promise<void> {
    try {
      // 1. Try env variable
      let token = process.env.GITHUB_TOKEN || null;
      if (token && !(await validateToken(token))) {
        console.log(chalk.yellow('⚠️  GITHUB_TOKEN env variable is set but invalid.')); 
        token = null;
      }
      // 2. Try gh CLI
      if (!token) {
        token = await getTokenFromGh();
        if (token && !(await validateToken(token))) {
          console.log(chalk.yellow('⚠️  Token from gh CLI is invalid.'));
          token = null;
        }
      }
      if (!token) {
        throw new Error('No valid GitHub token found. Set GITHUB_TOKEN or authenticate with gh CLI.');
      }
      this.octokit = new Octokit({ auth: token });

      // Get current user
      const { data: user } = await this.octokit.users.getAuthenticated();
      this.config.username = user.login;

      // Get repository info from git remote
      const remoteUrl = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();
      // Support any host, not just github.com
      // SSH: git@host:owner/repo.git
      // HTTPS: https://host/owner/repo.git
      let match = remoteUrl.match(/git@([^:]+):([^/]+)\/(.+?)(?:\.git)?$/);
      if (!match) {
        match = remoteUrl.match(/https?:\/\/([^/]+)\/([^/]+)\/(.+?)(?:\.git)?$/);
      }
      if (!match) {
        throw new Error('Could not parse GitHub repository from git remote');
      }
      const host = match[1];
      this.config.repoOwner = match[2];
      this.config.repoName = match[3];
      if (host !== 'github.com') {
        console.log(chalk.yellow(`⚠️  Remote host is '${host}', not 'github.com'. Make sure this is a GitHub Enterprise or custom instance.`));
      }

      console.log(chalk.green(`✓ Connected to GitHub as ${this.config.username}`));
      console.log(chalk.green(`✓ Repository: ${this.config.repoOwner}/${this.config.repoName}`));
      
      // Test repository access
      try {
        await this.octokit.repos.get({
          owner: this.config.repoOwner,
          repo: this.config.repoName
        });
        console.log(chalk.green(`✓ Repository access confirmed`));
      } catch (error) {
        console.log(chalk.yellow(`⚠️  Warning: Repository access test failed: ${error.message}`));
      }
    } catch (error) {
      throw new Error(`Failed to initialize GitHub: ${error.message}`);
    }
  }

  private async validateBranchState(): Promise<void> {
    try {
      const currentBranch = getCurrentBranch();
      if (currentBranch === this.config.baseBranch) {
        throw new Error(`Cannot create PR: You are currently on the target branch '${this.config.baseBranch}'. PRs should be from feature branches to merge branches.`);
      }

      // Check if branches exist
      const branches = await getAvailableBranches();
      const branchList = branches.map(b => `origin/${b}`);

      if (!branchList.includes(`origin/${this.config.headBranch}`)) {
        throw new Error(`Branch '${this.config.headBranch}' not found in remote`);
      }

      if (!branchList.includes(`origin/${this.config.baseBranch}`)) {
        console.log(chalk.yellow(`⚠️  Warning: Branch '${this.config.baseBranch}' not found in remote`));
        console.log(chalk.blue(`💡 You can create it with: git checkout -b ${this.config.baseBranch} && git push -u origin ${this.config.baseBranch}`));
        const { createBranch } = await inquirer.prompt({
          type: 'confirm',
          name: 'createBranch',
          message: `Would you like to create the '${this.config.baseBranch}' branch now?`,
          default: false
        });
        
        if (createBranch) {
          console.log(chalk.blue(`Creating branch '${this.config.baseBranch}'...`));
          execSync(`git checkout -b ${this.config.baseBranch}`, { stdio: 'inherit' });
          execSync(`git push -u origin ${this.config.baseBranch}`, { stdio: 'inherit' });
          console.log(chalk.green(`✓ Branch '${this.config.baseBranch}' created and pushed`));
        } else {
          throw new Error(`Branch '${this.config.baseBranch}' is required but doesn't exist`);
        }
      }

      // Check if branches are up to date
      execSync('git fetch origin', { stdio: 'ignore' });

      const mainAhead = execSync(
        `git rev-list --count origin/${this.config.baseBranch}..origin/${this.config.headBranch}`,
        { encoding: 'utf8' }
      ).trim();

      if (mainAhead === '0') {
        console.log(chalk.yellow('⚠️  Warning: No new commits in main branch'));
      }

    } catch (error) {
      throw new Error(`Git validation failed: ${error.message}`);
    }
  }

  private async getInteractiveInput(): Promise<void> {
    try {
      // Get target branch selection
      const availableBranches = await getAvailableBranches();
      const branchChoices = availableBranches.map(branch => ({
        name: branch,
        value: branch
      }));

      const { targetBranch } = await inquirer.prompt({
        type: 'list',
        name: 'targetBranch',
        message: 'Select target branch:',
        choices: branchChoices,
        default: this.config.baseBranch
      });
      this.config.baseBranch = targetBranch;

      // Re-validate branch state after selection
      await this.validateBranchState();

      // Get reason
      const { reason } = await inquirer.prompt({
        type: 'input',
        name: 'reason',
        message: 'Reason for this PR:',
        default: this.config.reason
      });
      this.config.reason = reason;

      // Get issue number
      const { issueNumber } = await inquirer.prompt({
        type: 'input',
        name: 'issueNumber',
        message: 'Issue # (optional, press Enter to skip):',
        default: '',
        filter: (input: string) => {
          if (!input || !input.trim()) return undefined;
          const num = parseInt(input.trim());
          return isNaN(num) ? undefined : num;
        },
        validate: (input: string) => {
          if (!input || !input.trim()) return true;
          const num = parseInt(input.trim());
          if (isNaN(num) || num <= 0) {
            return 'Please enter a valid positive integer or leave empty';
          }
          return true;
        }
      });
      this.config.issueNumber = issueNumber;

      // Get mode
      const { mode } = await inquirer.prompt({
        type: 'list',
        name: 'mode',
        message: 'Select mode:',
        choices: [
          { name: 'Debugging', value: 'Debugging' },
          { name: 'Production', value: 'Production' }
        ],
        default: 'Debugging'
      });
      this.config.mode = mode;

    } catch (error) {
      throw new Error(`Failed to get user input: ${error.message}`);
    }
  }

  private async getCommitSummary(): Promise<string> {
    try {
      // Ensure we have the latest remote branches
      execSync('git fetch origin', { stdio: 'ignore' });
      
      // Get commits that are in main but not in target branch using remote references
      const commits = execSync(
        `git log --oneline --no-merges origin/${this.config.baseBranch}..origin/${this.config.headBranch}`,
        { encoding: 'utf8' }
      ).trim();

      if (!commits) {
        return 'No new commits to merge.';
      }

      const commitLines = commits.split('\n').filter(line => line.trim());
      
      let summary = `\n## New Commits (${commitLines.length})\n\n`;
      
      commitLines.forEach((line, index) => {
        const [hash, ...messageParts] = line.split(' ');
        const message = messageParts.join(' ');
        summary += `${index + 1}. **${hash}** - ${message}\n`;
      });

      return summary;
    } catch (error) {
      console.warn(chalk.yellow(`Warning: Could not get commit summary: ${error.message}`));
      return '\n## New Commits\n\nUnable to retrieve commit information.';
    }
  }

  private generatePRMessage(): string {
    let message = `# ${this.config.reason}\n\n`;
    message += `**Mode:** ${this.config.mode}\n`;
    message += `**Submitted by:** @${this.config.username}\n`;
    message += `**Branch:** \`${this.config.headBranch}\` → \`${this.config.baseBranch}\`\n\n`;

    if (this.config.issueNumber !== undefined) {
      message += `Closes #${this.config.issueNumber}\n\n`;
    }

    message += `## Summary\n\n${this.config.reason}\n`;

    return message;
  }

  private generatePRTitle(): string {
    // Make title unique by adding timestamp if it's a default reason
    if (this.config.reason === 'New build from `main` branch') {
      const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
      return `${this.config.reason} - ${timestamp}`;
    }
    return this.config.reason;
  }

  private async createPR(): Promise<void> {
    try {
      console.log(chalk.blue('Creating pull request...'));

      const commitSummary = await this.getCommitSummary();
      const prMessage = this.generatePRMessage() + commitSummary;

      const { data: pr } = await this.octokit.pulls.create({
        owner: this.config.repoOwner,
        repo: this.config.repoName,
        title: this.generatePRTitle(),
        body: prMessage,
        head: this.config.headBranch,
        base: this.config.baseBranch
      });

      console.log(chalk.green(`✓ Pull request created successfully!`));
      console.log(chalk.blue(`PR URL: ${pr.html_url}`));
      console.log(chalk.blue(`PR #${pr.number}`));

    } catch (error) {
      console.log(chalk.yellow(`\n🔍 Debugging error...`));
      console.log(chalk.gray(`Request details:`));
      console.log(chalk.gray(`  Owner: ${this.config.repoOwner}`));
      console.log(chalk.gray(`  Repo: ${this.config.repoName}`));
      console.log(chalk.gray(`  Title: ${this.generatePRTitle()}`));
      console.log(chalk.gray(`  Head: ${this.config.headBranch}`));
      console.log(chalk.gray(`  Base: ${this.config.baseBranch}`));
      
      const errorMessage = error.response?.data?.message || error.message || '';
      console.log(chalk.red(`GitHub error message: ${errorMessage}`));
      
      // Check for specific GitHub error about existing PR
      if (errorMessage.includes('A pull request already exists for')) {
        console.log(chalk.yellow(`\n💡 This appears to be a GitHub repository policy preventing multiple PRs from the same source branch.`));
        console.log(chalk.blue(`\nPossible solutions:`));
        console.log(chalk.white(`  1. Close the existing PR first`));
        console.log(chalk.white(`  2. Use a different source branch (create a feature branch from main)`));
        console.log(chalk.white(`  3. Check repository settings for PR policies`));
        
        // Try to find the existing PR
        try {
          const { data: existingPRs } = await this.octokit.pulls.list({
            owner: this.config.repoOwner,
            repo: this.config.repoName,
            state: 'open',
            head: `${this.config.repoOwner}:${this.config.headBranch}`,
            base: this.config.baseBranch
          });
          
          if (existingPRs.length > 0) {
            console.log(chalk.blue(`\n📋 Existing PR(s):`));
            existingPRs.forEach(pr => {
              console.log(chalk.white(`  #${pr.number}: ${pr.title}`));
              console.log(chalk.gray(`     URL: ${pr.html_url}`));
            });
          }
        } catch (listError) {
          console.log(chalk.gray(`Could not retrieve existing PRs: ${listError.message}`));
        }
        
        const { createFeatureBranch } = await inquirer.prompt({
          type: 'confirm',
          name: 'createFeatureBranch',
          message: `Create a feature branch from ${this.config.headBranch} to work around this limitation?`,
          default: true
        });
        
        if (createFeatureBranch) {
          const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-').replace('T', '-');
          const featureBranchName = `feature/pr-${timestamp}`;
          
          console.log(chalk.blue(`\n🔄 Creating feature branch: ${featureBranchName}`));
          
          try {
            // Create and push the feature branch
            execSync(`git checkout -b ${featureBranchName}`, { stdio: 'inherit' });
            execSync(`git push -u origin ${featureBranchName}`, { stdio: 'inherit' });
            
            // Update the config to use the new branch
            this.config.headBranch = featureBranchName;
            
            console.log(chalk.green(`✓ Feature branch created: ${featureBranchName}`));
            console.log(chalk.blue(`🔄 Retrying PR creation with new source branch...`));
            
            // Retry the PR creation
            return await this.createPR();
          } catch (branchError) {
            throw new Error(`Failed to create feature branch: ${branchError.message}`);
          }
        } else {
          throw new Error(`GitHub prevents multiple PRs from ${this.config.headBranch} to ${this.config.baseBranch}. Please close existing PRs or use a different source branch.`);
        }
      }
      
      // Handle other 422 errors
      if (error.status === 422) {
        throw new Error(`Failed to create PR (422 error). This might be due to a duplicate title or other constraint violation. Error: ${errorMessage}`);
      }
      
      throw new Error(`Failed to create pull request: ${error.message}`);
    }
  }

  public async run(): Promise<void> {
    try {
      const targetBranchName = deployFlag ? DEFAULT_DEPLOYMENT_BRANCH : DEFAULT_PR_TARGET;
      console.log(chalk.blue(`🚀 Creating Pull Request from main to ${targetBranchName}`));
      console.log(chalk.gray('='.repeat(60)));

      // Initialize GitHub connection
      await this.initializeGitHub();

      // Get user input (includes branch validation)
      await this.getInteractiveInput();

      // Show summary
      console.log(chalk.gray('\n' + '='.repeat(60)));
      console.log(chalk.blue('📋 PR Summary:'));
      console.log(chalk.white(`Reason: ${this.config.reason}`));
      console.log(chalk.white(`Mode: ${this.config.mode}`));
      if (this.config.issueNumber !== undefined) {
        console.log(chalk.white(`Issue: #${this.config.issueNumber}`));
      }
      console.log(chalk.white(`From: ${this.config.headBranch}`));
      console.log(chalk.white(`To: ${this.config.baseBranch}`));
      console.log(chalk.gray('='.repeat(60)));

      // Confirm creation
      const { confirm } = await inquirer.prompt({
        type: 'confirm',
        name: 'confirm',
        message: 'Create this pull request?',
        default: true
      });

      if (!confirm) {
        console.log(chalk.yellow('❌ PR creation cancelled'));
        return;
      }

      // Create the PR
      await this.createPR();

    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
      process.exit(1);
    }
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const prCreator = new PRCreator();
  prCreator.run().catch(error => {
    console.error(chalk.red(`Fatal error: ${error.message}`));
    process.exit(1);
  });
} 