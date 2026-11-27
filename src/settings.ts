import { App, PluginSettingTab, Setting } from "obsidian";
import type FlatTaxonomyPlugin from "./main";

export interface TaxonomySettings {
	reportPath: string;
	defaultNoteType: string;
	autoAssignDomainOnRoute: boolean;
}

export const DEFAULT_SETTINGS: TaxonomySettings = {
	reportPath: "_Taxonomy_Health_Report.md",
	defaultNoteType: "note",
	autoAssignDomainOnRoute: true,
};

export class TaxonomySettingTab extends PluginSettingTab {
	private readonly plugin: FlatTaxonomyPlugin;

	constructor(app: App, plugin: FlatTaxonomyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl).setName("Flat taxonomy settings").setHeading();

		new Setting(containerEl)
			.setName("Health report path")
			.setDesc("Vault-relative path where the offline audit report note is written.")
			.addText((text) =>
				text
					.setPlaceholder("_Taxonomy_Health_Report.md")
					.setValue(this.plugin.settings.reportPath)
					.onChange(async (value) => {
						this.plugin.settings.reportPath = value.trim() || DEFAULT_SETTINGS.reportPath;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Default note type")
			.setDesc("Fallback YAML type field added when normalizing frontmatter.")
			.addText((text) =>
				text
					.setPlaceholder("note")
					.setValue(this.plugin.settings.defaultNoteType)
					.onChange(async (value) => {
						this.plugin.settings.defaultNoteType = value.trim() || DEFAULT_SETTINGS.defaultNoteType;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Update YAML domain on folder route")
			.setDesc("Automatically update the frontmatter domain property when routing a note.")
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.autoAssignDomainOnRoute).onChange(async (value) => {
					this.plugin.settings.autoAssignDomainOnRoute = value;
					await this.plugin.saveSettings();
				}),
			);

		this.renderCompanionSection(containerEl);
	}

	private renderCompanionSection(containerEl: HTMLElement): void {
		new Setting(containerEl).setName("Optional automation and Remote MCP gateway").setHeading();

		new Setting(containerEl)
			.setName("ScrapLibra Pro Second Brain + Remote MCP")
			.setDesc(
				"Optional hosted companion ($4.99/mo or $3.99/mo annual; 10 free notes) for bulk bookmark structuring and live Remote MCP + TOON search in Claude, Cursor, and Gemini.",
			)
			.addButton((button) =>
				button.setButtonText("View plans").setCta().onClick(() => {
					window.open(
						"https://scraplibra.com/#pricing?utm_source=obsidian_plugin&utm_medium=settings",
						"_blank",
						"noopener",
					);
				}),
			)
			.addButton((button) =>
				button.setButtonText("MCP docs").onClick(() => {
					window.open(
						"https://scraplibra.com/mcp-docs/?utm_source=obsidian_plugin&utm_medium=settings",
						"_blank",
						"noopener",
					);
				}),
			);
	}
}
