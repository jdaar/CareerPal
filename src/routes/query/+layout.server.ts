import type { LayoutServerLoad } from './$types';
import type { THistoryEntry } from './store';

export const load = (async (event) => {
	const historyEntries: THistoryEntry[] = [
		{
			roleForm: {
				platform: 'computrabajo',
				role: 'test',
				tags: ['Test']
			},
			parameterForm: {
				maxResults: 10
			}
		}
	];

	return {
		historyEntries
	 };
}) satisfies LayoutServerLoad;
