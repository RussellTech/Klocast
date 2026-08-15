import { describe, expect, it } from 'vitest';
import { renderRss } from '../../src/lib/rss';

const episodes = [
  {
    id: 'beginner-1-your-own-domain',
    data: {
      title: 'Beginner 1: Your own domain',
      description: 'Beginner notes',
      pubDate: new Date('2019-09-20T22:29:34Z'),
      duration: '18:42',
      author: 'Klocast - Talking about SEO and the Web',
      audioPath: '/audio/beginner-1-your-own-domain.mp3',
      audioOrigin: 'r2' as const,
      audioMime: 'audio/mpeg',
      audioBytes: 22941330,
      artwork: '/images/episode-beginner.jpg',
      guid: 'https://klocast.kloclabs.com/?post_type=podcast&p=65',
      explicit: false,
      podcastEpisodeType: 'full' as const,
      series: 'Beginner',
      category: 'Technology',
    },
  },
  {
    id: 'episode-1',
    data: {
      title: 'Episode 1 – Let’s try this',
      description: 'Episode notes',
      pubDate: new Date('2019-07-27T20:56:21Z'),
      duration: '42:28',
      author: 'Klocast - Talking about SEO and the Web',
      audioPath: '/audio/Episode-1-28072019.mp3',
      audioOrigin: 'r2' as const,
      audioMime: 'audio/mpeg',
      audioBytes: 8510791,
      artwork: '/images/episode-1.jpg',
      guid: 'http://klocast.kloclabs.com/?post_type=podcast&p=11',
      explicit: false,
      podcastEpisodeType: 'full' as const,
      series: 'Series 1',
      category: 'Technology',
    },
  },
] as any;

describe('RSS generation contract', () => {
  it('preserves the two episode GUIDs and enclosure metadata', async () => {
    const xml = renderRss(episodes);
    expect(xml).toContain('p=65');
    expect(xml).toContain('p=11');
    expect(xml).toContain('<podcast:guid>9011d07d-0abb-5bd6-952a-9154b32bd817</podcast:guid>');
    expect(xml).toContain('length="22941330"');
    expect(xml).toContain('length="8510791"');
    expect(xml).toContain('<itunes:duration>18:42</itunes:duration>');
    expect(xml).toContain('<itunes:duration>42:28</itunes:duration>');
    expect(xml).toContain('https://media.klocast.com/audio/beginner-1-your-own-domain.mp3');
    expect(xml).toContain('https://media.klocast.com/audio/Episode-1-28072019.mp3');
    expect(xml).not.toContain('klocast.kloclabs.com/wp-content');
  });
});
