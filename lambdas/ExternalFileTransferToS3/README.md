# ExternalFileTransferToS3 Lambda

A production-ready AWS Lambda function that transfers files from remote URLs to S3 buckets. This Lambda handles streaming, multipart uploads, MIME detection, and robust error handling.

## Overview

The `ExternalFileTransferToS3` Lambda function is designed to efficiently transfer files from external URLs to S3 buckets. It automatically handles:

- **Streaming transfers** - No base64 encoding required
- **Multipart uploads** - For large files (>5MB)
- **MIME type detection** - Automatic content-type detection
- **Error handling** - Robust error recovery and reporting
- **TypeScript** - Full TypeScript implementation with proper types

## Architecture

### Core Components

1. **`index.ts`** - Main Lambda handler with upload logic
2. **`stream-utils.ts`** - HTTP streaming and buffering utilities
3. **`types.ts`** - TypeScript type definitions
4. **`deploy.ts`** - Automated deployment script

### Upload Strategy

The Lambda uses a smart upload strategy:

- **Small files (<5MB)**: Single PUT operation with buffering
- **Large files (>5MB)**: Multipart upload using AWS SDK Upload class
- **Unknown size**: Buffered single PUT with warning

### Dependencies

- `@aws-sdk/client-s3` - S3 client for basic operations
- `@aws-sdk/lib-storage` - Upload class for multipart uploads
- `dotenv` - Environment variable management

## Setup

### Prerequisites

1. **AWS CLI** configured with appropriate permissions
2. **Node.js 20+** and npm
3. **IAM Role** with S3 permissions (see IAM Setup below)
4. **Environment variables** in root `.env` file:
   ```
   AWS_DELULA_ACCESS_KEY=your_access_key
   AWS_DELULA_SECRET_ACCESS_KEY=your_secret_key
   ```

### Installation

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build
```

### IAM Setup

The Lambda requires an execution role with the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:CreateMultipartUpload",
        "s3:UploadPart",
        "s3:CompleteMultipartUpload"
      ],
      "Resource": "*"
    }
  ]
}
```

**Role Name**: `ExternalFileTransferToS3-ExecutionRole`

## Usage

### Input Format

The Lambda expects a JSON payload with the following structure:

```typescript
interface ExternalFileTransferRequest {
  remote_url: string;    // URL of the file to transfer
  bucket: string;        // S3 bucket name
  key: string;          // S3 object key
  mime_type?: string;   // Optional MIME type override
}
```

### Example Usage

#### Basic File Transfer

```bash
aws lambda invoke \
  --function-name ExternalFileTransferToS3 \
  --region us-east-1 \
  --payload '{
    "remote_url": "https://example.com/image.jpg",
    "bucket": "my-bucket",
    "key": "uploads/image.jpg"
  }' \
  --cli-binary-format raw-in-base64-out \
  output.json
```

#### With Custom MIME Type

```bash
aws lambda invoke \
  --function-name ExternalFileTransferToS3 \
  --region us-east-1 \
  --payload '{
    "remote_url": "https://example.com/document.pdf",
    "bucket": "my-bucket",
    "key": "documents/report.pdf",
    "mime_type": "application/pdf"
  }' \
  --cli-binary-format raw-in-base64-out \
  output.json
```

#### Programmatic Usage (Node.js)

```javascript
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

const lambda = new LambdaClient({ region: 'us-east-1' });

const payload = {
  remote_url: 'https://example.com/file.zip',
  bucket: 'my-bucket',
  key: 'archives/file.zip'
};

const command = new InvokeCommand({
  FunctionName: 'ExternalFileTransferToS3',
  Payload: JSON.stringify(payload)
});

const response = await lambda.send(command);
const result = JSON.parse(new TextDecoder().decode(response.Payload));
console.log(result);
```

### Response Format

#### Success Response

```json
{
  "statusCode": 200,
  "body": "Uploaded using single PUT"
}
```

or for multipart uploads:

```json
{
  "statusCode": 200,
  "body": "Uploaded using multipart"
}
```

#### Error Response

```json
{
  "statusCode": 400,
  "body": "Missing required fields."
}
```

```json
{
  "statusCode": 500,
  "body": "Upload error: Network timeout"
}
```

## Testing

