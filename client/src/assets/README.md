# Client Static Assets

This folder contains static assets that are part of the client build process.

## Usage

Import assets directly in your components:

```typescript
import logoImage from "@assets/logo.png";
import iconSvg from "@assets/icon.svg";

// Use in JSX
<img src={logoImage} alt="Logo" />
<img src={iconSvg} alt="Icon" />
```

## Supported File Types

- Images: .png, .jpg, .jpeg, .gif, .svg, .webp
- Fonts: .woff, .woff2, .ttf, .otf
- Other: .json, .txt

## Vite Processing

All assets in this folder are:
- Optimized during build
- Given unique hash-based filenames for cache busting
- Available via the `@assets/` import alias
- Automatically copied to the build output directory

## File Organization

Organize assets by type:
- `@assets/images/` - Image files
- `@assets/icons/` - Icon files  
- `@assets/fonts/` - Font files
- `@assets/data/` - JSON data files

## Asset Migration Workflow

**Important Rule**: Assets should follow this lifecycle:
1. **Staging**: New assets are first processed in `attached_assets/` 
2. **Review**: Assets are evaluated for integration into the system
3. **Migration**: Approved assets are moved to `client/src/assets/` and integrated into code
4. **Integration**: Code is updated to import from `@assets/` alias
5. **Cleanup**: Original files can be removed from `attached_assets/` after successful integration

This ensures proper version control and build process integration for all client assets.