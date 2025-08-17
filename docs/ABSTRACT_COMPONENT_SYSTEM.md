# Abstract Component System

## 🎯 **Overview**

The Abstract Component System is a **fully implemented**, non-intrusive architecture for building composable AI service components in Delula. It provides a foundation for creating complex workflows by connecting simple, reusable components with type-safe inputs and outputs.

**Status**: ✅ **PRODUCTION READY** - Fully implemented and tested
**Compatibility**: 🚫 **NO IMPACT** on existing production code or recipes
**Database Registry**: ✅ **IMPLEMENTED** - Components are registered and discoverable
**Validation System**: ✅ **IMPLEMENTED** - Comprehensive validation framework

## 🏗️ **System Architecture**

### **Core Components**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Component     │    │  Workflow       │    │  Workflow       │
│   Interface     │    │  Definition     │    │  Engine         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   BaseComponent │    │  Component      │    │  Execution      │
│   (Abstract)    │    │  Connections    │    │  Context        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Key Features**

- **Type Safety**: Strong typing with `ComponentInputType` constants
- **Input Ordering**: Position-based input processing to maintain data flow
- **Validation**: Built-in input validation and constraint checking
- **Dual Processing**: Both ordered and named input methods
- **Workflow Composition**: Connect components to create complex pipelines
- **Cycle Detection**: Prevents infinite loops in workflows
- **Topological Sorting**: Ensures proper execution order

## 🔧 **Component System**

### **Component Interface**

```typescript
interface Component {
  id: string;                    // Unique identifier
  name: string;                  // Human-readable name
  inputChannels: InputChannel[]; // Input configuration
  outputChannels: OutputChannel[]; // Output configuration
  
  // Primary: Ordered processing
  process(inputs: any[]): Promise<any[]>;
  
  // Secondary: Named processing
  processNamed(inputs: Record<string, any>): Promise<Record<string, any>>;
}
```

### **Input/Output Channels**

```typescript
interface InputChannel {
  id: string;           // Channel identifier
  type: number;         // ComponentInputType constant
  required: boolean;    // Whether input is required
  position: number;     // Processing order (0-based)
  description?: string; // Human-readable description
  validation?: {        // Validation rules
    min?: number;
    max?: number;
    pattern?: string;
    allowedValues?: any[];
    customValidator?: (value: any) => boolean | string;
  };
  defaultValue?: any;   // Default value if not provided
}

interface OutputChannel {
  id: string;           // Channel identifier
  type: number;         // ComponentInputType constant
  description?: string; // Human-readable description
  metadata?: {          // Format and quality info
    format?: string;
    quality?: string;
    dimensions?: string;
  };
}
```

### **Type Constants**

The system uses integer constants for type safety:

