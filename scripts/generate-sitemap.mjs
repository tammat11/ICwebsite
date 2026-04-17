import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const siteUrl = 'https://www.ic-group.kz';
const today = new Date().toISOString().slice(0, 10);

const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/services', changefreq: 'weekly', priority: '0.9' },
  { path: '/contacts', changefreq: 'monthly', priority: '0.8' },
  { path: '/careers', changefreq: 'monthly', priority: '0.7' },
  { path: '/news', changefreq: 'weekly', priority: '0.7' },
];

async function getSeoLandingRoutes() {
  const landingsFile = path.join(rootDir, 'app', 'src', 'data', 'seoLandings.ts');
  const source = await readFile(landingsFile, 'utf8');
  const matches = [...source.matchAll(/path:\s*'([^']+)'/g)];

  return matches.map((match, index) => ({
    path: match[1],
    changefreq: 'weekly',
    priority: index < 5 ? '0.88' : '0.84',
  }));
}

function renderUrl({ path: routePath, changefreq, priority }) {
  return `  <url>
    <loc>${new URL(routePath, siteUrl).toString()}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function main() {
  const seoRoutes = await getSeoLandingRoutes();
  const allRoutes = [...staticRoutes, ...seoRoutes];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(renderUrl).join('\n')}
</urlset>
`;

  const publicDir = path.join(rootDir, 'app', 'public');
  await mkdir(publicDir, { recursive: true });
  await writeFile(path.join(publicDir, 'sitemap.xml'), xml, 'utf8');
}

main().catch((error) => {
  console.error('Failed to generate sitemap:', error);
  process.exitCode = 1;
});
