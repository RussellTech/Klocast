import { describe, expect, it } from 'vitest';
import { audioUrl, canonicalUrl, durationToIso, durationToSeconds, escapeXml, redirects } from '../../src/lib/site';

describe('site helpers', () => {
  it('creates canonical production URLs', () => {
    expect(canonicalUrl('/podcast/episode-1')).toBe('https://klocast.com/podcast/episode-1/');
    expect(canonicalUrl('/')).toBe('https://klocast.com/');
  });
  it('parses and serialises podcast durations', () => {
    expect(durationToSeconds('18:42')).toBe(1122);
    expect(durationToSeconds('1:02:03')).toBe(3723);
    expect(durationToIso('42:28')).toBe('PT42M28S');
    expect(durationToIso('1:02:03')).toBe('PT1H2M3S');
    expect(() => durationToSeconds('not-a-duration')).toThrow('Invalid duration');
  });
  it('escapes XML values', () => expect(escapeXml('<Klocast & friends>')).toBe('&lt;Klocast &amp; friends&gt;'));
  it('generates media URLs without WordPress', () => {
    expect(audioUrl('/audio/a.mp3', 'r2')).toBe('https://media.klocast.com/audio/a.mp3');
    expect(audioUrl('/audio/a.mp3', 'r2')).toBe('https://media.klocast.com/audio/a.mp3');
  });
  it('does not turn unrecovered short links into invented redirects', () => {
    expect(redirects['/a']).toBeNull();
    expect(redirects['/b1']).toBeNull();
  });
});
