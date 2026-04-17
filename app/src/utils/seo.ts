export const SITE_URL = 'https://www.ic-group.kz';
export const DEFAULT_SEO_IMAGE = `${SITE_URL}/logo_IC_group.png`;

export function toAbsoluteUrl(pathOrUrl: string) {
  if (!pathOrUrl) return DEFAULT_SEO_IMAGE;
  try {
    return new URL(pathOrUrl, SITE_URL).toString();
  } catch {
    return DEFAULT_SEO_IMAGE;
  }
}

export function buildBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  };
}
