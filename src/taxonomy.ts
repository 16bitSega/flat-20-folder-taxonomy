export interface DomainSpec {
	readonly folder: string;
	readonly description: string;
}

export interface VaultNoteSnapshot {
	readonly path: string;
	readonly basename: string;
	readonly hasFrontmatter: boolean;
	readonly tags: readonly string[];
	readonly linkCount: number;
}

export interface VaultAuditSummary {
	readonly totalNotes: number;
	readonly domainCounts: Readonly<Record<string, number>>;
	readonly deeplyNested: readonly string[];
	readonly missingFrontmatter: readonly string[];
	readonly tagDriftGroups: readonly (readonly string[])[];
	readonly orphanNotes: readonly string[];
}

export const DEFAULT_DOMAINS: readonly DomainSpec[] = [
	{ folder: "01_Technology_AI", description: "LLMs, software engineering, architecture, and developer tools" },
	{ folder: "02_Business_Startups", description: "Strategy, SaaS metrics, product management, and operations" },
	{ folder: "03_Marketing_Growth", description: "SEO, GEO, distribution, copywriting, and analytics" },
	{ folder: "04_Finance_Investing", description: "Taxes, unit economics, personal finance, and investing" },
	{ folder: "05_Science_Research", description: "Papers, empirical studies, physics, biology, and data" },
	{ folder: "06_Health_Longevity", description: "Sleep, nutrition, training protocols, and medical notes" },
	{ folder: "07_Psychology_Mindset", description: "Cognitive biases, decision frameworks, and habits" },
	{ folder: "08_Productivity_PKM", description: "Workflows, knowledge management, and time systems" },
	{ folder: "09_Design_UX", description: "UI patterns, typography, accessibility, and CSS" },
	{ folder: "10_Career_Leadership", description: "Hiring, management, negotiation, and communication" },
	{ folder: "11_Writing_Content", description: "Drafts, outlines, storytelling, and newsletters" },
	{ folder: "12_Books_Reading", description: "Book summaries, highlights, and reading lists" },
	{ folder: "13_Learning_Courses", description: "Course notes, lectures, and language study" },
	{ folder: "14_Hardware_HomeLab", description: "Servers, local models, networking, and gadgets" },
	{ folder: "15_Security_Privacy", description: "OpSec, encryption, authentication, and compliance" },
	{ folder: "16_Legal_Compliance", description: "Contracts, licenses, intellectual property, and filings" },
	{ folder: "17_Travel_Lifestyle", description: "Itineraries, checklists, and city guides" },
	{ folder: "18_Cooking_Recipes", description: "Tested meals, grocery lists, and preparation notes" },
	{ folder: "19_Culture_Media", description: "Films, podcasts, essays, and history" },
	{ folder: "20_Reference_Archive", description: "Manuals, templates, receipts, and cold storage" },
];

export function extractTopLevelFolder(filePath: string): string {
	const normalized = filePath.replace(/^\/+/, "");
	const slashIndex = normalized.indexOf("/");
	return slashIndex === -1 ? "" : normalized.slice(0, slashIndex);
}

export function getFolderDepth(filePath: string): number {
	const normalized = filePath.replace(/^\/+/, "");
	const segments = normalized.split("/").filter(Boolean);
	return Math.max(0, segments.length - 1);
}

