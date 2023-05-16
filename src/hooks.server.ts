import type { Handle } from '@sveltejs/kit';
import { JobScraperQueue } from '$lib/scraper/scraper';
import MongoDb from '$lib/scraper/datasources/mongodb';
import type { Datasource } from '$lib/scraper/lib/datasource';
import type { TParameterFormData } from './routes/query/store';

const MONGODB = new MongoDb();

function GetDatasource(conn_str: string) {
    const mongoDbRegex = new RegExp(/^mongodb:\/\/(?:(?:(\w+)?:(\w+)?@)|:?@?)((?:[\w.-])+)(?::(\d+))?(?:\/([\w-]+))?(?:\?([\w-]+=[\w-]+(?:&[\w-]+=[\w-]+)*)?)?$/);
    let datasource: Datasource | null = null;
    if (mongoDbRegex.test(conn_str)) {
      datasource = MONGODB;
    }
    if (datasource === null) {
      throw new Error("Datasource not supported");
    }
    return datasource;
}

export const handle = (async ({ event, resolve }) => {
    const connectionStr = (JSON.parse(event.cookies.get('cachedParameterFormData') ?? '{}').data as TParameterFormData).connection_string ?? 'mongodb://localhost:27017/job';

    if (event.locals.Datasource === null || event.locals.Datasource === undefined) {
      event.locals.Datasource = GetDatasource(connectionStr);
      if (!event.locals.Datasource.Connected) {
        await event.locals.Datasource.Connect(connectionStr);
        await event.locals.Datasource.EnsureCreated();
      }
    }

    if (event.locals.Datasource.ConnectionStr !== connectionStr) {
      await event.locals.Datasource?.Disconnect();
      event.locals.Datasource = GetDatasource(connectionStr);
      if (!event.locals.Datasource.Connected) {
        await event.locals.Datasource.Connect(connectionStr);
        await event.locals.Datasource.EnsureCreated();
        event.locals.JobScraperQueue?.SetDatasource(event.locals.Datasource);
      }
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