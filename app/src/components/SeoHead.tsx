import { useEffect } from 'react';
import { DEFAULT_SEO_IMAGE, SITE_URL, toAbsoluteUrl } from '../utils/seo';

type SeoHeadProps = {
  title: string;
  description: string;
  path?: string;
  keywords?: string;
  robots?: string;
  image?: string;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
};

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function upsertLink(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

const baseOrganizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}#organization`,
  name: 'IC Group',
  url: SITE_URL,
  logo: `${SITE_URL}/logo_IC_group.png`,
  email: 'sales@ic-group.kz',
  telephone: '+7 777 008 73 60',
  areaServed: 'KZ',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Ауэзовский район, 8-й микрорайон, 55а',
    addressLocality: 'Алматы',
    postalCode: '050006',
    addressCountry: 'KZ',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+7 777 008 73 60',
      contactType: 'sales',
      areaServed: 'KZ',
      availableLanguage: ['ru', 'kk'],
    },
    {
      '@type': 'ContactPoint',
      telephone: '+7 771 780 2366',
      contactType: 'hr',
      areaServed: 'KZ',
      availableLanguage: ['ru', 'kk'],
    },
  ],
  sameAs: [
    'https://www.instagram.com/icgroup.kz/?__pwa=1',
  ],
};

const baseWebsiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}#website`,
  url: SITE_URL,
  name: 'IC Group',
  inLanguage: 'ru-KZ',
};

const SeoHead = ({
  title,
  description,
  path = '/',
  keywords,
  robots = 'index,follow',
  image = DEFAULT_SEO_IMAGE,
  schema,
}: SeoHeadProps) => {
  useEffect(() => {
    const canonicalUrl = new URL(path, SITE_URL).toString();
    const absoluteImage = toAbsoluteUrl(image);
    const schemaNodeId = 'seo-structured-data';
    const pageSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: title,
      description,
      inLanguage: 'ru-KZ',
      isPartOf: {
        '@id': `${SITE_URL}#website`,
      },
      about: {
        '@id': `${SITE_URL}#organization`,
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: absoluteImage,
      },
    };
    const structuredData = schema
      ? Array.isArray(schema)
        ? [baseOrganizationSchema, baseWebsiteSchema, pageSchema, ...schema]
        : [baseOrganizationSchema, baseWebsiteSchema, pageSchema, schema]
      : [baseOrganizationSchema, baseWebsiteSchema, pageSchema];

    document.title = title;

    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: robots });
    upsertMeta('meta[name="author"]', { name: 'author', content: 'IC Group' });
    upsertMeta('meta[name="format-detection"]', { name: 'format-detection', content: 'telephone=yes' });

    if (keywords) {
      upsertMeta('meta[name="keywords"]', { name: 'keywords', content: keywords });
    }

    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'IC Group' });
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'ru_KZ' });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: absoluteImage });

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:url"]', { name: 'twitter:url', content: canonicalUrl });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: absoluteImage });

    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl });
    upsertLink('link[rel="alternate"][hreflang="ru-KZ"]', {
      rel: 'alternate',
      hreflang: 'ru-KZ',
      href: canonicalUrl,
    });
    upsertLink('link[rel="alternate"][hreflang="x-default"]', {
      rel: 'alternate',
      hreflang: 'x-default',
      href: canonicalUrl,
    });

    let script = document.getElementById(schemaNodeId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = schemaNodeId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(structuredData);
  }, [description, image, keywords, path, robots, schema, title]);

  return null;
};

export default SeoHead;
