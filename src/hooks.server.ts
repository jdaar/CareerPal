import type { Handle } from '@sveltejs/kit';
import { JobScraperQueue } from '$lib/scraper/scraper';
import MongoDb from '$lib/scraper/datasources/mongodb';
import type { Datasource } from '$lib/scraper/lib/datasource';

function GetDatasource(conn_str: string) {
    const mongoDbRegex = new RegExp(/^mongodb:\/\/(?:(?:(\w+)?:(\w+)?@)|:?@?)((?:[\w.-])+)(?::(\d+))?(?:\/([\w-]+))?(?:\?([\w-]+=[\w-]+(?:&[\w-]+=[\w-]+)*)?)?$/);
    let datasource: Datasource | null = null;
    if (mongoDbRegex.test(conn_str)) {
      datasource = new MongoDb();
    }
    if (datasource === null) {
      throw new Error("Datasource not supported");
    }
    return datasource;
}

export const handle = (async ({ event, resolve }) => {
    const connectionStr = 'mongodb://localhost:27017/job-search';

    if (event.locals.Datasource === null || event.locals.Datasource === undefined) {
      event.locals.Datasource = GetDatasource(connectionStr);
      await event.locals.Datasource.Connect(connectionStr);
      await event.locals.Datasource.EnsureCreated();
    }

    event.locals.JobScraperQueue = JobScraperQueue.GetInstance(
      {
        batch_size: 1,
        connection_string: connectionStr
      },
      event.locals.Datasource
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