export const SITE_ORIGIN = 'https://klocast.com';
export const SITE_TITLE = 'Klocast – Talking about SEO and the Web';
export const SITE_DESCRIPTION = 'A podcast all about SEO and the web';
export const FEED_PATH = '/feed/podcast/';

export function canonicalUrl(path = '/') {
  const normalised = path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}/`;
  return `${SITE_ORIGIN}${normalised}`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}

export function durationToSeconds(duration: string) {
  const parts = duration.split(':').map(Number);
  if (parts.some(Number.isNaN) || (parts.length !== 2 && parts.length !== 3))
    throw new Error(`Invalid duration: ${duration}`);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

export function durationToIso(duration: string) {
  const seconds = durationToSeconds(duration);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${s ? `${s}S` : ''}`;
}

export function escapeXml(value: string) {
  return value.replace(
    /[<>&'\"]/g,
    (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char]!,
  );
}

export function audioUrl(audioPath: string, _origin: 'r2' = 'r2') {
  return `https://media.klocast.com${audioPath}`;
}

export const redirects: Record<string, string | null> = {
  '/feed/podcast': '/feed/podcast/',
  '/feed/podcast/series-1': '/feed/podcast/series-1/',
  '/feed/podcast/beginner': '/feed/podcast/beginner/',
  '/podcast/episode-1': '/podcast/episode-1/',
  '/podcast/beginner-1-your-own-domain': '/podcast/beginner-1-your-own-domain/',
  '/series/series-1/': '/podcast/episode-1/',
  '/series/beginner/': '/podcast/beginner-1-your-own-domain/',
  '/tag/beginner/': '/podcast/beginner-1-your-own-domain/',
  '/tag/domain/': '/podcast/beginner-1-your-own-domain/',
  '/tag/hosting/': '/podcast/beginner-1-your-own-domain/',
  '/tag/google/': '/podcast/episode-1/',
  '/tag/hyper-local/': '/podcast/episode-1/',
  '/tag/search/': '/podcast/episode-1/',
  '/tag/seo/': '/podcast/episode-1/',
  '/a': null,
  '/b1': null,
  '/buydomain': null,
  '/c': null,
  '/d': null,
  '/e': null,
  '/f': null,
  '/g': null,
  '/h': null,
  '/i': null,
  '/wix': null,
};
