interface JsonLdProps {
  data: object;
}

export const JsonLd = ({ data }: JsonLdProps) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

// Common structured data schemas
export const createWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Authentic Moments',
  alternateName: 'Authentic Moments - 60 Seconds to Real',
  url: 'https://authenticmoments.app',
  description: 'The only place you can\'t fake it. Capture and share authentic moments on Bluesky in 60 seconds - no edits, no filters, just real life.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://authenticmoments.app/search?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
});

export const createOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Authentic Moments',
  url: 'https://authenticmoments.app',
  logo: 'https://authenticmoments.app/favicon.ico',
  description: 'A platform for sharing authentic, unfiltered moments with the world.',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hello@authenticmoments.app',
    contactType: 'customer service'
  },
  sameAs: [
    'https://bsky.app/profile/authenticmoments.bsky.social'
  ]
});

export const createSoftwareApplicationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Authentic Moments',
  operatingSystem: 'Web',
  applicationCategory: 'SocialNetworkingApplication',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '127'
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  }
});