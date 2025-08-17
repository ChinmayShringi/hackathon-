# Metadata Component

A comprehensive, dynamic metadata component for the delula web app that automatically injects SEO metadata, social media tags, and app icons.

## Features

### ✅ SEO Metadata
- `<title>` and `<meta name="description">`
- Keywords, author, and robots meta tags
- Canonical URL support
- Viewport and mobile optimization tags

### ✅ Social Media Cards
- **Open Graph** tags for Facebook, LinkedIn, etc.
- **Twitter Card** tags for Twitter sharing
- **Farcaster** frame tags for Farcaster compatibility
- Published time support for article-type content

### ✅ App Icons & PWA Support
- Complete favicon set (16x16, 32x32, 48x48, 96x96)
- Apple touch icons (144x144, 152x152, 180x180)
- Android Chrome icons (192x192, 256x256, 512x512)
- Web app manifest for PWA functionality
- Theme color (#2c1e57)

### ✅ Structured Data
- JSON-LD schema markup for search engines
- WebSite schema with search action
- Extensible for product/article schemas

## Usage

### Basic Usage

```tsx
import Metadata from "@/components/metadata";

export default function MyPage() {
  return (
    <div>
      <Metadata 
        title="My Page Title"
        description="My page description"
      />
      {/* Page content */}
    </div>
  );
}
```

### Advanced Usage with Page-Level Metadata

```tsx
import Metadata from "@/components/metadata";

// Export metadata object (recommended pattern)
export const metadata = {
  title: "Advanced Page - delula",
  description: "This page demonstrates advanced metadata features.",
  image: "/custom-preview.png",
  canonicalUrl: "https://delu.la/advanced-page",
  publishedTime: "2024-01-15T10:30:00Z",
  type: "article",
  keywords: "advanced, metadata, SEO, delula",
  author: "delula Team",
  ogTitle: "Custom OG Title for Social Sharing",
  ogDescription: "Custom Open Graph description for better social media engagement"
};

export default function AdvancedPage() {
  return (
    <div>
      <Metadata {...metadata} />
      {/* Page content */}
    </div>
  );
}
```

## Props Interface

```ts
interface MetadataProps {
  title: string;                    // Required: Page title
  description: string;              // Required: Page description
  image?: string;                   // Optional: Social card image (default: /icons/social-card.png)
  canonicalUrl?: string;            // Optional: Canonical URL (default: window.location.href)
  publishedTime?: string;           // Optional: ISO 8601 timestamp for articles
  type?: string;                    // Optional: Content type (default: "website")
  keywords?: string;                // Optional: SEO keywords
  author?: string;                  // Optional: Content author (default: "Scrypted")
  ogTitle?: string;                 // Optional: Custom Open Graph title (default: uses title)
  ogDescription?: string;           // Optional: Custom Open Graph description (default: uses description)
}
```

## Generated Meta Tags

### Standard SEO Tags
```html
<title>Page Title</title>
<meta name="description" content="Page description">
<meta name="keywords" content="AI, artificial intelligence, image generation, video creation, content creation, delula">
<meta name="author" content="Scrypted">
<meta name="robots" content="index, follow">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#2c1e57">
```

### Open Graph Tags
```html
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Page description">
<meta property="og:image" content="/image.png">
<meta property="og:url" content="https://delu.la/page">
<meta property="og:type" content="website">
<meta property="og:site_name" content="delula">
<meta property="og:published_time" content="2024-01-15T10:30:00Z">
```

### Twitter Card Tags
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Page description">
<meta name="twitter:image" content="/image.png">
<meta name="twitter:site" content="@delula_ai">
```

### Farcaster Tags
```html
<meta property="fc:frame" content="vNext">
<meta property="fc:frame:image" content="/image.png">
<meta property="fc:frame:title" content="Page Title">
<meta property="fc:frame:description" content="Page description">
```

### Icon Links
```html
<link rel="icon" href="/icons/favicon.ico" type="image/x-icon">
<link rel="icon" href="/icons/favicon-16x16.png" type="image/png" sizes="16x16">
<link rel="icon" href="/icons/favicon-32x32.png" type="image/png" sizes="32x32">
<link rel="icon" href="/icons/favicon-48x48.png" type="image/png" sizes="48x48">
<link rel="icon" href="/icons/favicon-96x96.png" type="image/png" sizes="96x96">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon-144x144.png" sizes="144x144">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon-152x152.png" sizes="152x152">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon-180x180.png" sizes="180x180">
<link rel="icon" href="/icons/android-chrome-192x192.png" type="image/png" sizes="192x192">
<link rel="icon" href="/icons/icon-256x256.png" type="image/png" sizes="256x256">
<link rel="icon" href="/icons/icon-512x512.png" type="image/png" sizes="512x512">
<link rel="manifest" href="/manifest.webmanifest">
```

### JSON-LD Schema
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "delula",
  "description": "Page description",
  "url": "https://delu.la/page",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://delu.la/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
```

## Required Icon Files

The following icon files should be placed in the `public/icons/` directory. These are generated once and committed to the repository:

```
public/icons/
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
├── favicon-48x48.png
├── favicon-96x96.png
├── apple-touch-icon-144x144.png
├── apple-touch-icon-152x152.png
├── apple-touch-icon-180x180.png
├── android-chrome-192x192.png
├── icon-256x256.png
├── icon-512x512.png
└── social-card.png (default social card image)
```

### Icon Generation (One-time Setup)

To generate these icons:

1. **Start with a high-resolution base image** (at least 512x512px)
2. **Use an online generator** like [RealFaviconGenerator](https://realfavicongenerator.net/) or [Favicon.io](https://favicon.io/)
3. **Or use command line tools** like ImageMagick:
   ```bash
   convert base.png -resize 16x16 favicon-16x16.png
   convert base.png -resize 32x32 favicon-32x32.png
   # ... repeat for all sizes
   ```
4. **Create favicon.ico** with multiple sizes (16x16, 32x32, 48x48)
5. **Create social-card.png** (1200x630px for optimal social sharing)
6. **Place all files** in `public/icons/` directory
7. **Commit to repository** - these files are now part of the project

## Behavior Rules

1. **No Duplicates**: Component prevents duplicate meta tags across renders
2. **Safe Fallbacks**: Missing optional props fall back to sensible defaults
3. **Client-Side**: Uses `useEffect` for dynamic tag injection
4. **Theme Color**: Uses delula brand color `#2c1e57`
5. **Default Image**: Falls back to `/icons/social-card.png` when no image provided
6. **Canonical URL**: Falls back to `window.location.href` when not provided

## Testing

Run the component tests:

```bash
npm test -- --testPathPattern=metadata
```

Tests verify:
- ✅ Correct title, description, and OG tags
- ✅ Dynamic props populate social cards
- ✅ Missing props fall back safely
- ✅ Icons and manifest links appear
- ✅ No duplicate meta tags
- ✅ JSON-LD schema structure

## Migration from SEOHead

The new `Metadata` component replaces the existing `SEOHead` component with:

- **More comprehensive** icon and PWA support
- **Better social media** coverage (Farcaster, enhanced Twitter)
- **Structured data** for search engines
- **Improved fallbacks** and error handling
- **Better TypeScript** support and testing

### Migration Steps

1. Replace import:
   ```tsx
   // Old
   import SEOHead from "@/components/seo-head";
   
   // New
   import Metadata from "@/components/metadata";
   ```

2. Update component usage:
   ```tsx
   // Old
   <SEOHead
     title="Page Title"
     description="Description"
     image="/image.png"
     url="/page"
   />
   
   // New
   <Metadata
     title="Page Title"
     description="Description"
     image="/image.png"
     canonicalUrl="https://delu.la/page"
   />
   ```

3. **One-time setup**: Generate and add required icon files to `public/icons/` (see Icon Generation section above)
4. Update any custom metadata exports to use the new interface 