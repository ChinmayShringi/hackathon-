interface MetadataProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export default function Metadata({ 
  title = "Delula - Coinbase CDP Integration Demo",
  description = "React TypeScript frontend demonstrating Coinbase CDP integration",
  keywords = "coinbase, cdp, crypto, payments, react, typescript"
}: MetadataProps) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  );
}
