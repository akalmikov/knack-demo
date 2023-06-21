import { test as baseTest } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { WebActions } from './WebActions';
import { AppsPage } from '@pages/AppsPage';

const test = baseTest.extend<{
	webActions: WebActions;
	loginPage: LoginPage;
	appsPage: AppsPage;
}>({
	webActions: async ({ page, context }, use) => {
		await use(new WebActions(page, context));
	},
	loginPage: async ({ page, context }, use) => {
		await use(new LoginPage(page, context));
	},
	appsPage: async ({ page, context }, use) => {
		await use(new AppsPage(page, context));
	},
})

export default test;