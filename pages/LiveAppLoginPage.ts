import { WebActions } from '@helpers/WebActions';
import { expect, Locator, Page, BrowserContext } from '@playwright/test';
import { LiveAppPage } from './LiveAppPage';

let webActions: WebActions;

export class LiveAppLoginPage {
	page: Page;
	readonly context: BrowserContext;
	readonly EMAIL: Locator;
	readonly PASSWORD: Locator;
	readonly SIGN_IN: Locator;

	constructor(page: Page, context: BrowserContext) {
		this.page = page;
		this.context = context;
		webActions = new WebActions(this.page, this.context);
		this.EMAIL = this.page.locator('#email');
		this.PASSWORD = this.page.locator('#password');
		this.SIGN_IN = this.page.locator('[type="submit"]');
	}

	async loginAsUser(user: string, password: string): Promise<LiveAppPage> {
		await this.EMAIL.fill(user);
		await this.PASSWORD.fill(password);
		await this.SIGN_IN.click();
		return new LiveAppPage(this.page, this.context);
	}

}