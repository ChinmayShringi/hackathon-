# Media Transfer Integration

This document describes the integration of the ExternalFileTransferToS3 Lambda function with the Delula project for transferring media files from external services to the delula-media-prod S3 bucket.

## Overview

When external services like FAL generate images or videos, they provide temporary URLs for downloading the media. The Media Transfer Service automatically transfers these files to our S3 bucket and provides CDN URLs for permanent access.

## Architecture

### Components

1. **MediaTransferService** (`server/media-transfer-service.ts`)
   - Handles communication with the ExternalFileTransferToS3 Lambda
   - Manages file naming and S3 key generation
   - Provides CDN URL generation

2. **WorkflowProcessor Integration** (`server/workflow-processor.ts`)
   - Automatically transfers media after successful generation
   - Updates workflow results with CDN URLs

3. **Queue Service Integration** (`server/queue-service.ts`)
   - Integrates media transfer into the generation queue
   - Handles both new workflow components and legacy processing

### S3 Bucket Structure

```
delula-media-prod/
├── images/raw/
│   └── {UUID}.{extension}
├── videos/raw/
│   └── {UUID}.{extension}
└── audio/raw/
    └── {UUID}.{extension}
```

### CDN URL Format

- **Base URL**: `https://cdn.delu.la/`
- **Full URL**: `https://cdn.delu.la/{mediaType}/raw/{UUID}.{extension}`

## Configuration

### Environment Variables

Add these to your `.env` file:

```bash
# AWS Lambda Configuration
AWS_REGION=us-east-1
AWS_DELULA_ACCESS_KEY=your_access_key
AWS_DELULA_SECRET_ACCESS_KEY=your_secret_key

# Lambda Function Name
LAMBDA_FUNCTION_NAME=ExternalFileTransferToS3
```

### Dependencies

The following packages have been added to `package.json`:

```json
{
  "@aws-sdk/client-lambda": "^3.828.0",
  "uuid": "^10.0.0",
  "@types/uuid": "^10.0.0"
}
```

## Usage

### Basic Media Transfer

```typescript
import { mediaTransferService } from './server/media-transfer-service';

const result = await mediaTransferService.transferMedia({
  remoteUrl: 'https://media.fal.ai/timsjobs.mp4',
  mediaType: 'video',
  originalFilename: 'timsjobs.mp4'
});

if (result.success) {
  console.log('CDN URL:', result.cdnUrl);
  console.log('S3 Key:', result.s3Key);
  console.log('Asset ID:', result.assetId);
}
```

### Automatic Integration

The media transfer is automatically integrated into the generation workflow:

1. **Workflow Components**: Media is transferred after successful generation
2. **Legacy Processing**: Video generation includes automatic transfer
3. **Database Storage**: CDN URLs are stored in the database

### Manual Transfer

For manual transfers or testing:

```bash
npm run test-media-transfer
```

## File Naming Convention

### UUID Generation
- Each file gets a unique UUID using `uuidv4()`
- Prevents filename collisions and provides security

### Extension Detection
1. **Original Filename**: If provided, extract extension from filename
2. **URL Path**: Extract extension from URL path
3. **Default**: Use appropriate default based on media type

### Supported Extensions

**Images**: jpg, jpeg, png, gif, webp
**Videos**: mp4, mov, avi, webm
**Audio**: mp3, wav, aac, ogg

## MIME Type Detection

The service automatically detects MIME types based on file extensions:

```typescript
const mimeTypes = {
  'jpg': 'image/jpeg',
  'png': 'image/png',
  'mp4': 'video/mp4',
  'mp3': 'audio/mpeg',
  // ... more mappings
};
```

## Error Handling

### Transfer Failures
- Network errors are logged and reported
- Original URLs are preserved if transfer fails
- Generation continues with original URLs

### Lambda Errors
- Lambda execution errors are caught and logged
- Detailed error messages are provided
- Fallback to original URLs

## Monitoring

### Logs
- Transfer attempts are logged with timing information
- Success/failure status is recorded
- CDN URLs are logged for verification

### Metrics
- Transfer duration tracking
- Success rate monitoring
- File size and type statistics

## Testing

### Test Script
Run the comprehensive test suite:

```bash
npm run test-media-transfer
```

### Test Cases
1. **Image Transfer**: PNG file from Wikimedia
2. **Video Transfer**: Sample MP4 file
3. **Multiple Transfers**: Batch processing test
4. **Error Handling**: Invalid URL testing

## Database Integration

### Updated Fields
The generation records now include:

- `cdnUrl`: The final CDN URL for the media
- `s3Key`: S3 object key for the transferred file
- `assetId`: UUID of the transferred asset
- `transferredToS3`: Boolean indicating transfer success

### Storage Methods
- `updateGenerationWithAsset()`: Updated to handle CDN URLs
- `updateGenerationWithSecureAsset()`: Enhanced with transfer metadata

## Security Considerations

### Access Control
- Lambda function uses least-privilege IAM roles
- S3 bucket access is restricted to specific operations
- CDN URLs are public but use UUID-based naming

### File Validation
- MIME type validation prevents malicious uploads
- File extension validation ensures proper handling
- Size limits are enforced by Lambda configuration

## Performance

### Optimization
- Concurrent transfers are limited to prevent Lambda throttling
- Small delays between batch transfers
- Efficient streaming from source to S3

### Timeouts
- Lambda timeout: 300 seconds (5 minutes)
- Transfer timeout: 8 minutes (generation timeout)
- Network timeout: Handled by Lambda retry logic

## Troubleshooting

### Common Issues

1. **"Function not found"**
   - Ensure ExternalFileTransferToS3 Lambda is deployed
   - Check AWS region configuration

2. **"Access denied"**
   - Verify AWS credentials in .env file
   - Check IAM role permissions

3. **"Transfer failed"**
   - Check source URL accessibility
   - Verify S3 bucket permissions
   - Review Lambda logs in CloudWatch

### Debug Mode
Enable detailed logging by checking:
- Lambda execution logs in CloudWatch
- Application logs for transfer attempts
- Network connectivity to source URLs

## Future Enhancements

### Planned Features
1. **Progressive Transfer**: Stream media while generating
2. **Compression**: Automatic image/video optimization
3. **Metadata Extraction**: Extract and store media metadata
4. **Thumbnail Generation**: Automatic thumbnail creation
5. **Backup Strategy**: Redundant storage options

### Scalability
- Horizontal scaling of Lambda functions
- CDN edge caching optimization
- Multi-region deployment support

## Support

For issues or questions:
1. Check the Lambda logs in CloudWatch
2. Review application logs for transfer attempts
3. Test with the provided test script
4. Verify environment configuration

## Changelog

### v1.0.0 (Current)
- Initial integration with ExternalFileTransferToS3 Lambda
- Automatic media transfer in workflow processing
- CDN URL generation and storage
- Comprehensive error handling and logging
- Test suite and documentation 