/**
 * This file contains the root router of your tRPC-backend
 */
import { z } from 'zod';
import { createCallerFactory, publicProcedure, router } from '../trpc';
// import { postRouter } from './post';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'Hello nextJs!'),

  hello: publicProcedure
  .input(
    z.object({
      text: z.string(),
    }),
  )
  .query((opts) => {
    return {
      greeting: `hello ${opts.input.text}`,
    };
  }),
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;