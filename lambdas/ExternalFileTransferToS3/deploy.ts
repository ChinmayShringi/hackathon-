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
  functionName: 'ExternalFileTransferToS3',
  region: 'us-east-1',
  roleArn: 'arn:aws:iam::222845718616:role/ExternalFileTransferToS3-ExecutionRole'
};

async function createExecutionRole(awsEnv: any, region: string): Promise<string> {
  const roleName = 'ExternalFileTransferToS3-ExecutionRole';
  
  // Create trust policy for Lambda
  const trustPolicy = JSON.stringify({
    Version: '2012-10-17',
    Statement: [{
      Effect: 'Allow',
      Principal: { Service: 'lambda.amazonaws.com' },
      Action: 'sts:AssumeRole'
    }]
  });
  
  // Create basic execution policy
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
      process.exit(1);
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
  
  // Copy built JavaScript files
  execSync(`cp dist/index.js ${packageDir}/index.js`, { stdio: 'inherit' });
  
  // Copy package.json and package-lock.json
  execSync(`cp package.json package-lock.json ${packageDir}/`, { stdio: 'inherit' });
  
  // Install production dependencies
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
    '--timeout 300',
    '--memory-size 512'
  ].join(' ');
  
  try {
    execSync(deployCommand, { stdio: 'inherit', env: awsEnv });
    console.log('✅ Lambda function deployed successfully');
  } catch (error) {
    console.log('⚠️  Function might already exist, trying to update...');
    
    const updateCommand = [
      'aws lambda update-function-code',
      `--function-name ${config.functionName}`,
      `--zip-file fileb://${zipFile}`,
      `--region ${config.region}`
    ].join(' ');
    
    try {
      execSync(updateCommand, { stdio: 'inherit', env: awsEnv });
      console.log('✅ Lambda function updated successfully');
    } catch (updateError) {
      console.error('❌ Update failed:', updateError);
      process.exit(1);
    }
  }
}

async function main() {
  const config = { ...DEFAULT_CONFIG };
  
  // Override with environment variables if provided
  if (process.env.LAMBDA_FUNCTION_NAME) config.functionName = process.env.LAMBDA_FUNCTION_NAME;
  if (process.env.AWS_REGION) config.region = process.env.AWS_REGION;
  if (process.env.LAMBDA_ROLE_ARN) config.roleArn = process.env.LAMBDA_ROLE_ARN;
  
  console.log('🚀 ExternalFileTransferToS3 Lambda Deployment\n');
  console.log('Configuration:');
  console.log(`  Function Name: ${config.functionName}`);
  console.log(`  Region: ${config.region}`);
  console.log(`  Role ARN: ${config.roleArn}`);
  console.log(`  AWS Access Key: ${process.env.AWS_DELULA_ACCESS_KEY ? '✅ Found' : '❌ Missing'}`);
  console.log(`  AWS Secret Key: ${process.env.AWS_DELULA_SECRET_ACCESS_KEY ? '✅ Found' : '❌ Missing'}\n`);
  
  await build();
  const packageDir = await createDeploymentPackage();
  await deployToAWS(packageDir, config);
  
  console.log('\n🎉 Deployment completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Configure environment variables if needed');
  console.log('2. Set up S3 bucket permissions');
  console.log('3. Test the function with a sample event');
}

// Run deployment if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main as deploy }; 