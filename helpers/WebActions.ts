import type { Page } from '@playwright/test';
import { BrowserContext } from '@playwright/test';

export class WebActions {
	readonly page: Page;
	readonly context: BrowserContext;

	constructor(page: Page, context: BrowserContext) {
		this.page = page;
		this.context = context;
	}

	async delay(time: number): Promise<void> {
		return new Promise(function (resolve) {
			setTimeout(resolve, time);
		});
	}

	async clickByText(text: string): Promise<void> {
		await this.page.getByText(text, { exact: true }).click();
	}

	async clickElementJS(locator: string): Promise<void> {
		await this.page.$eval(locator, (element: HTMLElement) => element.click());
	}

	async getSelectedOption(page: Page, selector: string): Promise<string | null> {
		const selectedOption = await page.evaluate((selector) => {
			const selectElement = document.querySelector(selector) as HTMLSelectElement;
			const selectedIndex = selectElement.selectedIndex;
			if (selectedIndex >= 0) {
				const option = selectElement.options[selectedIndex];
				return option.text;
			}
			return null;
		}, selector);

		return selectedOption;
	};

	async getElementStyleAttributeValue(page: Page, selector: string, attributeName: string): Promise<Record<string, string> | null> {
		const element = await page.locator(selector).first();
		if (element) {
			const attr = await element.getAttribute(attributeName);
			if (attr) {
				const keyValuePairs = attr.split(';')
					.filter(pair => pair.trim() !== '') // Remove any empty pairs
					.map(pair => pair.trim().split(':'))
					.map(([key, value]) => [key.trim(), value.trim()]);
				return await Object.fromEntries(keyValuePairs);
			}
		}
		return null;
	}

	async getElementAttributeValue(page: Page, selector: string, attributeName: string): Promise<string | null> {
		const element = await page.locator(selector).first();
		if (element) {
			const attr = await element.getAttribute(attributeName);
			if (attr) {
				const value = attr.split('=')[1];
				return value;
			}
		}
		return null;
	}
}

export const waitFor = async <T>(
	predicate: () => T | Promise<T>,
	options?: { timeout?: number; wait?: number }
): Promise<T> => {
	const { timeout = 20000, wait = 2000 } = options || {};

	const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
	const startDate = new Date();

	while (new Date().getTime() - startDate.getTime() < timeout) {
		const result = await predicate();
		if (result) return result;

		await sleep(wait)
		console.log(`Waiting ${wait}ms`);
	}

	throw new Error(`Wait time of ${timeout}ms exceeded`)
}