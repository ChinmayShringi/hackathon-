#!/usr/bin/env tsx

import './_setup-env';
import { LambdaClient, ListFunctionsCommand } from '@aws-sdk/client-lambda';

async function testCredentials() {
  try {
    console.log('🔐 Testing AWS credentials...');
    console.log('Region:', process.env.AWS_REGION);
    console.log('Access Key:', process.env.AWS_DELULA_ACCESS_KEY?.substring(0, 10) + '...');
    console.log('Secret Key:', process.env.AWS_DELULA_SECRET_ACCESS_KEY?.substring(0, 10) + '...');
    
    const lambdaClient = new LambdaClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_DELULA_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_DELULA_SECRET_ACCESS_KEY!,
      },
    });

    const command = new ListFunctionsCommand({});
    const response = await lambdaClient.send(command);
    console.log('✅ Credentials valid! Found', response.Functions?.length, 'Lambda functions');
    
    const externalTransferFunction = response.Functions?.find(f => f.FunctionName === 'ExternalFileTransferToS3');
    if (externalTransferFunction) {
      console.log('✅ ExternalFileTransferToS3 Lambda found:', externalTransferFunction.FunctionName);
      console.log('   Runtime:', externalTransferFunction.Runtime);
      console.log('   Last Modified:', externalTransferFunction.LastModified);
    } else {
      console.log('❌ ExternalFileTransferToS3 Lambda not found');
      console.log('Available functions:', response.Functions?.map(f => f.FunctionName).join(', '));
    }
  } catch (error) {
    console.error('❌ Credentials test failed:', error);
  }
}

testCredentials(); 