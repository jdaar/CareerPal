import type { Handle } from '@sveltejs/kit';
import { JobScraperQueue } from '$lib/scraper/scraper';

export const handle = (async ({ event, resolve }) => {
    event.locals.JobScraperQueue = JobScraperQueue.GetInstance(
      {
        batch_size: 1,
        connection_string: 'mongodb://localhost:27017/job-search'
      }
    );

    if(event.request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
        }
      });
    }

    const response = await resolve(event);

    response.headers.append('Access-Control-Allow-Origin', `*`);

    return response;
}) satisfies Handle;