```typescript
export class ComponentInputType {
  // Image types
  static readonly IMAGE = 1;
  static readonly IMAGE_URL = 2;
  static readonly IMAGE_BASE64 = 3;
  
  // Video types
  static readonly VIDEO = 5;
  static readonly VIDEO_URL = 6;
  
  // Text types
  static readonly TEXT = 9;
  static readonly TEXT_PROMPT = 10;
  
  // Numeric types
  static readonly NUMBER = 17;
  static readonly INTEGER = 18;
  
  // Boolean types
  static readonly BOOLEAN = 21;
  
  // Special types
  static readonly JSON = 23;
  static readonly METADATA = 24;
}

## 🧩 **Available Components**

### **GetFramesFromVideoComponent** ✅ **PRODUCTION READY**

**Purpose**: Extracts specific frames from videos using the GetFramesFromVideo Lambda

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

### **ImageToVideoComponent** 🧪 **EXAMPLE IMPLEMENTATION**

**Purpose**: Demonstrates component system patterns and validation

**Input Channels**:
- `baseImage` (required): Base image to animate
- `prompt` (required): Text prompt describing the video
- `duration` (optional): Video duration in seconds (default: 8)
- `aspectRatio` (optional): Video aspect ratio (default: "16:9")
- `quality` (optional): Video quality setting (default: "hd")

**Output Channels**:
- `video`: Generated video URL
- `thumbnail`: Video thumbnail URL
- `metadata`: Video metadata and processing information

**Status**: Reference implementation for component development

## 🔍 **Validation System**

### **Reusable Validators**

The system includes comprehensive validation utilities in `shared/validation-utils.ts`:

- **`videoUrlValidator`**: Video URL validation with pattern and custom validation
- **`imageUrlValidator`**: Image URL validation with pattern and custom validation
- **`frameKeyValidator`**: Frame key format validation for video extraction
- **`validateFrameKeys()`**: Function to validate arrays of frame keys
- **`validateUrl()`**: Generic URL validation with protocol restrictions
- **`validateTextLength()`**: Text length constraints and validation
- **`validateNumeric()`**: Numeric value constraints and validation

### **Custom Validation**

Components can implement custom validation logic:

```typescript
validation: {
  pattern: '^https?://.*\\.(mp4|webm|avi|mov|mkv|flv|wmv)$',
  customValidator: (value: string) => {
    if (value.length > 2048) {
      return 'Video URL must be less than 2048 characters';
    }
    if (!value.startsWith('http')) {
      return 'Video URL must start with http:// or https://';
    }
    return true;
  }
}
```

## 🗄️ **Database Registry**

### **Component Registration**

Components are automatically registered in the database through the `ComponentRegistryService`:

- **Metadata Storage**: Component information, version, category, tags
- **Input/Output Channels**: Detailed channel definitions with validation rules
- **Usage Tracking**: Execution statistics, performance metrics, error tracking
- **Dependency Management**: Component relationships and requirements

### **Registry Tables**

- **`component_registry`**: Core component metadata
- **`component_input_channels`**: Input channel definitions with validation
- **`component_output_channels`**: Output channel definitions with metadata
- **`component_usage`**: Usage tracking and analytics
- **`component_dependencies`**: Dependency relationships

### **Usage Example**

```typescript
import { ComponentRegistryService } from '../shared/component-registry-service';

const registryService = new ComponentRegistryService();

// Register a component
await registryService.registerComponent(component);

// Get available components
const components = await registryService.getAvailableComponents();

// Track component usage
await registryService.trackComponentUsage(
  component.id,
  userId,
  executionId,
  inputs,
  outputs,
  processingTime,
  creditCost,
  success
);
```

## 🧪 **Testing and Development**

### **Testing Tools**

- **`scripts/test-get-frames-component.tsx`**: Comprehensive component testing
- **`scripts/demo-component-system.tsx`**: System demonstration and examples
- **`scripts/register-components.tsx`**: Database registration and verification

### **Testing the GetFramesFromVideo Component**

```bash
# Run comprehensive component test
npx tsx scripts/test-get-frames-component.tsx

# Test includes:
# - Component instantiation and metadata
# - Input validation (valid/invalid URLs, frame keys)
# - Lambda execution and response processing
# - Output format validation
# - Database registry integration
# - Usage tracking and statistics
```

### **Component Development Workflow**

1. **Create Component**: Extend `BaseComponent` with input/output channels
2. **Implement Logic**: Write the `process()` method with business logic
3. **Add Validation**: Use built-in validators or create custom validation
4. **Test Component**: Use the testing framework to verify functionality
5. **Register Component**: Add to database registry for discovery
6. **Integration**: Use in workflows or expose via API endpoints

### **Best Practices**

- **Input Validation**: Always validate inputs using the validation system
- **Error Handling**: Provide clear error messages for validation failures
- **Type Safety**: Use `ComponentInputType` constants for channel types
- **Documentation**: Include comprehensive descriptions for all channels
- **Testing**: Write tests that cover all input scenarios and edge cases
```
```

## 🚀 **Workflow System**

### **Workflow Definition**

```typescript
interface Workflow {
  id: string;                    // Unique identifier
  name: string;                  // Human-readable name
  components: Component[];       // Components in workflow
  connections: ComponentConnection[]; // Data flow connections
  metadata?: {                   // Workflow metadata
    version?: string;
    author?: string;
    tags?: string[];
    estimatedCost?: number;
    estimatedTime?: number;
  };
}
```

### **Component Connections**

```typescript
interface ComponentConnection {
  fromComponent: string;  // Source component ID
  fromChannel: string;    // Source output channel ID
  toComponent: string;    // Target component ID
  toChannel: string;      // Target input channel ID
}
```

### **Workflow Engine**

The `WorkflowEngine` class handles:

- **Validation**: Checks workflow structure and connections
- **Topological Sorting**: Determines execution order
- **Cycle Detection**: Prevents infinite loops
- **Data Flow**: Manages input/output between components
- **Error Handling**: Comprehensive error reporting

## 📝 **Implementation Examples**

### **Creating a Component**

```typescript
import { BaseComponent, InputChannel, OutputChannel } from '../shared/component-system';
import { ComponentInputType } from '../shared/component-types';

