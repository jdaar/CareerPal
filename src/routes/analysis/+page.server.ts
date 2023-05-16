import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const rows = await locals.Datasource.Tables.JobInfo.GetRows();
	const metrics = await locals.Datasource.Tables.JobInfo.GetMetrics(rows);

	return {
		metrics,
		row_count: rows.length
	};
}) satisfies PageServerLoad;