export function normalizeTag(rawTag: string): string {
	return rawTag
		.trim()
		.replace(/^#+/, "")
		.toLowerCase()
		.replace(/[^a-z0-9/_-]+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

export function normalizeTagList(rawTags: unknown): string[] {
	const list = Array.isArray(rawTags)
		? rawTags.map(String)
		: typeof rawTags === "string"
			? rawTags.split(/[,\s]+/)
			: [];
	const seen = new Set<string>();
	const result: string[] = [];
	for (const item of list) {
		const cleaned = normalizeTag(item);
		if (cleaned && !seen.has(cleaned)) {
			seen.add(cleaned);
			result.push(cleaned);
		}
	}
	return result;
}

export function findTagDrift(allRawTags: Iterable<string>): string[][] {
	const buckets = new Map<string, Set<string>>();
	for (const raw of allRawTags) {
		const cleaned = raw.trim().replace(/^#+/, "");
		const canonical = normalizeTag(cleaned);
		if (!canonical) continue;
		const existing = buckets.get(canonical) ?? new Set<string>();
		existing.add(cleaned);
		buckets.set(canonical, existing);
	}
	return Array.from(buckets.values())
		.filter((variants) => variants.size > 1)
		.map((variants) => Array.from(variants).sort());
}

export function auditVaultSnapshots(
	snapshots: readonly VaultNoteSnapshot[],
	knownDomains: ReadonlySet<string>,
	reportPath: string,
): VaultAuditSummary {
	const domainCounts: Record<string, number> = {};
	const deeplyNested: string[] = [];
	const missingFrontmatter: string[] = [];
	const orphanNotes: string[] = [];
	const rawTags: string[] = [];

	for (const note of snapshots) {
		if (note.path === reportPath) continue;
		const top = extractTopLevelFolder(note.path);
		const bucket = knownDomains.has(top) ? top : "(Outside 20 folders)";
		domainCounts[bucket] = (domainCounts[bucket] ?? 0) + 1;
		if (getFolderDepth(note.path) > 1) deeplyNested.push(note.path);
		if (!note.hasFrontmatter) missingFrontmatter.push(note.path);
		if (note.linkCount === 0) orphanNotes.push(note.path);
		rawTags.push(...note.tags);
	}

	return {
		totalNotes: snapshots.filter((n) => n.path !== reportPath).length,
		domainCounts,
		deeplyNested,
		missingFrontmatter,
		tagDriftGroups: findTagDrift(rawTags),
		orphanNotes,
	};
}

export function renderAuditReportMarkdown(summary: VaultAuditSummary, isoDate: string): string {
	const lines: string[] = [
		"---",
		'title: "Taxonomy Health Report"',
		'type: "vault-audit"',
		`created: "${isoDate}"`,
		"tags: [pkm, taxonomy-audit]",
		"---",
		"",
		"# 20-Folder Taxonomy Health Report",
		"",
		`- **Total Markdown notes scanned:** ${summary.totalNotes}`,
		`- **Deeply nested notes (>1 folder level):** ${summary.deeplyNested.length}`,
		`- **Notes missing YAML frontmatter:** ${summary.missingFrontmatter.length}`,
		`- **Tag drift groups:** ${summary.tagDriftGroups.length}`,
		`- **Orphan notes (0 links):** ${summary.orphanNotes.length}`,
		"",
		"## Folder distribution",
		"",
		"| Folder | Notes |",
		"| :--- | ---: |",
	];
	for (const [folder, count] of Object.entries(summary.domainCounts).sort()) {
		lines.push(`| ${folder} | ${count} |`);
	}
	appendSection(lines, "Deeply nested notes", summary.deeplyNested, 30);
	appendSection(lines, "Notes missing YAML frontmatter", summary.missingFrontmatter, 30);
	appendSection(lines, "Orphan notes", summary.orphanNotes, 30);
	if (summary.tagDriftGroups.length > 0) {
		lines.push("", "## Tag drift groups", "");
		for (const group of summary.tagDriftGroups.slice(0, 30)) {
			lines.push(`- ${group.map((t) => `\`#${t}\``).join(" vs ")}`);
		}
	}
	return `${lines.join("\n")}\n`;
}

function appendSection(lines: string[], heading: string, items: readonly string[], limit: number): void {
	if (items.length === 0) return;
	lines.push("", `## ${heading}`, "");
	for (const item of items.slice(0, limit)) {
		lines.push(`- [[${item.replace(/\.md$/i, "")}]]`);
	}
	if (items.length > limit) {
		lines.push(`- ...and ${items.length - limit} more.`);
	}
}
