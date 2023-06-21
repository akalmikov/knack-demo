import test from '@helpers/BaseTest';
import { expect } from '@playwright/test';
import { color } from 'pengrape';

test.beforeEach(async ({ loginPage }) => {
	await loginPage.navigateToURL();
	await loginPage.loginAsUserWithPass(process.env.USERNAME, process.env.PASSWORD);
});

test('Icon Color for Display Rules', async ({ appsPage }) => { 
	const randomColor: string = color({ format: "hex" });
	const builderPage = await appsPage.openAppByName('Warehouse Manager');
	await builderPage.openPagesTab();
	await builderPage.selectPage('Admin > Inventory');
	await builderPage.selectPage('Inventory');
	await builderPage.editView();
	await builderPage.clickOnColumnHeader('On-Hand');
	expect(await builderPage.getSelectedDisplayRuleOption()).toEqual('Display Icon');
	await builderPage.setIconColor(randomColor);
	await builderPage.saveChanges();
	const liveAppLoginPage = await builderPage.goToLiveApp();
	const liveAppPage = await liveAppLoginPage.loginAsUser('admin@test.com', 'test');
	expect(await liveAppPage.getIconColor()).toEqual(randomColor);
})


test('Filtering Inventory', async ({ appsPage }) => {
	const builderPage = await appsPage.openAppByName('Warehouse Manager');
	await builderPage.openRecordsTab();
	await builderPage.openWarehouseInventory();
	await builderPage.addFilter('Needs Re-Order', 'is', 'Yes');
	const builderRecords = await builderPage.getColumnValuesByColumnName('Needs Re-Order');
	const recordsCount = builderRecords.length;
	expect((builderRecords).every(v => v === 'Yes')).toBe(true);
	const liveAppLoginPage = await builderPage.goToLiveApp();
	const liveAppPage = await liveAppLoginPage.loginAsUser('admin@test.com', 'test');
	await liveAppPage.openTab('Inventory');
	await liveAppPage.addFilter('Needs Re-Order', 'is', 'Yes');
	const liveAppRecords = await liveAppPage.getColumnValuesByColumnName('Re-Order?');
	expect((liveAppRecords).every(v => v.trim() === 'Yes')).toBe(true);
	expect(liveAppRecords.length).toEqual(recordsCount);

})
