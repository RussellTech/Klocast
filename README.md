# Klocast static site

This repository is a static Astro migration of the Klocast podcast. It contains two verified episodes, local artwork, R2-backed audio configuration, generated podcast RSS feeds, and Cloudflare Pages-compatible redirects. No WordPress, PHP or database is required at runtime.

## Local development

```sh
npm install
npm run dev
npm run build
npm run preview
```

The production origin is fixed to `https://klocast.com`. Every episode enclosure is served from the R2-backed `https://media.klocast.com` origin after the uploads described in `docs/audio-upload-manifest.csv`.

## Content and media

Add one Markdown file to `src/content/episodes/` with the typed fields in `src/content.config.ts`. Put owned artwork in `public/images/`; upload every audio file to R2 and use `audioOrigin: r2` plus the configured media filename. Preserve `guid`, `audioBytes`, `duration`, publication date and enclosure MIME type when editing an existing episode.

## Tests and release gate

`npm run format:check`, `npm run check`, `npm run test:unit`, `npm run test:integration`, `npm run test:coverage`, `npm run test:e2e`, `npm run test:accessibility` and `npm run test:visual` run the individual gates. `npm run test:all` runs them together. Playwright covers Chromium, Firefox and WebKit; WebKit is not identical to current Safari. Visual snapshots live under `tests/e2e/__screenshots__/` and must be reviewed before intentional updates. `npm run test:live` is the explicitly network-dependent source/media audit and is excluded from deterministic CI.

## Deployment and cutover

The GitHub Actions workflow runs the format, Astro type, unit, coverage, integration, Playwright, accessibility, visual and dependency-audit gates. A push to `main` uploads both podcast MP3s to R2, then deploys the tested `dist/` artifact to Cloudflare Pages only when every gate passes.

Configure these GitHub repository secrets and variables before enabling deployment:

- `CLOUDFLARE_API_TOKEN` secret: a scoped Cloudflare API token with Pages deployment access.
- `CLOUDFLARE_ACCOUNT_ID` secret: the Cloudflare account ID.
- `CLOUDFLARE_PAGES_PROJECT` variable: the Cloudflare Pages project name.
- `CLOUDFLARE_R2_BUCKET` variable: the R2 bucket containing the podcast media.

Keep the source MP3s under `media/audio/` with the exact filenames in `docs/audio-upload-manifest.csv`. The workflow reads that manifest and dynamically uploads every row to its R2 key, so adding an episode only requires adding its manifest row and source file. They are uploaded to R2 and are never copied into the Pages bundle. Builds keep `public/_redirects` in the output. Configure the R2 custom media domain and verify byte-range audio before DNS or feed cutover. Review `docs/migration-inventory.md`, `docs/redirects.csv` and `docs/podcast-migration.md` before retiring WordPress.
