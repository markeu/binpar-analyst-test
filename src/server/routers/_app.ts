import { filterRouter } from './filters';
import { pokemonRouter } from './pokemon';
import { createCallerFactory, publicProcedure, router } from '../trpc';


export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'Hey, Relax Running as expected !!'),
  filters: filterRouter,
  pokemon: pokemonRouter
 
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;