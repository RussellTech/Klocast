import { getCollection } from 'astro:content';
import { renderRss } from '../../../lib/rss';
export async function GET() {
  const episodes = (await getCollection('episodes')).filter(({ data }) => data.series === 'Series 1');
  return new Response(
    renderRss(episodes, {
      title: 'Series 1',
      feedPath: '/feed/podcast/series-1/',
      description: 'A podcast all about SEO and the web',
      subtitle: 'A podcast all about SEO and the web',
      author: 'Klocast - Talking about SEO and the Web',
      ownerName: 'Klocast - Talking about SEO and the Web',
      copyright: '© 2026 Klocast - Talking about SEO and the Web',
      podcastGuid: 'e5a3e885-6315-54d2-a9ae-01e7f4b66280',
    }),
    {
      headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
    },
  );
}
