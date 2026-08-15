import { getCollection } from 'astro:content';
import { renderRss } from '../../../lib/rss';
export async function GET() {
  const episodes = (await getCollection('episodes')).filter(({ data }) => data.series === 'Beginner');
  return new Response(
    renderRss(episodes, {
      title: 'Beginner',
      feedPath: '/feed/podcast/beginner/',
      description: 'A podcast all about SEO and the web',
      subtitle: 'A podcast all about SEO and the web',
      author: 'Klocast - Talking about SEO and the Web',
      ownerName: 'Klocast - Talking about SEO and the Web',
      copyright: '© 2026 Klocast - Talking about SEO and the Web',
      podcastGuid: '9b9e70f5-6c2f-5f2b-a7b2-03dce65966ea',
    }),
    {
      headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
    },
  );
}
