# Scripts

This directory contains utility scripts for the Delula project.

## Available Scripts

### `create-pr.ts`

Creates a pull request from the `main` branch to the `test-aws-deployment` branch with an interactive prompt-based interface.

#### Features

- **Interactive Prompts**: User-friendly CLI interface with prompts for:
  - Reason (default: "New build from `main` branch")
  - Issue number (optional)
  - Mode selection (Debugging/Production) with arrow key navigation
- **Automatic Commit Summary**: Compares branches and includes new commits in the PR description
- **GitHub Integration**: Uses GitHub API to create PRs on behalf of the authenticated user
- **Error Handling**: Comprehensive error handling with fallback logic
- **Validation**: Validates git state and branch existence before creating PR

#### Prerequisites

1. **GitHub Token**: Set the `GITHUB_TOKEN` environment variable with a valid GitHub personal access token
   ```bash
   export GITHUB_TOKEN=your_github_token_here
   ```
   
   Or add it to your `.env` file:
   ```
   GITHUB_TOKEN=your_github_token_here
   ```

2. **Git Setup**: Ensure you're in a git repository with:
   - `main` branch exists
   - `test-aws-deployment` branch exists
   - Proper remote origin configured

#### Usage

```bash
# Using npm script (recommended)
npm run create-pr

# Or directly with tsx
tsx scripts/create-pr.ts
```

#### Example Output

```
🚀 Creating Pull Request from main to test-aws-deployment
============================================================
✓ Connected to GitHub as your-username
✓ Repository: owner/repo-name

? Reason for this PR: Fix Vite allowedHosts configuration for delu.la domain
? Issue # (optional, press Enter to skip): 123
? Select mode: (Use arrow keys)
❯ Debugging
  Production

============================================================
📋 PR Summary:
Reason: Fix Vite allowedHosts configuration for delu.la domain
Mode: Debugging
Issue: #123
From: main
To: test-aws-deployment
============================================================
? Create this pull request? (Y/n)

✓ Pull request created successfully!
PR URL: https://github.com/owner/repo-name/pull/456
PR #456
```

#### Generated PR Content

The script generates a comprehensive PR with:

- **Title**: The provided reason
- **Body**: 
  - Mode and submitter information
  - Branch information
  - Issue reference (if provided)
  - Summary of changes
  - List of new commits being merged

#### Error Handling

The script includes robust error handling for:

- Missing GitHub token
- Invalid git repository state
- Non-existent branches
- Network connectivity issues
- GitHub API errors
- Invalid user input

### `add-tags.ts`

Adds tags to recipes in the database.

### `recipe-cli.ts`

Command-line interface for recipe management.

### `tag-manager.tsx`

React component for managing tags in the UI.

### `queue-manager.ts`

Comprehensive queue management tool for monitoring and managing generation jobs. This is the recommended tool for queue management.

### `check-queue-status.ts`

Simple script to check jobs with "In Queue" or "processing" status. This is a legacy script that has been superseded by the more comprehensive `queue-manager.ts`.

#### Features

- **List Active Jobs**: View jobs that are pending, processing, or in queue
- **List All Jobs**: View all jobs with pagination
- **List Failed Jobs**: View failed jobs with failure reasons
- **Queue Statistics**: Get overview of job counts by status
- **Retry Failed Jobs**: Retry jobs that have failed but haven't exceeded max retries
- **Cancel Active Jobs**: Cancel jobs that are currently active
- **Provider Status Check**: Check the actual status from provider APIs (e.g., FAL)
- **Rich Display**: Shows job details including user, recipe, credits, retries, and prompts

#### Usage

```bash
# List active jobs (default)
npm run queue-manager

# List active jobs with custom limit
npm run queue-manager active 20

# List all jobs
npm run queue-manager all

# List failed jobs
npm run queue-manager failed

# Show queue statistics
npm run queue-manager stats

# Retry a failed job
npm run queue-manager retry 123

# Cancel an active job
npm run queue-manager cancel 456

# Check provider API status for a job
npm run queue-manager provider-status 123

# Show help
npm run queue-manager help
```

#### Example Output

```
🔍 Listing active jobs (status: pending, processing, In Queue)...

📋 Active Jobs (4 jobs):

Job 59: 🔄 processing | Created: 15d ago
  User: guest_user
  Recipe: Eating Lava Objects
  Credits: N/A
  Retries: 0/2
  Prompt: A surreal and humorous scene of professional business person casually eating a s...

📊 Queue Statistics:

  Active jobs: 4
  Completed jobs: 25
  Failed jobs: 44
  Total jobs: 73

🔍 Provider Status Check:

Job 82: 🔄 processing | Created: 34m ago
  Local status: processing
  FAL Job ID: b55760fe-2ce4-459a-9fc2-f81562ef661a
  Recipe: Lava Food ASMR
🌐 Checking FAL API status for job b55760fe-2ce4-459a-9fc2-f81562ef661a...
  FAL Status: COMPLETED
  ✅ Job completed successfully
  📄 Result available: Yes
```

#### Job Statuses

- **pending**: Job is waiting to be processed
- **processing**: Job is currently being processed
- **In Queue**: Job is in the processing queue
- **completed**: Job has completed successfully
- **failed**: Job has failed (can be retried if under max retries)

#### Provider Status Support

The queue manager supports checking actual provider API status for jobs:

- **FAL Jobs**: Checks FAL API status using `fal.queue.status()` and `fal.queue.result()`
- **Job Recovery**: Can detect when local status differs from provider status
- **Error Handling**: Handles network issues, completed jobs, and invalid job IDs
- **Result Preview**: Shows available results for completed jobs

## Development

All scripts are written in TypeScript and use `tsx` for execution. They follow the project's coding standards and include proper error handling.

## Dependencies

The scripts use the following key dependencies:

- `@octokit/rest`: GitHub API integration
- `inquirer`: Interactive CLI prompts
- `chalk`: Colored console output
- `tsx`: TypeScript execution 