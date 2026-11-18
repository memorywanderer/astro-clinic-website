import type { APIRoute } from 'astro';
import { deployment } from '@/config/site';
import { robotsText } from '@/config/deployment';
import { routes, availableTranslations } from '@/i18n/routes';
import { getPage } from '@/content/static';

export const GET: APIRoute = () =>
  new Response(
    robotsText(
      deployment,
      routes.some((route) =>
        availableTranslations(route.id).some(
          ({ locale }) => getPage(route.id, locale).metadata.indexable,
        ),
      ),
    ),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
