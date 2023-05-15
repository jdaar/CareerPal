import { mean, standardDeviation } from '$lib/scraper/lib/helpers';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const rows = await locals.Datasource.Tables.JobInfo.GetRows((v => true));
	console.log(rows.length);

	const metrics = await locals.Datasource.Tables.JobInfo.GetMetrics(rows);
	console.log(metrics);

	return {
		metrics,
		row_count: rows.length
	};
}) satisfies PageServerLoad;