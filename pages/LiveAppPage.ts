import { WebActions } from '@helpers/WebActions';
import { expect, Locator, Page, BrowserContext, ElementHandle } from '@playwright/test';

let webActions: WebActions;

export class LiveAppPage {
	page: Page;
	readonly context: BrowserContext;
	readonly ALERT_ICON: string;
	readonly ADD_FILTER_BUTTON: Locator;
	readonly FILTER_ON: Locator;
	readonly FILTER_EXPRESSION: Locator;
	readonly FILTER_VALUE_DROPDOWN: Locator;
	readonly FILTER_SUBMIT: Locator;
	readonly LOADER_ICON: string;

	constructor(page: Page, context: BrowserContext) {
		this.page = page;
		this.context = context;
		webActions = new WebActions(this.page, this.context);
		this.ALERT_ICON = '.fa-warning';
		this.ADD_FILTER_BUTTON = page.locator('.kn-add-filter');
		this.FILTER_ON = page.locator('.filters-list [name="field"]');
		this.FILTER_EXPRESSION = page.locator('.filters-list [name="operator"]');
		this.FILTER_VALUE_DROPDOWN = page.locator('.filters-list [name="value"]');
		this.FILTER_SUBMIT = page.locator('#kn-submit-filters');
		this.LOADER_ICON = '#kn-loading-spinner';
	}

	async openTab(tab: string): Promise<void> {
		await webActions.clickByText(tab);
	}

	async getIconColor(): Promise<string> {
		const styles = await webActions.getElementStyleAttributeValue(this.page, this.ALERT_ICON, 'style');
		return styles['color'];
	}

	async addFilter(filterOn: string, filterExpression: string, filterValue: string): Promise<void> {
		await this.ADD_FILTER_BUTTON.click();
		await this.FILTER_ON.selectOption(filterOn);
		await this.FILTER_EXPRESSION.selectOption(filterExpression);
		if (this.FILTER_VALUE_DROPDOWN.isDisabled)
			await this.FILTER_VALUE_DROPDOWN.selectOption(filterValue);
		//here will be an implementation of other types of value field.
		await this.FILTER_SUBMIT.click();
		await this.page.waitForSelector(this.LOADER_ICON);
		await this.page.waitForSelector(this.LOADER_ICON, { state: 'hidden' });
	}

	async getColumnValuesByColumnName(columnName: string): Promise<Array<string>> {
		const result: Array<string> = [];
		const identifier: string = await this.page.locator(`//th/span/a/span[text()='${columnName}']//ancestor::th`).getAttribute('class');
		const id: string = identifier.split('_')[1];
		const elements: Array<ElementHandle> = await this.page.$$(`[data-field-key="field_${id}"] span`);
		for (const e of elements) {
			result.push(await e.textContent());
		}
		return result;
	}

}