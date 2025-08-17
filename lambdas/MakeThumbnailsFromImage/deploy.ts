#!/usr/bin/env node

import { config } from 'dotenv';
import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Load environment variables from root .env file
config({ path: join(process.cwd(), '../../.env') });

interface DeployConfig {
  functionName: string;
  region: string;
  roleArn: string;
  bucket?: string;
  key?: string;
}

const DEFAULT_CONFIG: DeployConfig = {
  functionName: 'MakeThumbnailsFromImage',
  region: 'us-east-1',
  roleArn: 'arn:aws:iam::222845718616:role/MakeThumbnailsFromImage-ExecutionRole'
};

async function createExecutionRole(awsEnv: any, region: string): Promise<string> {
  const roleName = 'MakeThumbnailsFromImage-ExecutionRole';
  
  // Create trust policy for Lambda
  const trustPolicy = JSON.stringify({
    Version: '2012-10-17',
    Statement: [{
      Effect: 'Allow',
      Principal: { Service: 'lambda.amazonaws.com' },
      Action: 'sts:AssumeRole'
    }]
  });
  
  // Create execution policy with permissions for image processing
  const executionPolicy = JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: [
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents'
        ],
        Resource: 'arn:aws:logs:*:*:*'
      },
      {
        Effect: 'Allow',
        Action: [
          's3:GetObject',
          's3:PutObject',
          's3:CreateMultipartUpload',
          's3:UploadPart',
          's3:CompleteMultipartUpload'
        ],
        Resource: '*'
      }
    ]
  });
  
  try {
    // Create the role
    const createRoleCommand = [
      'aws iam create-role',
      `--role-name ${roleName}`,
      `--assume-role-policy-document '${trustPolicy}'`,
      `--region ${region}`
    ].join(' ');
    
    const createRoleResult = execSync(createRoleCommand, { 
      stdio: 'pipe', 
      env: awsEnv,
      encoding: 'utf8'
    });
    
    const roleArn = JSON.parse(createRoleResult).Role.Arn;
    
    // Attach the execution policy
    const attachPolicyCommand = [
      'aws iam put-role-policy',
      `--role-name ${roleName}`,
      '--policy-name LambdaExecutionPolicy',
      `--policy-document '${executionPolicy}'`,
      `--region ${region}`
    ].join(' ');
    
    execSync(attachPolicyCommand, { stdio: 'inherit', env: awsEnv });
    
    console.log(`✅ Created execution role: ${roleArn}`);
    return roleArn;
    
  } catch (error) {
    // Role might already exist, try to get it
    try {
      const getRoleCommand = [
        'aws iam get-role',
        `--role-name ${roleName}`,
        `--region ${region}`
      ].join(' ');
      
      const getRoleResult = execSync(getRoleCommand, { 
        stdio: 'pipe', 
        env: awsEnv,
        encoding: 'utf8'
      });
      
      const roleArn = JSON.parse(getRoleResult).Role.Arn;
      console.log(`✅ Using existing execution role: ${roleArn}`);
      return roleArn;
      
    } catch (getError) {
      console.error('❌ Failed to create or find execution role');
      console.error('Note: delula-app-user may not have IAM permissions to get role details');
      console.error('Using default role ARN:', DEFAULT_CONFIG.roleArn);
      return DEFAULT_CONFIG.roleArn;
    }
  }
}

