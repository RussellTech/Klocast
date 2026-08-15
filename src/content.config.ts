import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const externalLink = z.object({ label: z.string(), url: z.string().url() });

const episodes = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/episodes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    recordedDate: z.string().optional(),
    duration: z.string().regex(/^\d{1,2}:\d{2}(?::\d{2})?$/),
    series: z.string(),
    season: z.number().int().positive().optional(),
    episode: z.number().int().positive().optional(),
    author: z.string(),
    tags: z.array(z.string()).default([]),
    artwork: z.string(),
    artworkAlt: z.string(),
    audioPath: z.string(),
    audioOrigin: z.literal('r2'),
    audioMime: z.string().regex(/^audio\//),
    audioBytes: z.number().int().positive(),
    actualBytes: z.number().int().positive(),
    guid: z.string().min(1),
    explicit: z.boolean(),
    podcastEpisodeType: z.enum(['full', 'trailer', 'bonus']).default('full'),
    externalLinks: z.array(externalLink).default([]),
    category: z.string().default('Technology'),
  }),
});

export const collections = { episodes };
