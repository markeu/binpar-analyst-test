/**
 * This file contains tRPC's HTTP response handler
 */
import * as trpcNext from '@trpc/server/adapters/next';
import { createContext } from '~/server/context';
import { appRouter } from '~/server/routers/_app';

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError: ({ path, error })=> {
    if (error.code === 'INTERNAL_SERVER_ERROR') {

      console.error( `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,);
    }
  },
  /**
   * @link https://trpc.io/docs/v11/caching#api-response-caching
   */
  // responseMeta() {
  //   // ...
  // },
});