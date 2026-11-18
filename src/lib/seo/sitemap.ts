import { readFileSync } from 'node:fs';
import type { AstroIntegration } from 'astro';
import sitemap from '@astrojs/sitemap';

// Read the generated head rather than importing Astro virtual modules or raw
// content into config. This is the exact indexing decision used by SEOHead.
export function productionSitemap(): AstroIntegration {
  let outDir: URL;
  const integration = sitemap({
    filter(page) {
      const path = new URL(page).pathname;
      if (!path.endsWith('/')) return false;
      const file = new URL(`.${path}index.html`, outDir);
      if (!file.href.startsWith(outDir.href)) return false;
      let html: string;
      try {
        html = readFileSync(file, 'utf8');
      } catch {
        return false;
      }
      const head = html.slice(0, html.indexOf('</head>'));
      const canonical = /<link rel="canonical" href="([^"]+)"/.exec(head)?.[1];
      return (
        head.includes('<meta name="robots" content="index, follow"') &&
        canonical === page
      );
    },
  });
  return {
    ...integration,
    hooks: {
      ...integration.hooks,
      'astro:config:done': async (context) => {
        outDir = context.config.outDir;
        await integration.hooks['astro:config:done']?.(context);
      },
    },
  };
}
