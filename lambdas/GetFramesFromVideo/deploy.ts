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
  functionName: 'GetFramesFromVideo',
  region: 'us-east-1',
  roleArn: 'arn:aws:iam::222845718616:role/GetFramesFromVideo-ExecutionRole'
};

async function createExecutionRole(awsEnv: any, region: string): Promise<string> {
  const roleName = 'GetFramesFromVideo-ExecutionRole';
  
  // Create trust policy for Lambda
  const trustPolicy = JSON.stringify({
    Version: '2012-10-17',
    Statement: [{
      Effect: 'Allow',
      Principal: { Service: 'lambda.amazonaws.com' },
      Action: 'sts:AssumeRole'
    }]
  });
  
  // Create execution policy with S3 permissions
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
          's3:PutObjectAcl',
          's3:GetObject',
          's3:ListBucket'
        ],
        Resource: [
          'arn:aws:s3:::delula-media-prod',
          'arn:aws:s3:::delula-media-prod/*'
        ]
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
      
    } catch (getRoleError) {
      console.error('❌ Failed to create or get execution role:', error);
      throw error;
    }
  }
}

async function build(): Promise<void> {
  console.log('🔨 Building project...');
  
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error);
    throw error;
  }
}

async function createDeploymentPackage(): Promise<string> {
  console.log('📦 Creating deployment package...');
  
  const packageDir = 'package';
  if (existsSync(packageDir)) {
    execSync(`rm -rf ${packageDir}`, { stdio: 'inherit' });
  }
  
  mkdirSync(packageDir);
  
  // Copy built files
  execSync('cp -r dist/* package/', { stdio: 'inherit' });
  
  // Copy package.json and install production dependencies
  execSync('cp package.json package/', { stdio: 'inherit' });
  execSync('cd package && npm install --production', { stdio: 'inherit' });
  
  // Remove dev dependencies from package
  execSync('cd package && rm -rf node_modules package-lock.json', { stdio: 'inherit' });
  
  console.log('✅ Deployment package created');
  return packageDir;
}

async function deployToAWS(packageDir: string, config: DeployConfig): Promise<void> {
  console.log('🚀 Deploying to AWS Lambda...');
  
  const zipFile = `${config.functionName}.zip`;
  
  // Create zip file
  execSync(`cd ${packageDir} && zip -r ../${zipFile} .`, { stdio: 'inherit' });
  
  // Use existing execution role (created manually)
  const awsEnv = {
    ...process.env,
    AWS_ACCESS_KEY_ID: process.env.AWS_DELULA_ACCESS_KEY,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_DELULA_SECRET_ACCESS_KEY,
    AWS_DEFAULT_REGION: config.region
  };
  
  // Try to create the function
  const deployCommand = [
    'aws lambda create-function',
    `--function-name ${config.functionName}`,
    `--runtime nodejs22.x`,
    `--role ${config.roleArn}`,
    `--handler index.handler`,
    `--zip-file fileb://${zipFile}`,
    `--region ${config.region}`,
    '--timeout 300', // 5 minutes for video processing
    '--memory-size 2048', // 2GB for FFmpeg operations
    `--layers arn:aws:lambda:us-east-1:175033217214:layer:ffmpeg:1`
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
    
    // Also update the function configuration to include the layer
    const updateConfigCommand = [
      'aws lambda update-function-configuration',
      `--function-name ${config.functionName}`,
      `--layers arn:aws:lambda:us-east-1:175033217214:layer:ffmpeg:1`,
      `--region ${config.region}`
    ].join(' ');
    
    execSync(updateCommand, { stdio: 'inherit', env: awsEnv });
    console.log('✅ Lambda function code updated successfully');
    
    // Update function configuration to include the layer
    try {
      execSync(updateConfigCommand, { stdio: 'inherit', env: awsEnv });
      console.log('✅ Lambda function configuration updated with layer');
    } catch (configError) {
      console.log('⚠️  Could not update function configuration with layer');
    }
  }
  
  // Clean up zip file
  try {
    execSync(`rm ${zipFile}`, { stdio: 'inherit' });
    console.log('✅ Cleaned up deployment package');
  } catch (error) {
    console.log('⚠️  Could not clean up deployment package');
  }
}

async function main() {
  console.log('🎬 GetFramesFromVideo Lambda Deployment');
  console.log('=======================================');
  
  // Get configuration from environment or use defaults
  const config: DeployConfig = {
    functionName: process.env.LAMBDA_FUNCTION_NAME || DEFAULT_CONFIG.functionName,
    region: process.env.AWS_REGION || DEFAULT_CONFIG.region,
    roleArn: process.env.LAMBDA_ROLE_ARN || DEFAULT_CONFIG.roleArn
  };
  
  console.log(`📋 Configuration:`);
  console.log(`   Function Name: ${config.functionName}`);
  console.log(`   Region: ${config.region}`);
  console.log(`   Role ARN: ${config.roleArn}`);
  console.log(`   AWS User: delula-app-user`);
  console.log(`   AWS Access Key: ${process.env.AWS_DELULA_ACCESS_KEY ? '✅ Found' : '❌ Missing'}`);
  console.log(`   AWS Secret Key: ${process.env.AWS_DELULA_SECRET_ACCESS_KEY ? '✅ Found' : '❌ Missing'}`);
  console.log('');
  
  // Use existing execution role (created manually)
  const awsEnv = {
    ...process.env,
    AWS_ACCESS_KEY_ID: process.env.AWS_DELULA_ACCESS_KEY,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_DELULA_SECRET_ACCESS_KEY,
    AWS_DEFAULT_REGION: config.region
  };
  
  console.log(`✅ Using existing execution role: ${config.roleArn}`);
  
  // Build the project
  await build();
  
  // Create deployment package
  const packageDir = await createDeploymentPackage();
  
  // Deploy to AWS
  await deployToAWS(packageDir, config);
  
  console.log('');
  console.log('🎉 Deployment completed successfully!');
  console.log('');
  console.log('📝 Next steps:');
  console.log('   1. Test the function with a sample video URL');
  console.log('   2. Monitor CloudWatch Logs for execution details');
  console.log('   3. Set up alarms for error monitoring');
  console.log('');
  console.log('🧪 Test command:');
  console.log(`   aws lambda invoke \\`);
  console.log(`     --function-name ${config.functionName} \\`);
  console.log(`     --region ${config.region} \\`);
  console.log(`     --payload '{"video_url":"https://cdn.delu.la/test/xzdJXToBseHZj_HUw7szI_output.mp4","frame_requests":"0, -1, 50%, 90%","destination_bucket":"delula-media-prod","output_prefix":"test","allow_partial_completion":true}' \\`);
  console.log(`     --cli-binary-format raw-in-base64-out \\`);
  console.log(`     output.json`);
}

main().catch((error) => {
  console.error('❌ Deployment failed:', error);
  process.exit(1);
});
