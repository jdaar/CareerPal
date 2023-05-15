import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const rows = await locals.Datasource.Tables.JobInfo.GetRows((v => true));
	console.log(rows);
    
	return {
	};
}) satisfies PageServerLoad;