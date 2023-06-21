import { PlaywrightTestConfig } from '@playwright/test';
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" })

const config: PlaywrightTestConfig = {

	timeout: 5 * 6 * 1000, // Setup timeout to 5 minutes.  
	use: {
		headless: false, // Turn off headless mode.
		baseURL: process.env.HOST
	},
};

export default config;