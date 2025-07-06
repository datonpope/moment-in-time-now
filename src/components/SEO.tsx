import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export const SEO = ({
  title = 'Authentic Moments - 60 Seconds to Real',
  description = 'The only place you can\'t fake it. Capture and share authentic moments on Bluesky in 60 seconds - no edits, no filters, just real life.',
  image = 'https://hjemyrrniopogkbbewnm.supabase.co/storage/v1/object/public/moments/og-image.jpg',
  url = window.location.href,
  type = 'website',
  author,
  publishedTime,
  modifiedTime
}: SEOProps) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'Article' : 'WebSite',
    name: title,
    description,
    url,
    image,
    author: author ? {
      '@type': 'Person',
      name: author
    } : undefined,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    publisher: {
      '@type': 'Organization',
      name: 'Authentic Moments',
      logo: {
        '@type': 'ImageObject',
        url: `${window.location.origin}/favicon.ico`
      }
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Authentic Moments" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@authenticmoments" />
      
      {/* Article specific */}
      {type === 'article' && author && (
        <>
          <meta property="article:author" content={author} />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
        </>
      )}
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};