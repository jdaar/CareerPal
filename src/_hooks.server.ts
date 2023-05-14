import type { Handle, HandleServerError } from '@sveltejs/kit';
import { JobScraperQueue } from '$lib/scraper/scraper';
import { GenerateGuid } from '$lib/scraper/lib/helpers';
import { log } from '$lib/scraper/lib/io';

export const handle = (async ({ event, resolve }) => {
    /*
    event.locals.JobScraperQueue = JobScraperQueue.GetInstance();
    console.log(event.locals.JobScraperQueue)
    */

    const response = await resolve(event);
    return response;
}) satisfies Handle;