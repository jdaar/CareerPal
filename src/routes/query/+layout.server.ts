import type { LayoutServerLoad } from './$types';
import type { THistoryEntry } from './store';

export const load = (async ({ cookies }) => {
	const cachedHistoryEntries: {data: Array<THistoryEntry>} = JSON.parse(cookies.get('cachedHistoryEntries') ?? '{"data": []}');

	return {
		historyEntries: cachedHistoryEntries.data
	 };
}) satisfies LayoutServerLoad;
