# 20-Folder Flat Taxonomy

Scaffold and maintain a flat 20-folder personal knowledge base with YAML frontmatter normalization, fuzzy keyboard domain routing, and 100% offline vault health audits. Works on desktop and mobile (`isDesktopOnly: false`) with zero network calls and zero account requirements.

## Features

1. **Scaffold 20-folder flat taxonomy** — Idempotently creates 20 top-level domain folders (`01_Technology_AI` through `20_Reference_Archive`) without overwriting existing notes.
2. **Route active note to domain folder** — Opens a fuzzy keyboard modal (`Ctrl/Cmd+P` or ribbon icon) to move the current note cleanly using Obsidian's link-safe `fileManager.renameFile`, optionally syncing the `domain` YAML field.
3. **Normalize active note YAML frontmatter** — Ensures consistent `title`, `domain`, `type`, `created`, and lowercase deduplicated `tags` via `fileManager.processFrontMatter`.
4. **Audit vault health report** — Scans all Markdown files locally and generates `_Taxonomy_Health_Report.md` showing folder distribution, deeply nested notes (`> 1` level), notes missing YAML frontmatter, tag case drift (e.g. `#AI` vs `#ai`), and orphan notes.

## The 20 Flat Folders

- `01_Technology_AI` — LLMs, software engineering, architecture, and developer tools
- `02_Business_Startups` — Strategy, SaaS metrics, product management, and operations
- `03_Marketing_Growth` — SEO, GEO, distribution, copywriting, and analytics
- `04_Finance_Investing` — Taxes, unit economics, personal finance, and investing
- `05_Science_Research` — Papers, empirical studies, physics, biology, and data
- `06_Health_Longevity` — Sleep, nutrition, training protocols, and medical notes
- `07_Psychology_Mindset` — Cognitive biases, decision frameworks, and habits
- `08_Productivity_PKM` — Workflows, knowledge management, and time systems
- `09_Design_UX` — UI patterns, typography, accessibility, and CSS
- `10_Career_Leadership` — Hiring, management, negotiation, and communication
- `11_Writing_Content` — Drafts, outlines, storytelling, and newsletters
- `12_Books_Reading` — Book summaries, highlights, and reading lists
- `13_Learning_Courses` — Course notes, lectures, and language study
- `14_Hardware_HomeLab` — Servers, local models, networking, and gadgets
- `15_Security_Privacy` — OpSec, encryption, authentication, and compliance
- `16_Legal_Compliance` — Contracts, licenses, intellectual property, and filings
- `17_Travel_Lifestyle` — Itineraries, checklists, and city guides
- `18_Cooking_Recipes` — Tested meals, grocery lists, and preparation notes
- `19_Culture_Media` — Films, podcasts, essays, and history
- `20_Reference_Archive` — Manuals, templates, receipts, and cold storage

## Privacy & Local-First Guarantee

- **100% offline:** Zero telemetry, zero external API calls, zero accounts.
- **Desktop & mobile:** Uses only standard Obsidian Vault, MetadataCache, and FileManager APIs.

## Methodology & Documentation

Based on the open [20-Folder Flat Taxonomy guide](https://scraplibra.com/guides/20-folder-flat-taxonomy/) and the MIT starter vault at [16bitSega/scraplibra-mcp](https://github.com/16bitSega/scraplibra-mcp).

## Development

```bash
npm install
npm test
npm run build
```

## License

MIT License — see [LICENSE](LICENSE).
