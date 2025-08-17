export interface RouteMetadata {
  title: string;
  description: string;
  image?: string;
  canonicalUrl?: string;
  keywords?: string;
  type?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export interface MetadataConfig {
  [route: string]: RouteMetadata;
}

// Default metadata for the site
export const DEFAULT_METADATA: RouteMetadata = {
  title: "Delula: One-Click Viral Hits",
  description: "Delula creates one-click viral hits - no prompts, no hassle. Instantly generate videos and images you can customize with a friendly point-and-click interface.",
  image: "/icons/social-card.png",
  canonicalUrl: "https://delu.la",
  keywords: "AI content creator, one-click viral videos, no-prompt image generator, text-free AI tool, generate images and videos, instant content creation, creator tools, customizable AI media",
  type: "website",
  ogTitle: "Delula: One-Click Viral Hits",
  ogDescription: "No prompts. No waiting. Just scroll-stopping videos and images, generated instantly and customized your way."
};

// Route-specific metadata configurations
export const ROUTE_METADATA: MetadataConfig = {
  "/": DEFAULT_METADATA,
  
  "/alpha": {
    title: "Delula Alpha: One-Click Viral Hits",
    description: "Delula creates one-click viral hits - no prompts, no hassle. Instantly generate videos and images you can customize with a friendly point-and-click interface.",
    image: "/delula-alpha-preview.png",
    canonicalUrl: "https://delu.la/alpha",
    keywords: "AI content creator, one-click viral videos, no-prompt image generator, text-free AI tool, generate images and videos, instant content creation, creator tools, customizable AI media",
    type: "website",
    ogTitle: "Delula: One-Click Viral Hits",
    ogDescription: "No prompts. No waiting. Just scroll-stopping videos and images, generated instantly and customized your way."
  },
  
  "/alpha/my-makes": {
    title: "My Makes - Delula Alpha",
    description: "View and manage your AI-generated content. See all your videos and images created with Delula's one-click viral content generator.",
    image: "/icons/social-card.png",
    canonicalUrl: "https://delu.la/alpha/my-makes",
    keywords: "my makes, AI content, generated videos, generated images, content gallery, delula creations",
    type: "website",
    ogTitle: "My Makes - Delula Alpha",
    ogDescription: "View and manage your AI-generated content. See all your videos and images created with Delula."
  },
  
  "/pricing": {
    title: "Pricing - Delula",
    description: "Choose the perfect plan for your AI content creation needs. From free trials to unlimited generation, find the right Delula plan for you.",
    image: "/icons/social-card.png",
    canonicalUrl: "https://delu.la/pricing",
    keywords: "delula pricing, AI content pricing, video generation cost, image generation cost, content creation plans",
    type: "website",
    ogTitle: "Pricing - Delula",
    ogDescription: "Choose the perfect plan for your AI content creation needs. From free trials to unlimited generation."
  },
  
  "/gallery": {
    title: "Gallery - Delula",
    description: "Explore amazing AI-generated content created with Delula. Discover viral videos, stunning images, and creative content from our community.",
    image: "/icons/social-card.png",
    canonicalUrl: "https://delu.la/gallery",
    keywords: "delula gallery, AI content gallery, generated videos, generated images, community content, viral content",
    type: "website",
    ogTitle: "Gallery - Delula",
    ogDescription: "Explore amazing AI-generated content created with Delula. Discover viral videos, stunning images, and creative content."
  },
  
  "/create": {
    title: "Create Content - Delula",
    description: "Start creating amazing AI content with Delula. Choose from proven recipes and generate viral videos and images instantly.",
    image: "/icons/social-card.png",
    canonicalUrl: "https://delu.la/create",
    keywords: "create AI content, generate videos, generate images, content creation, delula recipes",
    type: "website",
    ogTitle: "Create Content - Delula",
    ogDescription: "Start creating amazing AI content with Delula. Choose from proven recipes and generate viral videos and images instantly."
  },
  
  "/tutorials": {
    title: "Tutorials - Delula",
    description: "Learn how to create amazing AI content with Delula. Step-by-step tutorials, tips, and tricks for maximizing your content creation.",
    image: "/icons/social-card.png",
    canonicalUrl: "https://delu.la/tutorials",
    keywords: "delula tutorials, AI content tutorials, video creation guide, image generation guide, content creation tips",
    type: "website",
    ogTitle: "Tutorials - Delula",
    ogDescription: "Learn how to create amazing AI content with Delula. Step-by-step tutorials, tips, and tricks for maximizing your content creation."
  },
  
  "/privacy-policy": {
    title: "Privacy Policy - Delula",
    description: "Learn how Delula protects your privacy and handles your data. Our commitment to transparency and data security.",
    image: "/icons/social-card.png",
    canonicalUrl: "https://delu.la/privacy-policy",
    keywords: "delula privacy policy, data protection, privacy, security, user data",
    type: "website",
    ogTitle: "Privacy Policy - Delula",
    ogDescription: "Learn how Delula protects your privacy and handles your data. Our commitment to transparency and data security."
  },
  
  "/terms-of-service": {
    title: "Terms of Service - Delula",
    description: "Read Delula's terms of service and user agreement. Understand your rights and responsibilities when using our AI content creation platform.",
    image: "/icons/social-card.png",
    canonicalUrl: "https://delu.la/terms-of-service",
    keywords: "delula terms of service, user agreement, terms and conditions, legal",
    type: "website",
    ogTitle: "Terms of Service - Delula",
    ogDescription: "Read Delula's terms of service and user agreement. Understand your rights and responsibilities when using our platform."
  }
};

/**
 * Get metadata for a specific route
 */
export function getRouteMetadata(pathname: string): RouteMetadata {
  // Normalize the pathname
  const normalizedPath = pathname === "" ? "/" : pathname;
  
  // Check for exact match first
  if (ROUTE_METADATA[normalizedPath]) {
    return ROUTE_METADATA[normalizedPath];
  }
  
  // Check for dynamic routes (like /m/:id for media viewer)
  if (normalizedPath.startsWith("/m/")) {
    return {
      title: "View Content - Delula",
      description: "View and share AI-generated content created with Delula. Discover amazing videos and images from our community.",
      image: "/icons/social-card.png",
      canonicalUrl: `https://delu.la${normalizedPath}`,
      keywords: "view content, AI content, generated videos, generated images, delula content",
      type: "website",
      ogTitle: "View Content - Delula",
      ogDescription: "View and share AI-generated content created with Delula. Discover amazing videos and images from our community."
    };
  }
  
  // Return default metadata for unknown routes
  return DEFAULT_METADATA;
}

/**
 * Generate HTML meta tags from metadata
 */
export function generateMetaTags(metadata: RouteMetadata): string {
  const {
    title,
    description,
    image = "/icons/social-card.png",
    canonicalUrl = "https://delu.la",
    keywords = "AI content creator, one-click viral videos, no-prompt image generator, text-free AI tool, generate images and videos, instant content creation, creator tools, customizable AI media",
    type = "website",
    ogTitle,
    ogDescription
  } = metadata;

  return `
    <!-- Primary Meta Tags -->
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${keywords}" />
    <meta name="author" content="Scrypted" />
    <meta name="robots" content="index, follow" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#2c1e57" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:title" content="${ogTitle || title}" />
    <meta property="og:description" content="${ogDescription || description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:site_name" content="delula" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:site" content="@delula_ai" />
    
    <!-- Farcaster -->
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${image}" />
    <meta property="fc:frame:title" content="${title}" />
    <meta property="fc:frame:description" content="${description}" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${canonicalUrl}" />
    
    <!-- Favicon and App Icons -->
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    <link rel="icon" href="/icons/favicon-16x16.png" type="image/png" sizes="16x16" />
    <link rel="icon" href="/icons/favicon-32x32.png" type="image/png" sizes="32x32" />
    <link rel="icon" href="/icons/favicon-48x48.png" type="image/png" sizes="48x48" />
    <link rel="icon" href="/icons/favicon-96x96.png" type="image/png" sizes="96x96" />
    
    <!-- Apple Touch Icons (Safari optimized) -->
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon-180x180.png" />
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon-152x152.png" sizes="152x152" />
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon-144x144.png" sizes="144x144" />
    
    <!-- Safari-specific meta tags -->
    <meta name="apple-mobile-web-app-title" content="Delula" />
    <meta name="apple-touch-fullscreen" content="yes" />
    
    <!-- Android Chrome Icons -->
    <link rel="icon" href="/icons/android-chrome-192x192.png" type="image/png" sizes="192x192" />
    <link rel="icon" href="/icons/icon-256x256.png" type="image/png" sizes="256x256" />
    <link rel="icon" href="/icons/icon-512x512.png" type="image/png" sizes="512x512" />
    
    <!-- Web App Manifest -->
    <link rel="manifest" href="/manifest.webmanifest" />
    
    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "delula",
      "description": "${description}",
      "url": "${canonicalUrl}",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://delu.la/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
    </script>
  `.trim();
} 