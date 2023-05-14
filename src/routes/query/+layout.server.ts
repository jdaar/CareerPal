import type { PageServerLoad } from '$types';
import MongoDb from '$lib/scraper/datasources/mongodb'

export const load = (async () => {
	return {
		history: {}
	};
}) satisfies PageServerLoad;
