import { WebActions } from '@helpers/WebActions';
import { Page, BrowserContext, expect } from '@playwright/test';
import { BuilderPage } from './BuilderPage';

let webActions: WebActions;

export class AppsPage {
	readonly page: Page;
	readonly context: BrowserContext;

	constructor(page: Page, context: BrowserContext) {
		this.page = page;
		this.context = context;
		webActions = new WebActions(this.page, this.context);
	}

	async openAppByName(appName: string): Promise<BuilderPage> {
		const pagePromise = this.context.waitForEvent('page');
		await webActions.clickByText(appName);
		const newTab = await pagePromise;
		await newTab.waitForLoadState();
		await expect(newTab).toHaveTitle('Knack Builder');
		return new BuilderPage(newTab, this.context)
	}
}