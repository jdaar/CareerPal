import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const rows = (await locals.Datasource.Tables.JobInfo.GetRows()).filter((v, i, a) => a.findIndex(v2 => v2.url === v.url) === i);
	const metrics = await locals.Datasource.Tables.JobInfo.GetMetrics(rows);

	return {
		metrics,
		row_count: rows.length
	};
}) satisfies PageServerLoad;