async function build() {
  console.log('🔨 Building TypeScript...');
  
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

async function createDeploymentPackage() {
  console.log('📦 Creating deployment package...');
  
  const packageDir = join(process.cwd(), 'package');
  
  // Create package directory
  if (!existsSync(packageDir)) {
    mkdirSync(packageDir, { recursive: true });
  }
  
  // Copy built JavaScript file
  execSync(`cp dist/index.js ${packageDir}/index.js`, { stdio: 'inherit' });
  
  // Copy package.json
  execSync(`cp package.json ${packageDir}/`, { stdio: 'inherit' });
  
  // Install only production dependencies (dotenv)
  execSync('npm install --only=production', { cwd: packageDir, stdio: 'inherit' });
  
  console.log('✅ Deployment package created');
  return packageDir;
}

async function deployToAWS(packageDir: string, config: DeployConfig) {
  console.log('🚀 Deploying to AWS Lambda...');
  
  // Check for required AWS credentials
  if (!process.env.AWS_DELULA_ACCESS_KEY || !process.env.AWS_DELULA_SECRET_ACCESS_KEY) {
    console.error('❌ Missing required AWS credentials in .env file:');
    console.error('   - AWS_DELULA_ACCESS_KEY');
    console.error('   - AWS_DELULA_SECRET_ACCESS_KEY');
    process.exit(1);
  }
  
  const zipFile = `${config.functionName}.zip`;
  
  // Create zip file
  execSync(`cd ${packageDir} && zip -r ../${zipFile} .`, { stdio: 'inherit' });
  
  // Set AWS credentials for this deployment
  const awsEnv = {
    ...process.env,
    AWS_ACCESS_KEY_ID: process.env.AWS_DELULA_ACCESS_KEY,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_DELULA_SECRET_ACCESS_KEY,
    AWS_DEFAULT_REGION: config.region
  };
  
  // Deploy using AWS CLI
  const deployCommand = [
    'aws lambda create-function',
    `--function-name ${config.functionName}`,
    `--runtime nodejs22.x`,
    `--role ${config.roleArn}`,
    `--handler index.handler`,
    `--zip-file fileb://${zipFile}`,
    `--region ${config.region}`,
    '--timeout 900', // 15 minutes for image processing
    '--memory-size 2048', // 2GB for image processing
    '--layers arn:aws:serverlessrepo:us-east-1:145266761615:applications/image-magick-lambda-layer'
  ].join(' ');
  
  try {
    execSync(deployCommand, { stdio: 'inherit', env: awsEnv });
    console.log('✅ Lambda function deployed successfully');
  } catch (error) {
    console.log('⚠️  Function might already exist, trying to update...');
    
    // Update existing function
    const updateCommand = [
      'aws lambda update-function-code',
      `--function-name ${config.functionName}`,
      `--zip-file fileb://${zipFile}`,
      `--region ${config.region}`
    ].join(' ');
    
    execSync(updateCommand, { stdio: 'inherit', env: awsEnv });
    console.log('✅ Lambda function updated successfully');
    
    // Also update the function configuration to include the layer
    const updateConfigCommand = [
      'aws lambda update-function-configuration',
      `--function-name ${config.functionName}`,
      `--layers arn:aws:serverlessrepo:us-east-1:145266761615:applications/image-magick-lambda-layer`,
      `--region ${config.region}`
    ].join(' ');
    
    try {
      execSync(updateConfigCommand, { stdio: 'inherit', env: awsEnv });
      console.log('✅ Lambda function configuration updated with layer');
    } catch (configError) {
      console.log('⚠️  Could not update function configuration with layer');
    }
  }
  
  // Clean up zip file
  execSync(`rm ${zipFile}`, { stdio: 'inherit' });
}

async function main() {
  console.log('🚀 Deploying MakeThumbnailsFromImage Lambda...\n');
  
  try {
    // Step 1: Build the project
    await build();
    
    // Step 2: Create deployment package
    const packageDir = await createDeploymentPackage();
    
    // Step 3: Create or get execution role
    const awsEnv = {
      ...process.env,
      AWS_ACCESS_KEY_ID: process.env.AWS_DELULA_ACCESS_KEY,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_DELULA_SECRET_ACCESS_KEY,
      AWS_DEFAULT_REGION: DEFAULT_CONFIG.region
    };
    
    const roleArn = await createExecutionRole(awsEnv, DEFAULT_CONFIG.region);
    
    // Step 4: Deploy to AWS
    await deployToAWS(packageDir, { ...DEFAULT_CONFIG, roleArn });
    
    console.log('\n🎉 Deployment completed successfully!');
    console.log(`📱 Function: ${DEFAULT_CONFIG.functionName}`);
    console.log(`🔑 Role: ${roleArn}`);
    console.log(`🌍 Region: ${DEFAULT_CONFIG.region}`);
    
  } catch (error) {
    console.error('\n❌ Deployment failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
