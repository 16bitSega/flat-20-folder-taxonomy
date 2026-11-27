import assert from "node:assert/strict";
import test from "node:test";
import esbuild from "esbuild";

const compiled = await esbuild.build({
	entryPoints: ["src/taxonomy.ts"],
	bundle: true,
	write: false,
	format: "esm",
	platform: "node",
});

const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString("base64")}`;
const taxonomy = await import(moduleUrl);

test("DEFAULT_DOMAINS defines exactly 20 unique flat top-level folders", () => {
	assert.equal(taxonomy.DEFAULT_DOMAINS.length, 20);
	const unique = new Set(taxonomy.DEFAULT_DOMAINS.map((d) => d.folder));
	assert.equal(unique.size, 20);
	for (const folder of unique) {
		assert.equal(folder.includes("/"), false);
	}
});

test("normalizeTagList deduplicates case variants and strips hashes", () => {
	const result = taxonomy.normalizeTagList(["#AI", "ai", "Machine Learning", "machine-learning", "  "]);
	assert.deepEqual(result, ["ai", "machine-learning"]);
});

test("auditVaultSnapshots detects deep nesting, missing frontmatter, tag drift, and orphans", () => {
	const known = new Set(taxonomy.DEFAULT_DOMAINS.map((d) => d.folder));
	const snapshots = [
		{
			path: "01_Technology_AI/mcp-toon.md",
			basename: "mcp-toon",
			hasFrontmatter: true,
			tags: ["#AI", "mcp"],
			linkCount: 2,
		},
		{
			path: "01_Technology_AI/nested/deep-note.md",
			basename: "deep-note",
			hasFrontmatter: false,
			tags: ["#ai"],
			linkCount: 0,
		},
		{
			path: "_Taxonomy_Health_Report.md",
			basename: "_Taxonomy_Health_Report",
			hasFrontmatter: true,
			tags: [],
			linkCount: 0,
		},
	];

	const summary = taxonomy.auditVaultSnapshots(snapshots, known, "_Taxonomy_Health_Report.md");

	assert.equal(summary.totalNotes, 2);
	assert.equal(summary.domainCounts["01_Technology_AI"], 2);
	assert.deepEqual(summary.deeplyNested, ["01_Technology_AI/nested/deep-note.md"]);
	assert.deepEqual(summary.missingFrontmatter, ["01_Technology_AI/nested/deep-note.md"]);
	assert.deepEqual(summary.orphanNotes, ["01_Technology_AI/nested/deep-note.md"]);
	assert.deepEqual(summary.tagDriftGroups, [["AI", "ai"]]);

	const markdown = taxonomy.renderAuditReportMarkdown(summary, "2026-11-27");
	assert.match(markdown, /# 20-Folder Taxonomy Health Report/);
	assert.match(markdown, /\| 01_Technology_AI \| 2 \|/);
	assert.match(markdown, /`#AI` vs `#ai`/);
});
