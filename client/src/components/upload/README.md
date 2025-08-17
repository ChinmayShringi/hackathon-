# Upload Widget System

A modern, reusable file upload system for Delula recipes that integrates seamlessly with the existing media library infrastructure.

## 🚀 Features

- **Modern React Hooks**: Built with React hooks and modern patterns
- **Drag & Drop**: Full drag-and-drop support with visual feedback
- **Progress Tracking**: Real-time upload progress with cancel/retry functionality
- **Recipe Integration**: Seamlessly integrates with recipe forms
- **Multiple Variants**: Default, compact, and inline UI variants
- **Type Safety**: Full TypeScript support with proper interfaces
- **Validation**: Built-in and custom file validation
- **Error Handling**: Comprehensive error states and recovery

## 📦 Installation

The upload system uses these modern libraries:

```bash
npm install react-dropzone @radix-ui/react-progress lucide-react
```

## 🎯 Quick Start

### Basic Image Upload

```tsx
import { UploadImage } from '@/components/upload';

function MyRecipeForm() {
  const handleUploadComplete = (assetId: string) => {
    console.log('Uploaded asset:', assetId);
  };

  return (
    <UploadImage
      recipeId={recipe.id}
      recipeVariable="inputImage"
      onUploadComplete={handleUploadComplete}
    />
  );
}
```

### Multiple Upload Widgets

```tsx
function StyleTransferRecipe() {
  const [formData, setFormData] = useState({
    inputImage: '',
    styleImage: '',
    referenceImage: ''
  });

  const handleUploadComplete = (assetId: string, variable: string) => {
    setFormData(prev => ({ ...prev, [variable]: assetId }));
  };

  return (
    <div className="space-y-4">
      <UploadImage
        recipeId={recipe.id}
        recipeVariable="inputImage"
        placeholder="Upload content image to style"
        onUploadComplete={(assetId) => handleUploadComplete(assetId, 'inputImage')}
      />
      
      <UploadImage
        recipeId={recipe.id}
        recipeVariable="styleImage"
        variant="compact"
        placeholder="Upload style reference image"
        onUploadComplete={(assetId) => handleUploadComplete(assetId, 'styleImage')}
      />
      
      <UploadImage
        recipeId={recipe.id}
        recipeVariable="referenceImage"
        variant="inline"
        placeholder="Upload composition reference (optional)"
        onUploadComplete={(assetId) => handleUploadComplete(assetId, 'referenceImage')}
      />
    </div>
  );
}
```

## 🎨 UI Variants

### Default Variant
Large, prominent upload area with dashed border and centered content.

```tsx
<UploadImage variant="default" />
```

### Compact Variant
Smaller upload area for inline forms or tight layouts.

```tsx
<UploadImage variant="compact" />
```

### Inline Variant
Minimal upload area that integrates seamlessly with form layouts.

```tsx
<UploadImage variant="inline" />
```

## 🔧 Configuration Options

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `recipeId` | `number` | - | Recipe ID for asset association |
| `recipeVariable` | `string` | - | Recipe variable name for this upload |
| `variant` | `'default' \| 'compact' \| 'inline'` | `'default'` | UI variant style |
| `placeholder` | `string` | Auto-generated | Custom placeholder text |
| `className` | `string` | - | Additional CSS classes |

### Image-Specific Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxDimensions` | `{width: number, height: number}` | - | Maximum image dimensions |
| `aspectRatio` | `'free' \| '1:1' \| '16:9' \| '4:3'` | `'free'` | Enforce aspect ratio |
| `quality` | `'low' \| 'medium' \| 'high'` | `'medium'` | Image quality setting |
| `showPreview` | `boolean` | `true` | Show image preview |
| `previewSize` | `'sm' \| 'md' \| 'lg'` | `'md'` | Preview thumbnail size |

### Event Handlers

| Handler | Parameters | Description |
|---------|------------|-------------|
| `onUploadStart` | `(file: File) => void` | Called when upload begins |
| `onUploadProgress` | `(file: File, progress: number) => void` | Progress updates |
| `onUploadComplete` | `(assetId: string) => void` | Upload successful |
| `onUploadError` | `(file: File, error: string) => void` | Upload failed |
| `onUploadCancel` | `(file: File) => void` | Upload canceled |

## ✅ Validation

### Built-in Validation

The system automatically validates:
- File type (must be image)
- File size (max 25MB for images)
- MIME type compatibility

### Custom Validation

```tsx
<UploadImage
  validator={(file) => {
    // Custom validation logic
    if (file.size > 10 * 1024 * 1024) {
      return 'File must be smaller than 10MB';
    }
    
    // Check dimensions
    return new Promise<string | null>((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 512 || img.height < 512) {
          resolve('Image must be at least 512x512 pixels');
        } else {
          resolve(null);
        }
      };
      img.onerror = () => resolve('Invalid image file');
      img.src = URL.createObjectURL(file);
    });
  }}
/>
```

