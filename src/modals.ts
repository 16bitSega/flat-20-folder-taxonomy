import { App, FuzzyMatch, FuzzySuggestModal } from "obsidian";
import { DomainSpec } from "./taxonomy";

export class DomainSuggestModal extends FuzzySuggestModal<DomainSpec> {
	private readonly domains: readonly DomainSpec[];
	private readonly onChoose: (domain: DomainSpec) => void;

	constructor(app: App, domains: readonly DomainSpec[], onChoose: (domain: DomainSpec) => void) {
		super(app);
		this.domains = domains;
		this.onChoose = onChoose;
		this.setPlaceholder("Choose a flat domain folder...");
	}

	getItems(): DomainSpec[] {
		return [...this.domains];
	}

	getItemText(item: DomainSpec): string {
		return `${item.folder} ${item.description}`;
	}

	renderSuggestion(match: FuzzyMatch<DomainSpec>, el: HTMLElement): void {
		const wrapper = el.createDiv({ cls: "flat-taxonomy-suggestion" });
		wrapper.createDiv({ cls: "flat-taxonomy-suggestion-title", text: match.item.folder });
		wrapper.createDiv({ cls: "flat-taxonomy-suggestion-desc", text: match.item.description });
	}

	onChooseItem(item: DomainSpec): void {
		this.onChoose(item);
	}
}
