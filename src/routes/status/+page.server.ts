import type { PageServerLoad } from './$types';

type TInstanceQueueStateEntry = {
	id: string;
	role: string;
	platform: string;
	tags: string[];
	status: string;
};

export const load = (async ({ locals }) => {
	let rows: TInstanceQueueStateEntry[] = new Array<TInstanceQueueStateEntry>();
	if (locals.JobScraperQueue) {
		if (
			locals.JobScraperQueue.InstancedQueue !== null &&
			locals.JobScraperQueue.InstancedQueue !== undefined
		) {
			rows = locals.JobScraperQueue.InstancedQueue.map((v) => ({
				id: v.id,
				role: v.scraper.Parameters.role,
				platform: 'computrabajo',
				tags: v.scraper.Parameters.tags,
				status: v.status
			}));
		}
	}

	return {
		rows
	};
}) satisfies PageServerLoad;
