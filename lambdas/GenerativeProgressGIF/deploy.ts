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
  functionName: 'GenerativeProgressGIF',
  region: 'us-east-1',
  roleArn: 'arn:aws:iam::222845718616:role/GenerativeProgressGIF-ExecutionRole'
};

async function createExecutionRole(awsEnv: any, region: string): Promise<string> {
  const roleName = 'GenerativeProgressGIF-ExecutionRole';
  
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
  
  // Install only production dependencies
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
    '--timeout 300', // 5 minutes for GIF processing
    '--memory-size 1024' // 1GB for canvas operations
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
  
  // Clean up zip file
  try {
    execSync(`rm ${zipFile}`, { stdio: 'inherit' });
    console.log('✅ Cleaned up deployment package');
  } catch (error) {
    console.log('⚠️  Could not clean up deployment package');
  }
}

async function main() {
  console.log('🎬 GenerativeProgressGIF Lambda Deployment');
  console.log('==========================================');
  
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
  console.log('   1. Test the function with a sample GIF URL');
  console.log('   2. Monitor CloudWatch Logs for execution details');
  console.log('   3. Set up alarms for error monitoring');
  console.log('');
  console.log('🧪 Test command:');
  console.log(`   aws lambda invoke \\`);
  console.log(`     --function-name ${config.functionName} \\`);
  console.log(`     --region ${config.region} \\`);
  console.log(`     --payload '{"remote_url":"https://example.com/animation.gif","bucket":"your-bucket","key":"progress/loading.gif","reveal_duration_ms":10000,"color_count":16}' \\`);
  console.log(`     --cli-binary-format raw-in-base64-out \\`);
  console.log(`     output.json`);
}

// Run deployment if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { main as deploy }; 