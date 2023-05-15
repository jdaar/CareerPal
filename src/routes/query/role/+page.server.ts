import type { PageServerLoad, Actions } from './$types';
import { AvailablePlatforms, type THistoryEntry, type TRoleFormData } from '../store';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ cookies }) => {
	const cachedFormData = JSON.parse(cookies.get('cachedRoleFormData') ?? '{}');

	const safeCachedFormData: TRoleFormData = {
		platform: 'computrabajo',
		role: '',
		tags: [],
		...cachedFormData.data
	}

	return {
		availablePlatforms: AvailablePlatforms,
		cachedFormData: safeCachedFormData
	};
}) satisfies PageServerLoad;

export const actions = {
	execute: async ({ request, cookies }) => {
		const data = await request.formData();
		const parsedData = Object.fromEntries(data)
		if (parsedData.role === '') return;

		cookies.set('cachedRoleFormData', JSON.stringify({type: 'role', data: {...parsedData, tags: (parsedData.tags as string)?.split(':') ?? []}}));

		const cachedHistoryEntries: {data: Array<THistoryEntry>} = JSON.parse(cookies.get('cachedHistoryEntries') ?? '{"data": []}');
		cookies.set('cachedHistoryEntries', JSON.stringify({data: [...cachedHistoryEntries.data, {type: 'role', data: {...parsedData, tags: (parsedData.tags as string)?.split(':') ?? []}}]}));

		throw redirect(301, '/query/parameters')
	},
} satisfies Actions;
