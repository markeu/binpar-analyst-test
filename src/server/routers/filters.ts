import { z } from 'zod';

import { router, publicProcedure } from "~/server/trpc";
import { POKEMON_API_BASE_URL, createSchema, getPokemonByGeneration, getPokemonByType, getPokenmonByTypeAndGeneration } from '~/utils/pokemon.utils';


export const filterRouter = router({
    filterPokemonByGeneration: publicProcedure.input(createSchema({ generation: z.string() }))
        .query(async ({ input: { generation } }) => {
            const pokemonGenerations = await getPokemonByGeneration(`${POKEMON_API_BASE_URL}/generation/${generation}`)
            return { output: pokemonGenerations }
        }),

    filterPokemonByType: publicProcedure.input(createSchema({ type: z.string() }))
        .query(async ({ input: { type } }) => {
            const pokemonType = await getPokemonByType(`${POKEMON_API_BASE_URL}/type/${type}`);
            return { output: pokemonType }
        }),

    filterPokemonByTypeAndGeneration: publicProcedure
        .input(createSchema({ type: z.string(), generation: z.string() }))
        .query(async ({ input: { type, generation } }) => {
            const pokemonByTypeAndGeneration = await getPokenmonByTypeAndGeneration(`${POKEMON_API_BASE_URL}/generation/${generation}`, `${POKEMON_API_BASE_URL}/type/${type}`);
            return { output: pokemonByTypeAndGeneration }
        })
})