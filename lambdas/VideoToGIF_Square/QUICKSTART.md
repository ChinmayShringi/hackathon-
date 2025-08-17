# Quick Start Guide

Get the VideoToGIF_Square Lambda up and running in 5 minutes.

## Prerequisites

- AWS CLI configured with appropriate permissions
- Node.js 22+ installed
- An S3 bucket for storing GIF thumbnails
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

Create an IAM role named `VideoToGIF_Square-ExecutionRole` with the following trust policy:

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
# Test with the sample event (128x128 default)
aws lambda invoke \
  --function-name VideoToGIF_Square \
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
    "message": "Video converted to GIF and uploaded successfully",
    "s3Location": "s3://your-bucket/thumbnails/sample-video.gif",
    "dimension": "128x128",
    "compression": {
      "originalSize": 1048576,
      "compressedSize": 106496,
      "ratio": "89.8%"
    },
    "processing": {
      "time": "45000ms",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

## Custom Dimensions

You can specify custom square dimensions (16-512 pixels):

```bash
# 256x256 GIF
aws lambda invoke \
  --function-name VideoToGIF_Square \
  --region us-east-1 \
  --payload '{
    "remote_url": "https://example.com/video.mp4",
    "bucket": "your-bucket",
    "key": "thumbnails/video-large.gif",
    "dimension": 256
  }' \
  --cli-binary-format raw-in-base64-out \
  output.json

# 64x64 GIF
aws lambda invoke \
  --function-name VideoToGIF_Square \
  --region us-east-1 \
  --payload '{
    "remote_url": "https://example.com/video.mp4",
    "bucket": "your-bucket",
    "key": "thumbnails/video-small.gif",
    "dimension": 64
  }' \
  --cli-binary-format raw-in-base64-out \
  output.json
```

## Next Steps

- Check your S3 bucket for the uploaded GIF thumbnail
- Review the full [README.md](README.md) for advanced usage
- Monitor CloudWatch Logs for detailed execution information

## Troubleshooting

If you encounter issues:

1. **"Function not found"** - Ensure the deployment completed successfully
2. **"Access denied"** - Check IAM role permissions
3. **"Invalid bucket"** - Update the bucket name in `sample-event.json`
4. **"Invalid dimension"** - Ensure dimension is between 16 and 512 pixels
5. **"FFmpeg error"** - Check that the video URL is accessible and valid
6. **"AWS credentials not found"** - Ensure AWS_DELULA_ACCESS_KEY and AWS_DELULA_SECRET_ACCESS_KEY are set in root .env

For more help, see the [Troubleshooting section](README.md#troubleshooting) in the main README. 