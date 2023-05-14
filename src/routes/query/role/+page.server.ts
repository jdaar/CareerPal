import type { PageServerLoad, Actions } from './$types';
import { AvailablePlatforms, type THistoryEntry, type TRoleFormData } from '../store';

export const load = (async ({ cookies }) => {
	const cachedFormData: TRoleFormData = JSON.parse(cookies.get('cachedFormData') ?? '{}');
	return {
		availablePlatforms: AvailablePlatforms,
		cachedFormData
	};
}) satisfies PageServerLoad;

export const actions = {
	execute: async ({ request, cookies }) => {
		const data = await request.formData();
		cookies.set('cachedFormData', JSON.stringify(Object.fromEntries(data)));

		const cachedHistoryEntries: {data: Array<THistoryEntry>} = JSON.parse(cookies.get('cachedHistoryEntries') ?? '{"data": []}');
		cookies.set('cachedHistoryEntries', JSON.stringify({data: [...cachedHistoryEntries.data, {type: 'role', data: Object.fromEntries(data)}]}));
	},
} satisfies Actions;
