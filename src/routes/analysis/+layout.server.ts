import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const rows = (await locals.Datasource.Tables.JobInfo.GetRows()).filter((v, i, a) => a.findIndex(v2 => v2.url === v.url) === i);
	const metrics = await locals.Datasource.Tables.JobInfo.GetMetrics(rows);

	// Hack to avoid non-POJO error
	const plainRows = JSON.parse(JSON.stringify(rows));

	return {
		metrics,
		rows: plainRows,
		row_count: rows.length
	};
}) satisfies LayoutServerLoad;