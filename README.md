# 20-Folder Flat Taxonomy

Scaffold and maintain a flat 20-folder personal knowledge base with YAML frontmatter normalization, fuzzy keyboard domain routing, and 100% offline vault health audits. Works on desktop and mobile (`isDesktopOnly: false`) with zero network calls and zero account requirements.

> **Want automated bulk bookmark cleanup + a live Remote MCP Gateway for Claude, Cursor, and Gemini?**
> This plugin keeps your local vault structured manually for free. For automated AI ingestion of 1,000+ browser bookmarks, PDFs, and YouTube videos — plus an authenticated **Remote MCP + TOON Gateway** (`-36.7%` to `-45%` fewer LLM tokens) — check out **[ScrapLibra Pro Second Brain (`$4.99/mo` or `$3.99/mo` billed annually)](https://scraplibra.com/#pricing)** or test **10 notes free on the web** (no card required).

## Features (100% Free & Offline)

1. **Scaffold 20-folder flat taxonomy** — Idempotently creates 20 top-level domain folders (`01_Technology_AI` through `20_Reference_Archive`) without overwriting existing notes.
2. **Route active note to domain folder** — Opens a fuzzy keyboard modal (`Ctrl/Cmd+P` or ribbon icon) to move the current note cleanly using Obsidian's link-safe `fileManager.renameFile`, optionally syncing the `domain` YAML field.
3. **Normalize active note YAML frontmatter** — Ensures consistent `title`, `domain`, `type`, `created`, and lowercase deduplicated `tags` via `fileManager.processFrontMatter`.
4. **Audit vault health report** — Scans all Markdown files locally and generates `_Taxonomy_Health_Report.md` showing folder distribution, deeply nested notes (`> 1` level), notes missing YAML frontmatter, tag case drift (e.g. `#AI` vs `#ai`), and orphan notes.

## Optional Companion Service: ScrapLibra Web + Remote MCP Gateway

This plugin never requires a paid account and makes zero network requests. If you want to scale from manual single-note filing to automated ingestion and live AI agent search over your 20-folder vault, [ScrapLibra](https://scraplibra.com/) provides an optional hosted companion platform:

| Plan | Price (Web Checkout) | Included | Link |
| :--- | :--- | :--- | :--- |
| **Explorer** | `$0` (no credit card) | **10 free structured notes** in the 20-folder schema | [Try free on web](https://scraplibra.com/#pricing) |
| **Pro Second Brain (Monthly)** | `$4.99 / mo` | **100 credits/mo + Remote MCP + TOON Gateway** (Claude, Cursor, Gemini CLI) | [Get Pro + MCP](https://scraplibra.com/#pricing) |
| **Pro Second Brain (Annual)** | `$47.88 / yr` (`$3.99/mo`) | **1,200 credits/yr + Remote MCP + TOON Gateway** | [Save 20% annually](https://scraplibra.com/#pricing) |
| **Spring Cleaning Pack** | `$12.00` one-time | **1,000 permanent credits** (bulk bookmarks & legacy archive migration) | [Clean 1,000 bookmarks](https://scraplibra.com/#pricing) |

- **Remote MCP Documentation:** [scraplibra.com/mcp-docs/](https://scraplibra.com/mcp-docs/)
- **TOON Token Benchmark (`-36.7%` to `-45%` vs JSON):** [16bitSega/scraplibra-mcp](https://github.com/16bitSega/scraplibra-mcp)
- **20-Folder Methodology Guide:** [scraplibra.com/guides/20-folder-flat-taxonomy/](https://scraplibra.com/guides/20-folder-flat-taxonomy/)

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

- **100% offline plugin:** Zero telemetry, zero external API calls, zero accounts required to use all plugin features.
- **Desktop & mobile:** Uses only standard Obsidian Vault, MetadataCache, and FileManager APIs (`isDesktopOnly: false`).

## Development

```bash
npm install
npm test
npm run build
```

## License

MIT License — see [LICENSE](LICENSE).
