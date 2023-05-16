import type { THistoryEntry, TParameterFormData } from '../store';
import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ cookies }) => {
	const cachedFormData = JSON.parse(cookies.get('cachedParameterFormData') ?? '{}');

	const safeCachedFormData: TParameterFormData = {
		connection_string: '',
		pages: 1,
		...cachedFormData.data
	}

	return {
		cachedFormData: safeCachedFormData
	};
}) satisfies PageServerLoad;

export const actions = {
	execute: async ({ request, cookies }) => {
		const data = await request.formData();
		const parsedData = Object.fromEntries(data)
		if (parsedData.role === '') return;

		cookies.set('cachedParameterFormData', JSON.stringify({type: 'parameter', data: parsedData}), {
			path: '/'
		});

		const cachedHistoryEntries: {data: Array<THistoryEntry>} = JSON.parse(cookies.get('cachedHistoryEntries') ?? '{"data": []}');
		cookies.set('cachedHistoryEntries', JSON.stringify({data: [...cachedHistoryEntries.data, {type: 'parameter', data: parsedData}]}), {
			path: '/'
		});

		throw redirect(301, '/query/execute')
	},
} satisfies Actions;
