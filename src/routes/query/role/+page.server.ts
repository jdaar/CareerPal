import type { PageServerLoad, Actions } from './$types';
import MongoDb from '$lib/scraper/datasources/mongodb';
import { AvailablePlatforms, type RoleFormData } from './store';


export const load = (async ({ cookies }) => {
	const cachedFormData: RoleFormData = JSON.parse(cookies.get('cachedFormData') ?? '{}');
	return {
		cachedFormData,
		availablePlatforms: AvailablePlatforms
	};
}) satisfies PageServerLoad;

export const actions = {
	execute: async ({ request, cookies }) => {
		const data = await request.formData();
		if (!MongoDb.tables.History.created) {
			await MongoDb.tables.History.create();
		}
		MongoDb.tables.History.postRow({
			date_iso: new Date().toISOString(),
			value: data.get('role') as string,
			type: 'role'
		});
		cookies.set('cachedFormData', JSON.stringify(Object.fromEntries(data)));
	},
} satisfies Actions;