## 🔄 State Management

The upload widget manages its own state and provides it through the `useUploadWidget` hook:

```tsx
const { state, dropzone, handleFileSelect, handleCancel, handleRetry } = useUploadWidget(props);

// State includes:
// - status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error' | 'canceled'
// - progress: number (0-100)
// - message: string
// - assetId: string
// - error: string
// - file: File
```

## 🎬 Upload Flow

1. **File Selection**: User selects file via drag & drop or file picker
2. **Validation**: File is validated (type, size, custom rules)
3. **Presign**: Backend generates presigned S3 URL
4. **Upload**: File is uploaded to S3 with progress tracking
5. **Finalize**: Asset is finalized and stored in database
6. **Recipe Association**: Asset is associated with recipe variable
7. **Completion**: Success callback with asset ID

## 🏗️ Architecture

### Components

- **`AbstractUploadWidget`**: Base class with common functionality
- **`UploadImage`**: Concrete image upload implementation
- **`useUploadWidget`**: React hook for functional components

### Services

- **`UploadService`**: Core upload logic and S3 integration
- **Media Library API**: Existing backend infrastructure

### Integration Points

- **Recipe Forms**: Embed upload widgets in recipe generation forms
- **Asset Management**: Leverages existing `userAssets` table
- **S3 Storage**: Uses existing presigned URL system

## 🧪 Testing

### Demo Page

Visit `/upload-demo` to see the upload widgets in action:

- Multiple upload variants
- Recipe integration examples
- Form data handling
- Error states and recovery

### Testing Checklist

- [ ] File selection (drag & drop, file picker)
- [ ] Progress tracking and cancellation
- [ ] Error handling and retry
- [ ] Recipe variable binding
- [ ] Asset ID return
- [ ] UI variants and responsiveness

## 🚀 Future Enhancements

### Planned Features

- **UploadVideo**: Video upload with frame extraction
- **UploadAudio**: Audio upload with waveform generation
- **UploadDocument**: Document upload with preview
- **Batch Uploads**: Multiple file selection and upload
- **Asset Library**: Browse and select existing assets

### Recipe Integration

- **Recipe Schema**: Dynamic upload widget injection
- **Asset Validation**: Recipe-specific file requirements
- **Workflow Support**: Component system integration

## 📚 Examples

### Recipe Form Integration

```tsx
// In your recipe form component
function RecipeForm({ recipe }) {
  const [formData, setFormData] = useState({});
  
  const handleUploadComplete = (assetId: string, variable: string) => {
    setFormData(prev => ({ ...prev, [variable]: assetId }));
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <UploadImage
        recipeId={recipe.id}
        recipeVariable="inputImage"
        onUploadComplete={(assetId) => handleUploadComplete(assetId, 'inputImage')}
      />
      
      <button type="submit">Generate</button>
    </form>
  );
}
```

### Custom Styling

```tsx
<UploadImage
  className="my-custom-upload"
  variant="compact"
  placeholder="Custom placeholder text"
/>
```

### Advanced Validation

```tsx
<UploadImage
  maxDimensions={{ width: 1024, height: 1024 }}
  validator={(file) => {
    // Complex validation logic
    return validateImageForRecipe(file, recipe);
  }}
/>
```

## 🔍 Troubleshooting

### Common Issues

1. **File Not Uploading**: Check file size and type restrictions
2. **Validation Errors**: Verify custom validator logic
3. **Progress Not Updating**: Ensure proper event handler setup
4. **Recipe Integration**: Verify recipeId and recipeVariable props

### Debug Mode

Enable console logging for debugging:

```tsx
<UploadImage
  onUploadStart={(file) => console.log('Upload started:', file)}
  onUploadProgress={(file, progress) => console.log('Progress:', progress)}
  onUploadComplete={(assetId) => console.log('Complete:', assetId)}
  onUploadError={(file, error) => console.error('Error:', error)}
/>
```

## 📖 API Reference

### UploadImage Props

```tsx
interface UploadImageProps {
  // Core configuration
  recipeId?: number;
  recipeVariable?: string;
  variant?: 'default' | 'compact' | 'inline';
  placeholder?: string;
  className?: string;
  
  // Image options
  maxDimensions?: { width: number; height: number };
  aspectRatio?: 'free' | '1:1' | '16:9' | '4:3';
  quality?: 'low' | 'medium' | 'high';
  showPreview?: boolean;
  previewSize?: 'sm' | 'md' | 'lg';
  
  // Event handlers
  onUploadStart?: (file: File) => void;
  onUploadProgress?: (file: File, progress: number) => void;
  onUploadComplete?: (assetId: string) => void;
  onUploadError?: (file: File, error: string) => void;
  onUploadCancel?: (file: File) => void;
  
  // Validation
  validator?: (file: File) => string | null | Promise<string | null>;
}
```

---

**Built with ❤️ for Delula** - Modern file uploads that just work.
