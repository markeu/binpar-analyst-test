import type { ReactNode } from "react";

//region POKEMON
export interface Pokemon {
  pokemon: { name: string };
  selected?: boolean;
}

export interface PokemonData {
    pokemon_species: { name: string }[];
    pokemon: { pokemon: { name: string } }[];
  }

export interface PokemonListProps {
  pokemonData: {
    isLoading: boolean;
    isSuccess: boolean;
    data:
      | {
          pokemon_species: { name: string }[];
          next: string | null;
          previous: string | null;
          results: {
            name: string;
          }[];
        }
      | undefined;
  };
}

export interface pokemonDetailsPage {
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  abilities: { ability: { name: string } }[];
  sprites: { front_default: string };
  types: { type: { name: string } }[];
  stats: { stat: { name: string }; base_stat: number }[];
}

export interface pokemonDetailsPropsPage {
  pokemonData: pokemonDetailsPage;
}

export interface PokemonResponse {
  isLoading: boolean;
  isSuccess: boolean;
  data:
    | {
        next: string | null;
        previous: string | null;
        results: {
          name: string;
        }[];
      }
    | undefined;
}

export interface pokemonDetailsProps {
  pokemonDetails: {
    data: {
      name: string;
      sprites: {
        front_default: string;
      };
      types: {
        type: {
          name: string;
        };
      }[];
    };
  };
  selected?: boolean;
}

//region BUTTON
export interface ButtonContainerProps {
  name: string;
  url: string | null | undefined;
}

export interface ButtonProps {
  children: ReactNode;
  handleClick: () => void;
  disabled: boolean;
}

//region HEADER

export interface PaginationProps {
  pokemonData: PokemonResponse;
}

export interface SelectContainerProps {
  data: {
    results: {
      name: string;
      url: string;
    }[];
  };
  filterType: string;
}

export interface GenerationResults {
  results: {
    name: string;
    url: string;
  }[];
}

export interface GenerationResultResponse {
  pokemon_species: GenerationResults;
}

export interface SelectProps {
  data: {
    name: string;
    url: string;
  };
  selected: boolean;
}

export interface SearchBarProps {
  handleSearch: (value: string) => void;
}

//region API

export interface SpeciesDataTypes {
  evolution_chain: {
    url: string;
  };
}

export interface EvolutionChainDataTypes {
  chain: ChainType;
}

export interface ChainType {
  evolves_to: EvolutionChainDataTypes[];
  species: {
    name: string;
  };
}

export interface TypeDataTypes {
  pokemon: PokemonDataTypes[];
}

export interface PokemonDataTypes {
  pokemon: {
    name: string;
  };
}

//region KPI

export interface KPIContainerProps {
  value: string;
  children: React.ReactNode;
}

export interface MapValuesKPI {
  height: string;
  weight: string;
  "base experience": string;
}

export interface KPIProps {
  value: string;
  unit: string;
  children: React.ReactNode;
}