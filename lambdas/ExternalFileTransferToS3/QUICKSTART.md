# Quick Start Guide

Get the ExternalFileTransferToS3 Lambda up and running in 5 minutes.

## Prerequisites

- AWS CLI configured with appropriate permissions
- Node.js 20+ installed
- An S3 bucket for testing

## Step 1: Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

## Step 2: Create IAM Role

Create an IAM role named `ExternalFileTransferToS3-ExecutionRole` with the following trust policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

And attach this execution policy:

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

## Step 3: Deploy

```bash
# Deploy to AWS Lambda
npm run deploy
```

## Step 4: Test

```bash
# Test with the sample event
aws lambda invoke \
  --function-name ExternalFileTransferToS3 \
  --region us-east-1 \
  --payload file://sample-event.json \
  --cli-binary-format raw-in-base64-out \
  output.json

# Check the result
cat output.json
```

## Expected Output

```json
{
  "statusCode": 200,
  "body": "Uploaded using single PUT"
}
```

## Next Steps

- Check your S3 bucket for the uploaded file
- Review the full [README.md](README.md) for advanced usage
- Monitor CloudWatch Logs for detailed execution information

## Troubleshooting

If you encounter issues:

1. **"Function not found"** - Ensure the deployment completed successfully
2. **"Access denied"** - Check IAM role permissions
3. **"Invalid bucket"** - Update the bucket name in `sample-event.json`

For more help, see the [Troubleshooting section](README.md#troubleshooting) in the main README. 