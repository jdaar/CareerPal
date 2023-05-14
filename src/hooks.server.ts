import type { Handle } from '@sveltejs/kit';
import { JobScraperQueue } from '$lib/scraper/scraper';

export const handle = (async ({ event, resolve }) => {
    event.locals.JobScraperQueue = JobScraperQueue.GetInstance();

    const response = await resolve(event);
    return response;
}) satisfies Handle;