### Local Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run local test runner
npm run test:local
```

### Integration Testing

```bash
# Test with a real file
aws lambda invoke \
  --function-name ExternalFileTransferToS3 \
  --region us-east-1 \
  --payload '{
    "remote_url": "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png",
    "bucket": "your-test-bucket",
    "key": "test/lambda-upload.png"
  }' \
  --cli-binary-format raw-in-base64-out \
  output.json

cat output.json
```

### Test Files

- `index.test.ts` - Main handler tests
- `stream-utils.test.ts` - Stream utility tests
- `integration.test.ts` - End-to-end integration tests
- `test-runner.ts` - Local test runner

## Deployment

### Automated Deployment

```bash
# Deploy to AWS Lambda
npm run deploy
```

The deployment script will:
1. Build TypeScript code
2. Create deployment package
3. Upload to AWS Lambda
4. Update function configuration

### Manual Deployment

```bash
# Build the project
npm run build

# Create deployment package
cd package
zip -r ../lambda.zip .

# Deploy using AWS CLI
aws lambda update-function-code \
  --function-name ExternalFileTransferToS3 \
  --zip-file fileb://lambda.zip \
  --region us-east-1
```

### Configuration

The deployment can be customized via environment variables:

- `LAMBDA_FUNCTION_NAME` - Function name (default: `ExternalFileTransferToS3`)
- `AWS_REGION` - AWS region (default: `us-east-1`)
- `LAMBDA_ROLE_ARN` - IAM role ARN

## Performance

### Memory and Timeout

- **Memory**: 512MB (configurable)
- **Timeout**: 300 seconds (5 minutes)
- **Max file size**: Limited by Lambda timeout and memory

### Optimization Features

- **Streaming**: Direct streaming from source to S3
- **Buffering**: Smart buffering for unknown file sizes
- **Multipart**: Automatic multipart upload for large files
- **Concurrent uploads**: 4 concurrent parts for multipart uploads

## Error Handling

### Common Errors

1. **Network Errors**: Retry logic for temporary network issues
2. **Invalid URLs**: Proper validation and error messages
3. **S3 Permission Errors**: Clear error reporting for access issues
4. **File Size Issues**: Warnings for large files with unknown size

### Error Recovery

- Automatic retry for network timeouts
- Graceful degradation for missing content-length headers
- Detailed error logging for debugging

## Security

### Best Practices

- **IAM Roles**: Least privilege access
- **Environment Variables**: Secure credential management
- **Input Validation**: Strict validation of all inputs
- **Error Sanitization**: No sensitive data in error messages

### Required Permissions

- S3 PutObject for target bucket
- CloudWatch Logs for monitoring
- Lambda execution permissions

## Monitoring

### CloudWatch Metrics

Monitor the following metrics:
- **Duration**: Function execution time
- **Errors**: Error rate and types
- **Throttles**: Concurrent execution limits
- **Memory**: Memory utilization

### Logs

Logs are available in CloudWatch Logs with the following structure:
- Request details (URL, bucket, key)
- Upload method used (single PUT vs multipart)
- Performance metrics
- Error details (when applicable)

## Troubleshooting

### Common Issues

1. **"Invalid value undefined for header"**
   - Solution: Use the latest version with proper buffering

2. **"Function not found"**
   - Solution: Ensure function is deployed and name is correct

3. **"Access denied"**
   - Solution: Check IAM role permissions and S3 bucket access

4. **"Timeout"**
   - Solution: Increase timeout for large files or slow networks

### Debug Mode

Enable detailed logging by checking CloudWatch Logs for the Lambda function.

## Contributing

### Development Workflow

1. Make changes to TypeScript files
2. Run tests: `npm test`
3. Build: `npm run build`
4. Deploy: `npm run deploy`
5. Test with real data

### Code Structure

```
lambdas/ExternalFileTransferToS3/
├── index.ts              # Main Lambda handler
├── stream-utils.ts       # HTTP streaming utilities
├── types.ts             # TypeScript definitions
├── deploy.ts            # Deployment script
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── README.md           # This documentation
└── tests/              # Test files
    ├── index.test.ts
    ├── stream-utils.test.ts
    └── integration.test.ts
```

## License

This Lambda function is part of the Delula project and follows the same licensing terms. 