# QA record

Run date: 15 August 2026.

- `npm run test:all`: passed.
- Unit: 6 tests passed.
- Integration: 3 tests passed, including parsed RSS XML checks.
- Playwright: 21 tests passed in Chromium, Firefox and WebKit.
- Accessibility: 3 axe runs passed with no serious/critical violations.
- Visual: 6 reviewed baselines passed (homepage and Episode 1 in each Playwright engine).
- Coverage: 95.5% lines/statements, 87.5% functions, 61.53% branches for `src/lib` logic.
- R2 audio path: the 18:42 Beginner episode loaded metadata and started playback in all three Playwright engines; the test intercepts the R2 URL with a committed fixture so production has no local audio dependency.

Playwright WebKit is a useful cross-engine signal but is not identical to current Safari. A separate current-Safari smoke test was not available in this environment; it remains a manual check after deployment. The live-source audit is intentionally separate from CI and currently reports the WordPress apex feed redirect documented in `docs/migration-inventory.md`.
