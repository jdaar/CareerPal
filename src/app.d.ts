// See https://kit.svelte.dev/docs/types#app

import type { Datasource } from '$lib/scraper/lib/datasource';
import type { JobScraperQueue } from '$lib/scraper/scraper';

// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			message: string;
			errorId: string;
		}
		interface Locals {
			JobScraperQueue: JobScraperQueue;
			Datasource: Datasource;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
