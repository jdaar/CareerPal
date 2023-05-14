import type { PageServerLoad, Actions } from './$types';
import { AvailablePlatforms, type RoleFormData } from './store';

export const load = (async ({ cookies }) => {
	/*
	const cachedFormData: RoleFormData = JSON.parse(cookies.get('cachedFormData') ?? '{}');
	cachedFormData,
	*/
	/*
	return {
		availablePlatforms: AvailablePlatforms
	};*/
	return {};
}) satisfies PageServerLoad;

export const actions = {
	/*
	execute: async ({ request, cookies }) => {
		const data = await request.formData();
		cookies.set('cachedFormData', JSON.stringify(Object.fromEntries(data)));
	},
	*/
} satisfies Actions;
