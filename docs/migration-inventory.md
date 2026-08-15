# Klocast migration inventory

Snapshot date: 15 August 2026. The live apex and `klocast.kloclabs.com` were crawled read-only. Both currently serve the same WordPress installation; the apex HTML advertises the legacy REST and asset origin, which is the defect this migration removes.

## Published content

| Route                                  | Status at source | Title                                   | Published (UTC)     | Recorded       | Duration | Source identity        |
| -------------------------------------- | ---------------: | --------------------------------------- | ------------------- | -------------- | -------- | ---------------------- |
| `/`                                    |              200 | Klocast - Talking about SEO and the Web | —                   | —              | —        | WordPress post archive |
| `/podcast/beginner-1-your-own-domain/` |              200 | Beginner 1: Your own domain             | 2019-09-20 22:29:34 | 22 August 2019 | 18:42    | post 65                |
| `/podcast/episode-1/`                  |              200 | Episode 1 – Let’s try this              | 2019-07-27 20:56:21 | not published  | 42:28    | post 11                |
| `/podcast/`                            |              200 | Podcast archive                         | —                   | —              | —        | sitemap route          |

The public WordPress REST collection returned exactly two published `podcast` posts. Complete source show notes are preserved in `src/content/episodes/`; dead short-link destinations and dead directory links are called out in the content rather than guessed.

## Feeds and identity

The current apex `/feed/podcast/` 302s to `/feed/podcast/klocast-talking-about-seo-and-the-web/` on the legacy host; that feed contains both episodes and channel GUID `9011d07d-0abb-5bd6-952a-9154b32bd817`. The stable series feeds are `/feed/podcast/series-1/` and `/feed/podcast/beginner/`, with channel GUIDs `e5a3e885-6315-54d2-a9ae-01e7f4b66280` and `9b9e70f5-6c2f-5f2b-a7b2-03dce65966ea`. Their parsed item GUIDs are preserved as `https://klocast.kloclabs.com/?post_type=podcast&p=11` and `https://klocast.kloclabs.com/?post_type=podcast&p=65`. The legacy hostname in a GUID is intentional feed identity, not a network dependency; all links, artwork, enclosures and canonical metadata now use the production origin or configured media origin.

## Media

| Episode    | Artwork                                        | Source enclosure                  | MIME         |      Bytes | Decision                                                                                                                                                                                                                |
| ---------- | ---------------------------------------------- | --------------------------------- | ------------ | ---------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Beginner 1 | `Episode-1-28072019-mp3-image.jpg` (3000×3000) | `Beginner-Episode-1-01092019.mp3` | `audio/mpeg` | 22,941,330 | Upload to the R2/custom media origin using `docs/audio-upload-manifest.csv`.                                                                                                                                            |
| Episode 1  | `klocast-1.jpg` (4620×4150)                    | `Episode-1-28072019.mp3`          | `audio/mpeg` | 51,470,767 | Exceeds [Cloudflare Pages’ documented 25 MiB asset limit](https://developers.cloudflare.com/pages/platform/limits/); upload to the configured R2/custom media origin as documented in `docs/audio-upload-manifest.csv`. |

Local artwork and the published Spotify, Apple Podcasts and Stitcher badge files are under `public/images/`. Audio is kept out of `public/`; the deterministic playback fixture lives under `tests/fixtures/audio/` only.

The source RSS enclosure for Episode 1 declares `8,510,791` bytes while the redirected MP3 responds with `Content-Length: 51,470,767`. The generated feed preserves the published enclosure value; the upload manifest records the actual file size that must be served.

## Taxonomies and routes

Tags: `beginner`, `domain`, `google`, `hosting`, `hyper-local`, `search`, `seo`. Series: `Beginner`, `Series 1`. Speakers: Aaron Russell and Nate Smith. The WordPress sitemap also exposed `/tag/*`, `/series/*`, `/speaker/*` and the podcast archive; only relevant tag/series routes with a surviving episode are redirected.

Short links `/a`, `/b1`, `/buydomain`, `/c`, `/d`, `/e`, `/f`, `/g`, `/h`, `/i` and `/wix` returned 404 at both hosts during the capture. They are not invented into redirects; see `docs/redirects.csv`.

## Source references

Captured endpoints included the WordPress REST `wp/v2/podcast`, media references embedded in each post, Yoast podcast/tag/series sitemaps and the two series RSS documents. Optional rechecking is available via `npm run test:live`; the deterministic tests never call these URLs.
