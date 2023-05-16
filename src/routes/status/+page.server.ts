import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const rows = locals.JobScraperQueue.InstancedQueue.map(v => ({
		id: v.id,
		role: v.scraper.Parameters.role,
		platform: 'computrabajo',
		tags: v.scraper.Parameters.tags,
		status: v.status
	}))

	return {
		rows
	};
}) satisfies PageServerLoad;