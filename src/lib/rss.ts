import type { CollectionEntry } from 'astro:content';
import { audioUrl, canonicalUrl, escapeXml, FEED_PATH, SITE_ORIGIN, SITE_TITLE } from './site';

type Episode = CollectionEntry<'episodes'>;

interface FeedOptions {
  title?: string;
  feedPath?: string;
  description?: string;
  subtitle?: string;
  author?: string;
  ownerName?: string;
  ownerEmail?: string;
  copyright?: string;
  podcastGuid?: string;
}

function cdata(value: string) {
  return `<![CDATA[${value.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`;
}

export function renderRss(episodes: Episode[], options: FeedOptions = {}) {
  const title = options.title ?? SITE_TITLE;
  const feedPath = options.feedPath ?? FEED_PATH;
  const description =
    options.description ??
    'After working at the University of Huddersfield together, Aaron and Nathan explore the world of all things Web and SEO.';
  const subtitle = options.subtitle ?? 'Aaron and Nate explore the world of all things Web and SEO.';
  const author = options.author ?? 'Aaron Russell and Nate Smith';
  const ownerName = options.ownerName ?? 'Aaron Russell and Nathan Smith';
  const ownerEmail = options.ownerEmail ?? 'klocast@kloclabs.com';
  const copyright = options.copyright ?? '© 2019 Klocast';
  const podcastGuid = options.podcastGuid ?? '9011d07d-0abb-5bd6-952a-9154b32bd817';
  const ordered = [...episodes].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  const items = ordered
    .map((episode) => {
      const { data } = episode;
      const url = canonicalUrl(`/podcast/${episode.id}`);
      const enclosure = audioUrl(data.audioPath, data.audioOrigin);
      return `<item><title>${cdata(data.title)}</title><link>${url}</link><pubDate>${data.pubDate.toUTCString()}</pubDate><dc:creator>${cdata(data.author)}</dc:creator><guid isPermaLink="false">${escapeXml(data.guid)}</guid><description>${cdata(data.description)}</description><content:encoded>${cdata(data.description)}</content:encoded><enclosure url="${escapeXml(enclosure)}" length="${data.audioBytes}" type="${escapeXml(data.audioMime)}"/><itunes:summary>${cdata(data.description)}</itunes:summary><itunes:image href="${SITE_ORIGIN}${data.artwork}"/><itunes:explicit>${data.explicit ? 'true' : 'false'}</itunes:explicit><itunes:episodeType>${data.podcastEpisodeType}</itunes:episodeType>${data.episode ? `<itunes:episode>${data.episode}</itunes:episode>` : ''}${data.season ? `<itunes:season>${data.season}</itunes:season>` : ''}<itunes:duration>${data.duration}</itunes:duration><itunes:author>${cdata(data.author)}</itunes:author><googleplay:explicit>${data.explicit ? 'Yes' : 'No'}</googleplay:explicit></item>`;
    })
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:googleplay="http://www.google.com/schemas/play-podcasts/1.0" xmlns:podcast="https://podcastindex.org/namespace/1.0"><channel><title>${cdata(title)}</title><atom:link href="${SITE_ORIGIN}${feedPath}" rel="self" type="application/rss+xml"/><link>${SITE_ORIGIN}/</link><description>${cdata(description)}</description><language>en-GB</language><copyright>${cdata(copyright)}</copyright><itunes:subtitle>${cdata(subtitle)}</itunes:subtitle><itunes:author>${cdata(author)}</itunes:author><itunes:type>serial</itunes:type><itunes:summary>${cdata(description)}</itunes:summary><itunes:owner><itunes:name>${cdata(ownerName)}</itunes:name><itunes:email>${escapeXml(ownerEmail)}</itunes:email></itunes:owner><itunes:explicit>false</itunes:explicit><itunes:image href="${SITE_ORIGIN}/images/podcast-artwork.jpg"/><itunes:category text="Technology"><itunes:category text="Tech News"/></itunes:category><itunes:category text="Education"><itunes:category text="How to"/></itunes:category><itunes:category text="Business"><itunes:category text="Marketing"/></itunes:category><podcast:locked owner="${escapeXml(ownerEmail)}">yes</podcast:locked><podcast:guid>${podcastGuid}</podcast:guid>${items}</channel></rss>`;
}
