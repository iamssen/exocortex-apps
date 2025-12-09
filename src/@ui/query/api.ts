import type { APIConfig } from '@iamssen/exocortex/server';
import type {
  QueryFunction,
  QueryFunctionContext,
  UseQueryOptions,
} from '@tanstack/react-query';

type Routes = {
  [P in APIConfig[number] as P['__apiPath__']]: {
    data: P['__data__'];
    query: P['__query__'];
  };
};

const API_ENDPOINT = process.env.API_ENDPOINT ?? 'https://192.168.1.98:9999';

async function queryFn(ctx: QueryFunctionContext<[string]>): Promise<any> {
  const path = ctx.queryKey[0];
  const res = await fetch(`${API_ENDPOINT}/${path}`);
  return res.headers.get('Content-Type')?.startsWith('text/')
    ? res.text()
    : res.json();
}

export function api<P extends keyof Routes>(
  path: P,
  ...args: Routes[P]['query'] extends never
    ? [
        query?: {},
        options?: Omit<
          UseQueryOptions<Routes[P]['data']>,
          'queryKey' | 'queryFn'
        >,
      ]
    : {} extends Routes[P]['query']
      ? [
          query?: Routes[P]['query'],
          options?: Omit<
            UseQueryOptions<Routes[P]['data']>,
            'queryKey' | 'queryFn'
          >,
        ]
      : [
          query: Routes[P]['query'],
          options?: Omit<
            UseQueryOptions<Routes[P]['data']>,
            'queryKey' | 'queryFn'
          >,
        ]
): UseQueryOptions<Routes[P]['data']> {
  const refetchInterval = path.startsWith('finance/quote/')
    ? 1000 * 60
    : 1000 * 60 * 10;

  const [query = {}, options = {}] = args;
  const searchParams = new URLSearchParams(query);

  return {
    queryKey: [
      path + (searchParams.size > 0 ? `?${searchParams.toString()}` : ''),
    ],
    queryFn: queryFn as QueryFunction<Routes[P]['data']>,
    refetchInterval,
    ...options,
  };
}
