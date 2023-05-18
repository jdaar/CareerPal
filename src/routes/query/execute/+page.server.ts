import { JobScraper } from '$lib/scraper/scraper';
import { redirect } from '@sveltejs/kit';
import type { TParameterFormData, TRoleFormData } from '../store';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	const cachedParameterFormData: { type: 'parameter'; data: TParameterFormData } = JSON.parse(
		cookies.get('cachedParameterFormData') ?? '{}'
	);
	const cachedRoleFormData: { type: 'role'; data: TRoleFormData } = JSON.parse(
		cookies.get('cachedRoleFormData') ?? '{}'
	);

	if (cachedRoleFormData.data) {
		if (cachedRoleFormData.data.tags !== null || cachedRoleFormData.data.tags !== undefined) {
			cachedRoleFormData.data.tags = cachedRoleFormData.data.tags.filter((v) => v !== '') ?? [];
		}
	}

	return {
		cachedParameterFormData,
		cachedRoleFormData
	};
}) satisfies PageServerLoad;

export const actions = {
	execute: async ({ locals, cookies }) => {
		const cachedParameterFormData: { type: 'parameter'; data: TParameterFormData } = JSON.parse(
			cookies.get('cachedParameterFormData') ?? '{}'
		);
		const cachedRoleFormData: { type: 'role'; data: TRoleFormData } = JSON.parse(
			cookies.get('cachedRoleFormData') ?? '{}'
		);

		cachedRoleFormData.data.tags = cachedRoleFormData.data.tags.filter((v) => v !== '');

		const jobScraper = new JobScraper({
			connection_string: cachedParameterFormData.data.connection_string,
			pages: cachedParameterFormData.data.pages,
			role: cachedRoleFormData.data.role,
			tags: cachedRoleFormData.data.tags
		});

		locals.JobScraperQueue.Add(jobScraper);
		try {
			await locals.JobScraperQueue.ExecuteBatch();
		} catch (error) {
			console.error(error);
		}
		throw redirect(301, '/status');
	}
} satisfies Actions;
