import { WebActions } from '@helpers/WebActions';
import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { AppsPage } from './AppsPage';

let webActions: WebActions;

export class LoginPage {
	readonly page: Page;
	readonly context: BrowserContext;
	readonly USERNAME_INPUT: Locator;
	readonly PASSWORD_INPUT: Locator;
	readonly LOGIN_BUTTON: Locator;

	constructor(page: Page, context: BrowserContext) {
		this.page = page;
		this.context = context;
		webActions = new WebActions(this.page, this.context);
		this.USERNAME_INPUT = page.locator('#email');
		this.PASSWORD_INPUT = page.locator('#password');
		this.LOGIN_BUTTON = page.locator('#submit');
	}

	async navigateToURL(): Promise<void> {
		await this.page.goto("/");
	}

	async loginAsUserWithPass(user: string, password: string): Promise<AppsPage> {
		await this.USERNAME_INPUT.fill(user);
		await this.PASSWORD_INPUT.fill(password);
		await this.LOGIN_BUTTON.click();
		return new AppsPage(this.page, this.context);
	}
}