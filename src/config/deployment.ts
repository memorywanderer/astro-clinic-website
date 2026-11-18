export type DeploymentProfile = 'development' | 'demo' | 'production';
export interface DeploymentConfig {
  profile: DeploymentProfile;
  origin: string;
}

export function validateOrigin(value: string, production = false): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`Invalid deployment origin: ${value}`);
  }
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  )
    throw new Error(
      'Deployment origin must be an HTTP(S) origin without credentials, path, query or fragment',
    );
  const host = url.hostname.toLowerCase();
  if (
    production &&
    (url.protocol !== 'https:' ||
      url.port ||
      !host.includes('.') ||
      host.includes(':') ||
      /^\d+(?:\.\d+){3}$/.test(host) ||
      /(^|\.)(localhost|local|test|invalid|example(?:\.(com|org|net))?)$/.test(
        host,
      ) ||
      /(^|[.-])(demo|preview|staging)([.-]|$)/.test(host) ||
      /\.(vercel\.app|netlify\.app|pages\.dev)$/.test(host))
  )
    throw new Error(
      `Production requires a public HTTPS canonical origin, not a placeholder, IP, demo or preview host: ${value}`,
    );
  return url.origin;
}

export function resolveDeployment(
  env: {
    PUBLIC_DEPLOYMENT_PROFILE?: string;
    PUBLIC_SITE_ORIGIN?: string;
    VERCEL_ENV?: string;
    VERCEL_URL?: string;
  },
  development: boolean,
): DeploymentConfig {
  const requestedProfile =
    env.PUBLIC_DEPLOYMENT_PROFILE ?? (development ? 'development' : 'demo');
  if (
    requestedProfile !== 'development' &&
    requestedProfile !== 'demo' &&
    requestedProfile !== 'production'
  )
    throw new Error(`Unknown deployment profile: ${requestedProfile}`);
  if (!development && requestedProfile === 'development')
    throw new Error('Development profile is only available in the dev server');
  // A provider preview must remain safe even if it inherits launch settings.
  const profile =
    env.VERCEL_ENV !== undefined && env.VERCEL_ENV !== 'production'
      ? 'demo'
      : requestedProfile;
  if (profile === 'production' && !env.PUBLIC_SITE_ORIGIN)
    throw new Error('Production requires PUBLIC_SITE_ORIGIN');
  return {
    profile,
    origin: validateOrigin(
      env.PUBLIC_SITE_ORIGIN ??
        (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : undefined) ??
        (profile === 'development'
          ? 'http://localhost:4321'
          : 'https://example.com'),
      profile === 'production',
    ),
  };
}

export function robotsDirective(
  deployment: DeploymentConfig,
  indexable: boolean,
): string {
  return deployment.profile === 'production' && indexable
    ? 'index, follow'
    : 'noindex, nofollow';
}

export function robotsText(
  deployment: DeploymentConfig,
  hasEligiblePages: boolean,
): string {
  // Allow fetching HTML so crawlers can observe noindex in non-production builds.
  return `User-agent: *\nAllow: /\n${
    deployment.profile === 'production' && hasEligiblePages
      ? `\nSitemap: ${deployment.origin}/sitemap-index.xml\n`
      : ''
  }`;
}
