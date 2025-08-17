# Abstract Component System

## Overview

The Abstract Component System is a new architecture for building composable AI service components in Delula. It provides a foundation for creating complex workflows by connecting simple, reusable components with type-safe inputs and outputs.

## Architecture

### Core Components

- **`Component` Interface**: Base interface for all components with typed channels
- **`BaseComponent`**: Abstract class with common functionality and validation
- **`WorkflowEngine`**: Executes workflows with dependency management and error handling
- **`ComponentRegistryService`**: Database service for component discovery and usage tracking

### Key Features

- **Type Safety**: Strong typing with `ComponentInputType` constants (26 types)
- **Input Ordering**: Position-based input processing to maintain data flow
- **Validation**: Built-in input validation and constraint checking
- **Dual Processing**: Both ordered and named input methods
- **Workflow Composition**: Connect components to create complex pipelines
- **Cycle Detection**: Prevents infinite loops in workflows
- **Topological Sorting**: Ensures proper execution order
- **Database Registry**: Components are registered and discoverable for future recipe editor

## Available Components

### 1. GetFramesFromVideoComponent

**Purpose**: Extracts specific frames from a video using the GetFramesFromVideo Lambda

**Input Channels**:
- `videoUrl` (required): URL of the source video (validated as video URL)
- `frameKeys` (required): Array of frame keys like `["0", "-1", "50%", "90%"]`

**Output Channels**:
- `frames`: Dictionary where keys are original frame keys and values are frame results

**Frame Key Formats**:
- **Index**: `"0"`, `"1"`, `"2"` (positive integers)
- **Negative**: `"-1"`, `"-2"` (negative integers)
- **Percentage**: `"50%"`, `"90%"` (0-100%)

**Example Usage**:
```typescript
import { GetFramesFromVideoComponent } from '../shared/components';

const component = new GetFramesFromVideoComponent();
const inputs = [
  'https://cdn.delu.la/test/video.mp4',
  ['0', '-1', '50%', '90%']
];

const outputs = await component.process(inputs);
const frames = outputs[0];

// Output format:
// {
//   "0": { frame_id: 0, bucket_key: "images/intermediaries/uuid1.png" },
//   "-1": { frame_id: 15, bucket_key: "images/intermediaries/uuid2.png" },
//   "50%": { frame_id: 8, bucket_key: "images/intermediaries/uuid3.png" },
//   "90%": { frame_id: 14, bucket_key: "images/intermediaries/uuid4.png" }
// }
```

### 2. ImageToVideoComponent

**Purpose**: Example component demonstrating the system (doesn't actually call AI services)

**Input Channels**:
- `baseImage` (required): Base image to animate
- `prompt` (required): Text prompt describing the video
- `duration` (optional): Video duration in seconds (default: 8)
- `aspectRatio` (optional): Video aspect ratio (default: "16:9")
- `quality` (optional): Video quality setting (default: "hd")

**Output Channels**:
- `video`: Generated video URL

## Validation System

### Reusable Validators

The system includes reusable validation utilities in `shared/validation-utils.ts`:

- **`videoUrlValidator`**: Validates video URLs with pattern and custom validation
- **`imageUrlValidator`**: Validates image URLs with pattern and custom validation
- **`frameKeyValidator`**: Validates frame key formats for video extraction
- **`validateFrameKeys()`**: Function to validate arrays of frame keys
- **`validateUrl()`**: Generic URL validation
- **`validateTextLength()`**: Text length constraints
- **`validateNumeric()`**: Numeric value constraints

### Custom Validation

Components can implement custom validation logic:

```typescript
validation: {
  customValidator: (value: any) => {
    if (value.length > 1000) {
      return 'Value too long';
    }
    return true;
  }
}
```

## Database Registry

### Tables

- **`component_registry`**: Component metadata and configuration
- **`component_input_channels`**: Input channel definitions
- **`component_output_channels`**: Output channel definitions
- **`component_usage`**: Usage tracking and analytics
- **`component_dependencies`**: Component dependency relationships

### Registration

Components are automatically registered in the database:

```typescript
import { ComponentRegistryService } from '../shared/component-registry-service';

const registryService = new ComponentRegistryService();
await registryService.registerComponent(component);
```

### Discovery

Future recipe editor can discover available components:

```typescript
const components = await registryService.getAvailableComponents();
const component = await registryService.getComponentById('get-frames-from-video');
```

## Testing

### Test Scripts

- **`scripts/test-get-frames-component.tsx`**: Comprehensive testing of GetFramesFromVideo component
- **`scripts/register-components.tsx`**: Register all components in the database

### Running Tests

```bash
# Test the component with the specified test video
npx tsx scripts/test-get-frames-component.tsx

# Register components in the database
npx tsx scripts/register-components.tsx
```

## Integration with Existing Systems

### Lambda Functions

The GetFramesFromVideo component integrates with the existing AWS Lambda:

- **Function Name**: `GetFramesFromVideo`
- **AWS Credentials**: Uses `AWS_DELULA_ACCESS_KEY` and `AWS_DELULA_SECRET_ACCESS_KEY`
- **Region**: `us-east-1` (default)
- **Payload Format**: Matches lambda's expected `LambdaEvent` interface

### Environment Variables

Required environment variables:

```bash
AWS_DELULA_ACCESS_KEY=your_access_key
AWS_DELULA_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
DATABASE_URL=your_database_url
```

## Future Development

### Recipe Editor Integration

The component registry system enables:

- **Visual Workflow Editor**: Drag-and-drop component composition
- **Component Discovery**: Browse available components by category
- **Input/Output Validation**: Real-time validation of component connections
- **Usage Analytics**: Track component performance and usage patterns

### Component Expansion

Future components could include:

- **AI Service Components**: OpenAI, FAL.ai, and other AI providers
- **Media Processing**: Video editing, image manipulation, audio processing
- **Data Transformation**: JSON processing, CSV parsing, data validation
- **External APIs**: Third-party service integrations

## Best Practices

### Component Design

1. **Single Responsibility**: Each component should do one thing well
2. **Type Safety**: Use appropriate `ComponentInputType` constants
3. **Validation**: Implement comprehensive input validation
4. **Error Handling**: Provide clear error messages and graceful degradation
5. **Documentation**: Include detailed descriptions for all channels

### Performance

1. **Async Operations**: Use async/await for I/O operations
2. **Resource Management**: Clean up temporary resources
3. **Caching**: Cache expensive operations when possible
4. **Monitoring**: Track execution time and resource usage

### Security

1. **Input Validation**: Validate all inputs before processing
2. **Error Sanitization**: Don't expose sensitive information in errors
3. **Resource Limits**: Implement reasonable limits on input sizes
4. **Access Control**: Use appropriate authentication and authorization

## Troubleshooting

### Common Issues

1. **Validation Errors**: Check input format and validation rules
2. **Lambda Invocation**: Verify AWS credentials and function name
3. **Database Connection**: Ensure DATABASE_URL is properly configured
4. **Type Mismatches**: Verify ComponentInputType constants match expected types

### Debug Tools

- **Component Validation**: Use `component.validateInputs()` for input validation
- **Lambda Testing**: Test lambda function directly with AWS CLI
- **Database Queries**: Check component registry tables for registration status
- **Usage Tracking**: Monitor component usage and performance metrics
