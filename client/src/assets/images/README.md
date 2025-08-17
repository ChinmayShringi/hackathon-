# Image Assets

## Current Images

### Migrated from attached_assets:
- `IMG_3727_1749903082039.png` - Original attachment
- `image_1749924486526.png` - Original attachment  
- `image_1749982395478.png` - Original attachment
- `image_1750011602526.png` - Original attachment
- `image_1750093996090.png` - Original attachment
- `image_1750094018200.png` - Original attachment
- `image_1750793158672.png` - Original attachment

## Usage Examples

```typescript
// Import images from this folder
import heroImage from "@assets/images/hero-banner.png";
import logoIcon from "@assets/images/company-logo.svg";

// Use in components
<img src={heroImage} alt="Hero banner" />
<img src={logoIcon} alt="Company logo" />
```

## Naming Convention

- Use descriptive names: `hero-banner.png` instead of `image_123.png`
- Use kebab-case for consistency
- Include purpose/context in filename when possible
- Consider renaming migrated files to more descriptive names