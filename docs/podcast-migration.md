# Podcast feed migration

## Locations

The primary public feed remains `https://klocast.com/feed/podcast/`. Cloudflare Pages rewrites that URL to the generated `feed/podcast.xml` file. The preserved series feeds are `/feed/podcast/series-1/` and `/feed/podcast/beginner/`, rewritten to their generated XML artefacts.

## Identity strategy

Both parsed item GUIDs are unchanged from the source feeds. They are opaque identifiers even though they contain the historical hostname. Do not change them, add a second item with a new GUID, or remove an existing item. The feed’s canonical/self link, item links, artwork, and enclosures use `klocast.com` or the configured media origin.

## Audio enclosures

Both audio files are kept under `media/audio/` and are uploaded by the GitHub Actions deployment to the R2 bucket exposed as `media.klocast.com` before cutover. The Beginner file is 22,941,330 bytes; Episode 1 is 51,470,767 bytes. `docs/audio-upload-manifest.csv` is the handoff manifest. Verify `Content-Type: audio/mpeg`, `Content-Length`, `Accept-Ranges: bytes`, and a successful byte-range request for both files after upload.

## Directory and service links

Apple Podcasts and Spotify episode links are retained. The source Feedburner, Google Podcasts and Stitcher links are not retained: those services/links are no longer valid or supported at migration time. This is a manual directory review item; do not change directory submissions from this repository.

## Validation

`npm run test:unit` checks GUIDs, durations, byte lengths, MIME types and enclosure URLs. `npm run test:integration` checks the generated files’ presence and production-origin invariants. Run `npm run test:live` separately after media upload and DNS cutover to check live feed/audio responses.

## Cutover checklist

1. Upload Episode 1 using the audio manifest and verify range requests.
2. Deploy the static output with `_redirects` enabled.
3. Verify `/feed/podcast/` and both series feeds return XML with the preserved GUIDs.
4. Check Apple Podcasts/Spotify directory records manually; no directory API changes are made here.
5. Only then change DNS or retire the WordPress installation, with a rollback copy retained.
