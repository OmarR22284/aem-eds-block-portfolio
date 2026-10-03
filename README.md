# AEM Edge Delivery Services — Block Portfolio

A small, self-contained set of custom [Adobe Edge Delivery Services](https://www.aem.live/) (EDS) blocks, built to demonstrate hands-on block development, accessibility practices, and integration patterns with external data sources.

This repo is a portfolio piece, not a full site — it follows the real EDS block architecture and conventions (the `decorate(block)` pattern, lazy CSS loading, semantic DOM restructuring) used in production AEM Edge Delivery projects.

## Blocks included

### `hero`
Standard EDS hero pattern: pulls an authored image, heading, and optional CTA link out of the authored table structure and restructures them semantically. Responsive two-column layout above 900px.

### `tabs`
An accessible tab interface implementing the [ARIA Authoring Practices tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/): roving tabindex, arrow-key/Home/End keyboard navigation, and correct `role`/`aria-*` wiring between tabs and panels.

### `dynamic-list`
Demonstrates integrating EDS with an external data source at runtime — e.g., an AEM GraphQL persisted query endpoint or any JSON API. The static page shell loads and paints first; the data fetch happens client-side afterward, so the external source's latency doesn't affect Core Web Vitals. Includes loading and error states.

## Why these three

Each block exercises a different part of what an EDS Solution Architect actually needs to reason about day to day:

- **hero** — the baseline authoring-to-DOM transformation every EDS block starts from
- **tabs** — accessibility and keyboard interaction, which is easy to get wrong and expensive to retrofit
- **dynamic-list** — the integration boundary between EDS's static-first model and a backing system like AEMaaCS, which is the piece most "EDS tutorials" skip

## Architecture notes

- No build step, no framework — plain JS modules and CSS, matching EDS's actual delivery model
- Each block ships its own scoped `.js` and `.css`, loaded lazily per-block by `scripts/scripts.js`
- `dynamic-list` deliberately separates the static shell from the data fetch to preserve EDS's Lighthouse performance characteristics even when a block depends on an external system

## Author

Omar Rabhi — AEM Solution Architect
[LinkedIn](https://www.linkedin.com/in/omarrabhicolorado)
