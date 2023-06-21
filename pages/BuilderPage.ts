//all elements are placed to the builder page but in real framework pages, records, etc should be separated.
import { WebActions } from '@helpers/WebActions';
import { Locator, Page, BrowserContext, ElementHandle } from '@playwright/test';
import { LiveAppLoginPage, } from './LiveAppLoginPage';

let webActions: WebActions;

export class BuilderPage {
	page: Page;
	readonly context: BrowserContext;
	readonly PAGES_TAB: Locator;
	readonly RECORDS_TAB: Locator;
	readonly EDIT_VIEW: Locator;
	readonly DISPLAY_RULE_ACTION_DROPDOWN: string;
	readonly DISPLAY_RULE_ICON_COLOR_INPUT: Locator;
	readonly SAVE_CHANGES: Locator;
	readonly WAREHOUSE_INVENTORY: Locator;
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
		this.PAGES_TAB = this.page.locator('[data-cy="nav-pages"]');
		this.RECORDS_TAB = this.page.locator('[data-cy="nav-records"]');
		this.EDIT_VIEW = this.page.locator('.blur');
		this.DISPLAY_RULE_ACTION_DROPDOWN = '.display-rule-actions select';
		this.DISPLAY_RULE_ICON_COLOR_INPUT = this.page.locator('.kn-colorInput input');
		this.SAVE_CHANGES = this.page.locator('[data-cy="toolbox-save"]');
		this.WAREHOUSE_INVENTORY = this.page.locator('[data-cy="Object Warehouse Inventory"]');
		this.ADD_FILTER_BUTTON = this.page.locator('[data-cy="add-filters"]');
		this.FILTER_ON = this.page.locator('[data-cy="field-list-field"]');
		this.FILTER_EXPRESSION = this.page.locator('[data-cy="field-list-operator"]');
		this.FILTER_VALUE_DROPDOWN = this.page.locator('[data-cy="dropdown-select"]');
		this.FILTER_SUBMIT = this.page.locator('[data-cy="save-filters"]');
		this.LOADER_ICON = '#kn-layout [data-cy="loader"]';
	}

	EDIT_COLUMN(columnName: string): Locator {
		return this.page.locator(`//span[text()='${columnName}']/following-sibling::div[1]`);
	}

	async openPagesTab(): Promise<void> {
		await this.PAGES_TAB.click();
	}

	async openRecordsTab(): Promise<void> {
		await this.RECORDS_TAB.click();
	}

	async selectPage(pageName: string): Promise<void> {
		await webActions.clickByText(pageName);
	}

	async openWarehouseInventory(): Promise<void> {
		await this.WAREHOUSE_INVENTORY.click();
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
		await this.page.waitForSelector(this.LOADER_ICON, { state: 'hidden'});
	}

	async getColumnValuesByColumnName(columnName: string): Promise<Array<string>> {
		const result: Array<string> = [];
		const identifier: string = await this.page.locator(`//th//span[text()='${columnName}']/..`).getAttribute('data-cy');
		const id: string = identifier.split('_')[1];
		const elements: Array<ElementHandle> = await this.page.$$(`[data-cy="table-cell-field_${id}"] span`);
		for (const e of elements) {
			result.push(await e.textContent());
		}
		return result;
	}

	async editView(): Promise<void> {
		await this.EDIT_VIEW.hover();
		await this.EDIT_VIEW.click();
	}

	async clickOnColumnHeader(columnName: string): Promise<void> {
		await this.EDIT_COLUMN(columnName).click();
	}

	async getSelectedDisplayRuleOption(): Promise<string> {
		return await webActions.getSelectedOption(this.page, this.DISPLAY_RULE_ACTION_DROPDOWN);
	}

	async setIconColor(color: string): Promise<void> {
		await this.DISPLAY_RULE_ICON_COLOR_INPUT.fill(color);
	}

	async saveChanges(): Promise<void> {
		await this.SAVE_CHANGES.click();
	}

	async goToLiveApp(): Promise<LiveAppLoginPage> {
		const pagePromise = this.context.waitForEvent('page');
		await webActions.clickByText('Go to Live App ');
		const newTab = await pagePromise;
		await newTab.waitForLoadState();
		return new LiveAppLoginPage(newTab, this.context);
	}

}