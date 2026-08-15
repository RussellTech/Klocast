import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { XMLParser } from 'fast-xml-parser';

const dist = join(process.cwd(), 'dist');
const read = (file: string) => readFile(join(dist, file), 'utf8');

describe('built site output', () => {
  it('contains required pages and feeds', async () => {
    for (const file of [
      'index.html',
      'podcast/episode-1/index.html',
      'podcast/beginner-1-your-own-domain/index.html',
      'feed/podcast.xml',
      'feed/podcast/index.html',
      'feed/podcast/series-1.xml',
      'feed/podcast/beginner.xml',
      '404.html',
      'robots.txt',
    ])
      await expect(read(file)).resolves.toBeTruthy();
  });
  it('uses the production origin and has no runtime WordPress paths', async () => {
    const files = [
      'index.html',
      'podcast/episode-1/index.html',
      'podcast/beginner-1-your-own-domain/index.html',
      'feed/podcast.xml',
      'sitemap-index.xml',
    ];
    const output = (await Promise.all(files.map(read))).join('\n');
    expect(output).toContain('https://klocast.com/');
    expect(output).not.toContain('/wp-content/');
    expect(output).not.toContain('/wp-includes/');
    expect(output).not.toContain('/wp-json/');
  });
  it('keeps the slash feed URL usable in local preview', async () => {
    const redirect = await read('feed/podcast/index.html');
    expect(redirect).toContain('url=/feed/podcast.xml');
    expect(redirect).toContain('/feed/podcast/');
  });
  it('parses every generated feed and protects podcast metadata', async () => {
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
    for (const file of ['feed/podcast.xml', 'feed/podcast/series-1.xml', 'feed/podcast/beginner.xml']) {
      const xml = await read(file);
      const channel = parser.parse(xml).rss.channel;
      expect(channel.item).toBeTruthy();
      for (const item of Array.isArray(channel.item) ? channel.item : [channel.item]) {
        expect(item.enclosure['@_type']).toBe('audio/mpeg');
        expect(Number(item.enclosure['@_length'])).toBeGreaterThan(0);
        expect(item.guid).toBeTruthy();
        expect(item['itunes:duration']).toMatch(/^\d+:\d{2}$/);
      }
    }
  });
});