export class ImageToVideoComponent extends BaseComponent {
  id = 'image-to-video';
  name = 'Image to Video';
  
  inputChannels: InputChannel[] = [
    {
      id: 'baseImage',
      type: ComponentInputType.IMAGE_URL,
      required: true,
      position: 0,
      description: 'Base image to animate into video',
      validation: {
        pattern: '^https?://.*\\.(jpg|jpeg|png|webp)$'
      }
    },
    {
      id: 'prompt',
      type: ComponentInputType.TEXT_PROMPT,
      required: true,
      position: 1,
      description: 'Text prompt describing the video',
      validation: {
        min: 10,
        max: 1000
      }
    }
  ];
  
  outputChannels: OutputChannel[] = [
    {
      id: 'video',
      type: ComponentInputType.VIDEO_URL,
      description: 'Generated video URL'
    }
  ];
  
  async process(inputs: any[]): Promise<any[]> {
    // inputs[0] = baseImage, inputs[1] = prompt
    const [baseImage, prompt] = inputs;
    
    // Process the inputs and generate video
    const videoUrl = await this.generateVideo(baseImage, prompt);
    
    return [videoUrl]; // Match outputChannels order
  }
}
```

### **Building a Workflow**

```typescript
import { WorkflowEngine } from '../shared/workflow-engine';

const workflow: Workflow = {
  id: 'text-to-video-pipeline',
  name: 'Text to Video Pipeline',
  components: [textToImageComponent, imageToVideoComponent],
  connections: [
    {
      fromComponent: 'text-to-image',
      fromChannel: 'image',
      toComponent: 'image-to-video',
      toChannel: 'baseImage'
    }
  ]
};

const workflowEngine = new WorkflowEngine();
const result = await workflowEngine.executeWorkflow(workflow, {
  prompt: 'A majestic cat performing Olympic diving'
});
```

## 🔍 **Input Order Enforcement**

### **Position-Based Processing**

The system enforces input processing order through the `position` field:

```typescript
inputChannels: InputChannel[] = [
  {
    id: 'baseImage',
    position: 0,  // First input
    // ... other properties
  },
  {
    id: 'prompt',
    position: 1,  // Second input
    // ... other properties
  }
];
```

### **Processing Methods**

1. **Ordered Processing**: `process(inputs: any[])`
   - Inputs array must match `inputChannels` order
   - `inputs[0]` goes to position 0, `inputs[1]` to position 1, etc.

2. **Named Processing**: `processNamed(inputs: Record<string, any>)`
   - Inputs provided by channel ID
   - Automatically converted to ordered array using position field

### **Order Validation**

```typescript
// This works (correct order)
const inputs = ['image.jpg', 'prompt text'];
await component.process(inputs);

// This also works (position field handles it)
const inputs = ['prompt text', 'image.jpg']; // Wrong order
await component.process(inputs); // Still works due to position field

// This fails (missing required input)
const inputs = ['image.jpg']; // Missing prompt
await component.process(inputs); // Throws validation error
```

## 🧪 **Testing and Validation**

### **Component Validation**

```typescript
// Test component with valid inputs
const component = new ImageToVideoComponent();
const validInputs = {
  baseImage: 'https://example.com/image.jpg',
  prompt: 'A cat diving into water'
};

try {
  const result = await component.processNamed(validInputs);
  console.log('✅ Component processed successfully');
} catch (error) {
  console.error('❌ Validation failed:', error.message);
}
```

### **Workflow Validation**

```typescript
// Test workflow structure
const workflowEngine = new WorkflowEngine();

