import { ZodTypeAny, ZodSchema, z } from "zod";
import { ChainType, PokemonData } from "~/types/types";

export const { POKEMON_API_BASE_URL } = process.env;


interface PokemonEvolvesProps {
    name: string;
    level: number;
    image?: string;
    number?: string;
  }

  interface EvolvesProps {
    species: {
      name: string;
    };
    evolution_details: [{ min_level: number }];
    evolves_to: EvolvesProps[];
  }

export const extractEvolutions = ({
    species,
    evolves_to,
    evolution_details,
  }: EvolvesProps): PokemonEvolvesProps[] => {
    let namesPokemons: PokemonEvolvesProps[] = [
        {
          name: species.name,
          level: 0,
        },
      ];
      if (evolution_details.length)
        namesPokemons[0].level = evolution_details[0].min_level;

      evolves_to.forEach((evolves: EvolvesProps) => {
        namesPokemons = namesPokemons.concat(extractEvolutions(evolves));
      });

      return namesPokemons;
};

export const fetchJson = async (url: string) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching ${url}: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch data');
    }
};

export const createSchema = (fields: { [key: string]: ZodTypeAny }): ZodSchema => {
    const processedFields = Object.keys(fields).reduce((acc, key) => {
        acc[key] = z.preprocess((val) => {
            if (typeof val === 'string') {
                return val.toLowerCase();
            }
            return val;
        }, fields[key]);
        return acc;
    }, {} as { [key: string]: ZodTypeAny });

    return z.object(processedFields);
};

export const getPokemonByGeneration = async (generationUrl: string) => {
    const pokemonGeneration = await fetchJson(generationUrl);
    return pokemonGeneration.pokemon_species.map((pokemonSpecie: any) => ({ name: pokemonSpecie.name }))
}

export const getPokemonByType = async (typeUrl: string) => {
    const pokemonType = await fetchJson(typeUrl);
    return pokemonType.pokemon.map((pokemon: any) => ({ name: pokemon.pokemon.name }))
}

export const getPokenmonByTypeAndGeneration = async(generationUrl: string, typeUrl: string) => {
    const [pokemonGeneration, pokemonType] = await Promise.all([
        getPokemonByGeneration(generationUrl),
        getPokemonByType(typeUrl),
      ]);

    return pokemonGeneration.filter((generation: { name: string; }) => {
        pokemonType.some((pokemon: { name: string; }) => pokemon.name === generation.name)
    })
} 