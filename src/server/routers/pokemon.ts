import { z } from 'zod';

import { router, publicProcedure } from "~/server/trpc";
import { POKEMON_API_BASE_URL, createSchema, extractEvolutions, fetchJson } from '~/utils/pokemon.utils';


export const pokemonRouter = router({
    getAllPokemon: publicProcedure
        .query(async () => {
            return fetchJson(`${POKEMON_API_BASE_URL}/pokemon`);
        }),

    getPokemonByName: publicProcedure.input(createSchema({ name: z.string() }))
        .query(async ({ input: { name } }) => {
            return fetchJson(`${POKEMON_API_BASE_URL}/pokemon-species/${name}`);
        }),

    getPokemonSpecies: publicProcedure.input(createSchema({ name: z.string() }))
        .query(async ({ input: { name } }) => fetchJson(`${POKEMON_API_BASE_URL}/pokemon-species/${name}`)),

    retrieveByUrl: publicProcedure.input(createSchema({ url: z.string() }))
        .query(async ({ input: { url } }) => fetchJson(url)),

    getAllGenerations: publicProcedure
        .query(async () => fetchJson(`${POKEMON_API_BASE_URL}/generation`)),

    getPokemonEvolutions: publicProcedure.input(createSchema({ name: z.string() }))
        .query(async ({ input: { name } }) => {
            const pokemonSpeciesData = await fetchJson(
                `${POKEMON_API_BASE_URL}/pokemon-species/${name}`
            );

            if (pokemonSpeciesData.evolution_chain?.url) {
                const evolutionData = await fetchJson(pokemonSpeciesData.evolution_chain.url);
                const evolutions = extractEvolutions(evolutionData.chain);
                return { result: evolutions };
            }
            return null
        })
})