try {
  const result = await workflowEngine.executeWorkflow(workflow, inputs);
  console.log('✅ Workflow executed successfully');
} catch (error) {
  if (error.message.includes('cycle')) {
    console.error('❌ Workflow contains cycles');
  } else if (error.message.includes('connection')) {
    console.error('❌ Invalid component connections');
  }
}
```

## 🚨 **Error Handling**

### **Validation Errors**

- **Missing Required Inputs**: Throws error if required inputs are not provided
- **Type Mismatches**: Validates input types against expected types
- **Constraint Violations**: Checks min/max values, patterns, allowed values
- **Custom Validation**: Supports custom validation functions

### **Workflow Errors**

- **Cycles**: Detects and prevents infinite loops
- **Invalid Connections**: Validates component and channel references
- **Type Compatibility**: Ensures connected channels have compatible types
- **Execution Failures**: Handles component processing errors

## 🔮 **Future Enhancements**

### **Implemented Features** ✅

1. **Component Registry**: ✅ Central repository of available components
2. **Validation System**: ✅ Comprehensive input validation framework
3. **Database Integration**: ✅ Full component metadata storage
4. **Usage Tracking**: ✅ Component execution analytics
5. **Production Components**: ✅ GetFramesFromVideo component ready

### **Planned Features**

1. **Visual Editor**: Node-based workflow builder (similar to ComfyUI)
2. **Dynamic Workflows**: Runtime workflow modification
3. **Parallel Execution**: Support for concurrent component execution
4. **Caching**: Result caching for expensive operations
5. **Monitoring**: Real-time workflow execution monitoring
6. **Recipe Editor Integration**: Bridge to existing recipe system

### **Integration Points**

- **Existing Recipe System**: Bridge between old and new systems
- **AI Services**: Integration with FAL.ai, OpenAI, etc.
- **Database**: Component and workflow persistence
- **API**: REST endpoints for workflow management
- **Frontend**: React components for workflow building

## 📚 **Usage Guidelines**

### **Best Practices**

1. **Component Design**
   - Keep components focused and single-purpose
   - Use descriptive names for channels
   - Provide comprehensive validation rules
   - Include meaningful descriptions and metadata

2. **Workflow Design**
   - Start simple and add complexity gradually
   - Use meaningful component and connection names
   - Document workflow purpose and requirements
   - Test workflows with various input scenarios

3. **Error Handling**
   - Implement comprehensive input validation
   - Provide clear error messages
   - Handle edge cases gracefully
   - Log execution details for debugging

### **Performance Considerations**

- **Component Reuse**: Reuse components across workflows
- **Input Validation**: Validate early to fail fast
- **Async Processing**: Use async/await for I/O operations
- **Resource Management**: Clean up resources after processing

## 🔧 **Development Workflow**

### **Creating New Components**

1. **Define Interface**: Specify input/output channels
2. **Implement Logic**: Write the `process` method
3. **Add Validation**: Implement input validation rules
4. **Test Component**: Verify with various inputs
5. **Document Usage**: Provide examples and documentation

### **Building Workflows**

1. **Identify Requirements**: Define workflow goals
2. **Select Components**: Choose appropriate components
3. **Design Connections**: Plan data flow between components
4. **Test Workflow**: Validate with sample inputs
5. **Optimize**: Refine based on performance and results

## 📖 **API Reference**

### **Core Classes**

- **`ComponentInputType`**: Type constants and utilities
- **`BaseComponent`**: Abstract base class for components
- **`WorkflowEngine`**: Workflow execution engine
- **`WorkflowExecutionContext`**: Execution context management

### **Key Methods**

- **`Component.process()`**: Process ordered inputs
- **`Component.processNamed()`**: Process named inputs
- **`WorkflowEngine.executeWorkflow()`**: Execute workflow
- **`Component.validateInputs()`**: Validate component inputs

### **Utility Functions**

- **`ComponentInputType.isValidType()`**: Validate type constants
- **`ComponentInputType.getTypeName()`**: Get type names
- **`ComponentInputType.getTypeCategory()`**: Get type categories
- **`Component.getInputOrder()`**: Get input processing order

---

**Note**: This system is designed to be completely separate from the existing recipe system. It provides a foundation for future development without impacting current production functionality. The system is now **fully implemented** and ready for production use, with the GetFramesFromVideo component serving as a working example of the architecture.
