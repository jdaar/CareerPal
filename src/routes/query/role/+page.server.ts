import type { PageServerLoad, Actions } from './$types';
import { AvailablePlatforms, type THistoryEntry, type TRoleFormData } from '../store';

export const load = (async ({ cookies }) => {
	const cachedFormData = JSON.parse(cookies.get('cachedFormData') ?? '{}');

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
		cookies.set('cachedFormData', JSON.stringify({type: 'role', data: {...parsedData, tags: (parsedData.tags as string)?.split(':') ?? []}}));

		const cachedHistoryEntries: {data: Array<THistoryEntry>} = JSON.parse(cookies.get('cachedHistoryEntries') ?? '{"data": []}');
		cookies.set('cachedHistoryEntries', JSON.stringify({data: [...cachedHistoryEntries.data, {type: 'role', data: {...parsedData, tags: (parsedData.tags as string)?.split(':') ?? []}}]}));
	},
} satisfies Actions;
