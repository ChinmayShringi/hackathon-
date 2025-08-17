import { useEffect, useRef } from 'react';

interface MetadataProps {
  title: string;
  description: string;
  image?: string;
  canonicalUrl?: string;
  publishedTime?: string;
  type?: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export default function Metadata({
  title,
  description,
  image = '/icons/social-card.png',
  canonicalUrl,
  publishedTime,
  type = 'website',
  keywords = 'AI, artificial intelligence, image generation, video creation, content creation, delula',
  author = 'Scrypted',
  ogTitle,
  ogDescription
}: MetadataProps) {
  const initializedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate initialization
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Update document title
    document.title = title;

    // Helper function to update or create meta tags
    const updateMetaTag = (property: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', property);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Helper function to update or create link tags
    const updateLinkTag = (rel: string, href: string, type?: string, sizes?: string) => {
      const selector = `link[rel="${rel}"]${sizes ? `[sizes="${sizes}"]` : ''}`;
      let link = document.querySelector(selector) as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        if (type) link.setAttribute('type', type);
        if (sizes) link.setAttribute('sizes', sizes);
        document.head.appendChild(link);
      }
      
      link.setAttribute('href', href);
    };

    // Standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    updateMetaTag('theme-color', '#2c1e57');
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');

    // Open Graph tags
    updateMetaTag('og:title', ogTitle || title, true);
    updateMetaTag('og:description', ogDescription || description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', canonicalUrl || window.location.href, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'delula', true);
    if (publishedTime) {
      updateMetaTag('og:published_time', publishedTime, true);
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:site', '@delula_ai');

    // Farcaster tags (using Open Graph format for compatibility)
    updateMetaTag('fc:frame', 'vNext', true);
    updateMetaTag('fc:frame:image', image, true);
    updateMetaTag('fc:frame:title', title, true);
    updateMetaTag('fc:frame:description', description, true);

    // Canonical URL
    updateLinkTag('canonical', canonicalUrl || window.location.href);

    // Favicon and app icons
    updateLinkTag('icon', '/icons/favicon.ico', 'image/x-icon');
    updateLinkTag('icon', '/icons/favicon-16x16.png', 'image/png', '16x16');
    updateLinkTag('icon', '/icons/favicon-32x32.png', 'image/png', '32x32');
    updateLinkTag('icon', '/icons/favicon-48x48.png', 'image/png', '48x48');
    updateLinkTag('icon', '/icons/favicon-96x96.png', 'image/png', '96x96');
    
    // Apple touch icons
    updateLinkTag('apple-touch-icon', '/icons/apple-touch-icon-144x144.png', undefined, '144x144');
    updateLinkTag('apple-touch-icon', '/icons/apple-touch-icon-152x152.png', undefined, '152x152');
    updateLinkTag('apple-touch-icon', '/icons/apple-touch-icon-180x180.png', undefined, '180x180');
    
    // Android Chrome icons
    updateLinkTag('icon', '/icons/android-chrome-192x192.png', 'image/png', '192x192');
    updateLinkTag('icon', '/icons/icon-256x256.png', 'image/png', '256x256');
    updateLinkTag('icon', '/icons/icon-512x512.png', 'image/png', '512x512');

    // Web app manifest
    updateLinkTag('manifest', '/manifest.webmanifest');

    // JSON-LD schema (basic website schema)
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'delula',
      description: description,
      url: canonicalUrl || window.location.origin,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${window.location.origin}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };

    // Remove existing JSON-LD script
    const existingJsonLd = document.querySelector('script[type="application/ld+json"]');
    if (existingJsonLd) {
      existingJsonLd.remove();
    }

    // Add new JSON-LD script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

  }, [title, description, image, canonicalUrl, publishedTime, type, keywords, author, ogTitle, ogDescription]);

  return null; // This component doesn't render anything
} 