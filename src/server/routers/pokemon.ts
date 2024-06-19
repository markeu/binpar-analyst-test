import { z } from 'zod';

import { router, publicProcedure } from "~/server/trpc";
import PokemonList, { PokemonData, PokemonGeneration, PokemonSpecies, Species } from '~/types/types';
import { POKEMON_API_BASE_URL, createSchema, extractEvolutions, fetchJson } from '~/utils/pokemon.utils';


export const pokemonRouter = router({
    getAllPokemon: publicProcedure
        .query(async () => {
            return fetchJson(`${POKEMON_API_BASE_URL}/pokemon`) as Promise<PokemonList>;
        }),

    getPokemonByName: publicProcedure.input(createSchema({ name: z.string() }))
        .query(async ({ input: { name } }) => {
            return fetchJson(`${POKEMON_API_BASE_URL}/pokemon/${name}`) as Promise<PokemonData>;
        }),

    getMorePaginatedPokemon: publicProcedure.input(createSchema({ offset: z.number() }))
        .query(async ({ input: { offset } }) => {
            return fetchJson(`${POKEMON_API_BASE_URL}/pokemon?limit=${offset}`)
        }),

    getSearchPokemonData: publicProcedure
        .query(async () => {
            const NUMBER_MAX_POKEMONS_API = 750;
            return fetchJson(`${POKEMON_API_BASE_URL}/pokemon?limit=${NUMBER_MAX_POKEMONS_API}`) as Promise<PokemonList>;
        }),

    getPokemonSpecies: publicProcedure.input(createSchema({ name: z.string() }))
        .query(async ({ input: { name } }) => fetchJson(`${POKEMON_API_BASE_URL}/pokemon-species/${name}`) as Promise<PokemonSpecies>),

    retrieveByUrl: publicProcedure.input(createSchema({ url: z.string() }))
        .query(async ({ input: { url } }) => fetchJson(url)),

    getAllGenerations: publicProcedure
        .query(async () => fetchJson(`${POKEMON_API_BASE_URL}/generation`) as Promise<PokemonGeneration>),

    getPokemonEvolutions: publicProcedure.input(createSchema({ name: z.string() }))
        .query(async ({ input: { name } }) => {
            const pokemonSpeciesData: PokemonSpecies = await fetchJson(
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


