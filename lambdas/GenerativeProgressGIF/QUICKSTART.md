# Quick Start Guide

Get the GenerativeProgressGIF Lambda up and running in 5 minutes.

## Prerequisites

- AWS CLI configured with appropriate permissions
- Node.js 22+ installed
- An S3 bucket for storing progress GIFs
- AWS credentials configured in root `.env` file:
  ```
  AWS_DELULA_ACCESS_KEY=your_access_key
  AWS_DELULA_SECRET_ACCESS_KEY=your_secret_key
  ```

## Step 1: Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

## Step 2: Create IAM Role

Create an IAM role named `GenerativeProgressGIF-ExecutionRole` with the following trust policy:

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
# Test with the sample event (10-second reveal, 16 colors)
aws lambda invoke \
  --function-name GenerativeProgressGIF \
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
  "body": {
    "success": true,
    "message": "Generative progress GIF created and uploaded successfully",
    "s3Location": "s3://your-bucket/progress/loading.gif",
    "processing": {
      "revealDurationMs": 10000,
      "colorCount": 16,
      "frameCount": 303,
      "totalDuration": 10.33,
      "processingTime": "4500ms",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

## Custom Parameters

You can specify custom reveal duration and color count:

```bash
# 15-second reveal with 24 colors
aws lambda invoke \
  --function-name GenerativeProgressGIF \
  --region us-east-1 \
  --payload '{
    "remote_url": "https://example.com/animation.gif",
    "bucket": "your-bucket",
    "key": "progress/loading-long.gif",
    "reveal_duration_ms": 15000,
    "color_count": 24
  }' \
  --cli-binary-format raw-in-base64-out \
  output.json

# 5-second reveal with 8 colors
aws lambda invoke \
  --function-name GenerativeProgressGIF \
  --region us-east-1 \
  --payload '{
    "remote_url": "https://example.com/animation.gif",
    "bucket": "your-bucket",
    "key": "progress/loading-short.gif",
    "reveal_duration_ms": 5000,
    "color_count": 8
  }' \
  --cli-binary-format raw-in-base64-out \
  output.json
```

## Next Steps

- Check your S3 bucket for the uploaded progress GIF
- Review the full [README.md](README.md) for advanced usage
- Monitor CloudWatch Logs for detailed execution information

## Troubleshooting

If you encounter issues:

1. **"Function not found"** - Ensure the deployment completed successfully
2. **"Access denied"** - Check IAM role permissions
3. **"Invalid bucket"** - Update the bucket name in `sample-event.json`
4. **"Invalid reveal_duration_ms"** - Ensure duration is between 1000 and 30000ms
5. **"Invalid color_count"** - Ensure color count is between 8 and 32
6. **"Canvas error"** - Check that canvas dependencies are properly installed
7. **"AWS credentials not found"** - Ensure AWS_DELULA_ACCESS_KEY and AWS_DELULA_SECRET_ACCESS_KEY are set in root .env

For more help, see the [Troubleshooting section](README.md#troubleshooting) in the main README. 