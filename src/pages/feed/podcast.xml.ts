import { getCollection } from 'astro:content';
import { renderRss } from '../../lib/rss';
export async function GET() {
  return new Response(renderRss(await getCollection('episodes')), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
