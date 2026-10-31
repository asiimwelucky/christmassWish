import 'server-only';

export function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, '');
  if (
    configuredUrl?.startsWith('https://') &&
    !/localhost|127\.0\.0\.1/i.test(configuredUrl)
  ) {
    return configuredUrl;
  }

  if (process.env.VERCEL_ENV === 'production') {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || 'christmass-wish.vercel.app'}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return configuredUrl || 'http://localhost:3000';
}
