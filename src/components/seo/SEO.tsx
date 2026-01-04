import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image';
  noindex?: boolean;
  canonical?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  schema?: object;
  hreflang?: boolean; // Enable hreflang tags for multilingual pages
}

const defaultTitle = 'Status At - Track your Statuses';
const defaultDescription =
  'Track your statuses or build your own with our easy-to-use tools.';
const defaultImage =
  'https://statusat.com/favicon/web-app-manifest-512x512-v3.png';
const defaultUrl = 'https://statusat.com';

export const SEO = ({
  title,
  description = defaultDescription,
  keywords = 'status, tracker, workflow, workflow builder, workflow automation, business management, customer tracking',
  image = defaultImage,
  url = defaultUrl,
  type = 'website',
  twitterCard = 'summary_large_image',
  noindex = false,
  canonical,
  author,
  publishedTime,
  modifiedTime,
  schema,
  hreflang = false,
}: SEOProps) => {
  const fullTitle = title ? `${title} | Status At` : defaultTitle;
  const canonicalUrl = canonical || url;

  // Supported languages: English, German, Portuguese, Spanish, French
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'de', label: 'German' },
    { code: 'pt', label: 'Portuguese' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
  ];

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {author && <meta name="author" content={author} />}

      {/* Robots */}
      <meta
        name="robots"
        content={noindex ? 'noindex, nofollow' : 'index, follow'}
      />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Hreflang Tags for Multilingual Support */}
      {hreflang &&
        languages.map(lang => (
          <link
            key={lang.code}
            rel="alternate"
            hrefLang={lang.code}
            href={url}
          />
        ))}
      {hreflang && <link rel="alternate" hrefLang="x-default" href={url} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Status At" />
      <meta property="og:locale" content="en_US" />
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@statusat" />
      <meta name="twitter:creator" content="@statusat" />

      {/* Structured Data / JSON-LD */}
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
};

export default SEO;
