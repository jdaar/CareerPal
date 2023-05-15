import type { Handle } from '@sveltejs/kit';
import { JobScraperQueue } from '$lib/scraper/scraper';

export const handle = (async ({ event, resolve }) => {
    event.locals.JobScraperQueue = JobScraperQueue.GetInstance(
      {
        batch_size: 1,
        connection_string: 'mongodb://localhost:27017/job-search'
      }
    );

    const response = await resolve(event);
    return response;
}) satisfies Handle;