import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	/*
	const rows = await locals.JobScraperQueue.Datasource?.tables.JobInfo.getRows((job) => true)
	console.log(rows);
	*/
    
	return {
	};
}) satisfies PageServerLoad;