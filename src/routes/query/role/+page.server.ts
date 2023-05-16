import type { PageServerLoad, Actions } from './$types';
import { AvailablePlatforms, type THistoryEntry, type TRoleFormData } from '../store';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ cookies }) => {
	const cachedFormData = JSON.parse(cookies.get('cachedRoleFormData') ?? '{}');

	const safeCachedFormData: TRoleFormData = {
		platform: 'computrabajo',
		role: '',
		...cachedFormData.data,
		tags: cachedFormData.data.tags.filter((v: string) => v !== '')
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

		cookies.set('cachedRoleFormData', JSON.stringify({type: 'role', data: {...parsedData, tags: (parsedData.tags as string)?.split(':') ?? []}}), {
			path: '/'
		});

		const cachedHistoryEntries: {data: Array<THistoryEntry>} = JSON.parse(cookies.get('cachedHistoryEntries') ?? '{"data": []}');

		const filteredCachedHistoryEntries = [
			...cachedHistoryEntries.data.
			filter(v => v.type === 'role')
			.filter(v => {
				const entryRole: TRoleFormData = v.data as TRoleFormData;
				console.log(entryRole)
				return (entryRole.platform != parsedData.platform)
						&& (entryRole.role != parsedData.role)
						&& (entryRole.tags != (parsedData.tags as string)?.split(':') ?? []);
			}),
			...cachedHistoryEntries.data.filter(v => v.type === 'parameter')
		];

		cookies.set('cachedHistoryEntries', JSON.stringify({data: [...filteredCachedHistoryEntries, {type: 'role', data: {...parsedData, tags: (parsedData.tags as string)?.split(':') ?? []}}]}), {
			path: '/'
		});

		throw redirect(301, '/query/parameters')
	},
} satisfies Actions;
