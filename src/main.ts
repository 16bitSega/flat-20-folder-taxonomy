import { Notice, Plugin, TFile, normalizePath } from "obsidian";
import { DomainSuggestModal } from "./modals";
import { DEFAULT_SETTINGS, TaxonomySettings, TaxonomySettingTab } from "./settings";
import {
	DEFAULT_DOMAINS,
	DomainSpec,
	VaultNoteSnapshot,
	auditVaultSnapshots,
	extractTopLevelFolder,
	normalizeTagList,
	renderAuditReportMarkdown,
} from "./taxonomy";

export default class FlatTaxonomyPlugin extends Plugin {
	settings: TaxonomySettings = DEFAULT_SETTINGS;

	async onload(): Promise<void> {
		await this.loadSettings();
		this.registerCommands();
		this.addRibbonIcon("folder-tree", "Route active note to domain folder", () => {
			this.openRouteModal();
		});
		this.addSettingTab(new TaxonomySettingTab(this.app, this));
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	private registerCommands(): void {
		this.addCommand({
			id: "scaffold-20-folders",
			name: "Scaffold 20-folder flat taxonomy",
			callback: () => void this.scaffoldFolders(),
		});
		this.addCommand({
			id: "normalize-active-frontmatter",
			name: "Normalize active note YAML frontmatter",
			checkCallback: (checking) => this.runOnActiveFile(checking, (file) => this.normalizeFrontmatter(file)),
		});
		this.addCommand({
			id: "route-active-note",
			name: "Route active note to domain folder",
			checkCallback: (checking) => this.runOnActiveFile(checking, () => this.openRouteModal()),
		});
		this.addCommand({
			id: "audit-vault-health",
			name: "Audit vault health report",
			callback: () => void this.generateAuditReport(),
		});
	}

	private runOnActiveFile(checking: boolean, action: (file: TFile) => void | Promise<void>): boolean {
		const activeFile = this.app.workspace.getActiveFile();
		if (!activeFile) return false;
		if (!checking) void action(activeFile);
		return true;
	}

	private async scaffoldFolders(): Promise<void> {
		let created = 0;
		for (const domain of DEFAULT_DOMAINS) {
			const target = normalizePath(domain.folder);
			if (!this.app.vault.getAbstractFileByPath(target)) {
				await this.app.vault.createFolder(target);
				created += 1;
			}
		}
		new Notice(`20-folder taxonomy ready (${created} new folders created).`);
	}

	private async normalizeFrontmatter(file: TFile, explicitDomain?: string): Promise<void> {
		const isoDate = new Date().toISOString().slice(0, 10);
		const inferredDomain = explicitDomain ?? (extractTopLevelFolder(file.path) || "20_Reference_Archive");
		await this.app.fileManager.processFrontMatter(file, (fm: Record<string, unknown>) => {
			if (!fm.title) fm.title = file.basename;
			fm.domain = explicitDomain ?? (typeof fm.domain === "string" && fm.domain ? fm.domain : inferredDomain);
			if (!fm.type) fm.type = this.settings.defaultNoteType;
			if (!fm.created) fm.created = isoDate;
			fm.tags = normalizeTagList(fm.tags);
		});
		new Notice(`Normalized YAML frontmatter for ${file.basename}.`);
	}

	private openRouteModal(): void {
		const activeFile = this.app.workspace.getActiveFile();
		if (!activeFile) {
			new Notice("Open a Markdown note before routing it.");
			return;
		}
		new DomainSuggestModal(this.app, DEFAULT_DOMAINS, (domain) => {
			void this.routeFileToDomain(activeFile, domain);
		}).open();
	}

	private async routeFileToDomain(file: TFile, domain: DomainSpec): Promise<void> {
		const folderPath = normalizePath(domain.folder);
		if (!this.app.vault.getAbstractFileByPath(folderPath)) {
			await this.app.vault.createFolder(folderPath);
		}
		const destination = normalizePath(`${folderPath}/${file.name}`);
		if (destination !== file.path) {
			await this.app.fileManager.renameFile(file, destination);
		}
		if (this.settings.autoAssignDomainOnRoute) {
			await this.normalizeFrontmatter(file, domain.folder);
		}
		new Notice(`Moved ${file.basename} to ${domain.folder}.`);
	}

	private async generateAuditReport(): Promise<void> {
		const snapshots = this.collectVaultSnapshots();
		const knownDomains = new Set(DEFAULT_DOMAINS.map((d) => d.folder));
		const reportPath = normalizePath(this.settings.reportPath);
		const summary = auditVaultSnapshots(snapshots, knownDomains, reportPath);
		const markdown = renderAuditReportMarkdown(summary, new Date().toISOString().slice(0, 10));
		const existing = this.app.vault.getAbstractFileByPath(reportPath);
		const reportFile =
			existing instanceof TFile
				? await this.modifyReport(existing, markdown)
				: await this.app.vault.create(reportPath, markdown);
		await this.app.workspace.getLeaf(false).openFile(reportFile);
		new Notice(`Vault audit complete (${summary.totalNotes} notes scanned).`);
	}

	private async modifyReport(file: TFile, markdown: string): Promise<TFile> {
		await this.app.vault.modify(file, markdown);
		return file;
	}

	private collectVaultSnapshots(): VaultNoteSnapshot[] {
		const resolved = this.app.metadataCache.resolvedLinks;
		const inboundCounts = new Map<string, number>();
		for (const targets of Object.values(resolved)) {
			for (const targetPath of Object.keys(targets)) {
				inboundCounts.set(targetPath, (inboundCounts.get(targetPath) ?? 0) + 1);
			}
		}
		return this.app.vault.getMarkdownFiles().map((file) => {
			const cache = this.app.metadataCache.getFileCache(file);
			const fmTags = Array.isArray(cache?.frontmatter?.tags) ? cache.frontmatter.tags.map(String) : [];
			const inlineTags = (cache?.tags ?? []).map((t) => t.tag);
			const outbound = Object.keys(resolved[file.path] ?? {}).length;
			return {
				path: file.path,
				basename: file.basename,
				hasFrontmatter: Boolean(cache?.frontmatter),
				tags: [...fmTags, ...inlineTags],
				linkCount: outbound + (inboundCounts.get(file.path) ?? 0),
			};
		});
	}
}
