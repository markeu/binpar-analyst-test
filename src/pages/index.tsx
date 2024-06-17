/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { trpc } from '../utils/trpc';

import { InputSearch } from '~/components/InputSearch/InputSearch';
import { Pokeball } from '~/assets/patterns';
import CardPokemon from '~/components/CardPokemon/CardPokemon';

interface PokemonProps {
  url: string;
  name: string;
}

export default function Page() {
  //move to a hook
  const { data: pokemonData, error, isLoading } = trpc.pokemon.getAllPokemon.useQuery();
  const [pokemons, setPokemons] = useState<PokemonProps[]>([]);
  const [pokemonSearch, setPokemonSearch] = useState('');

  const handleSearchPokemons = useCallback(async () => {
    //create an endpoint to get it all,
    //substitiute the state to this when clicked
    setPokemonSearch(pokemonSearch.toLocaleLowerCase());
    const pokemonsSearch = pokemonData?.results.filter(
      ({ name }: PokemonProps) => name.includes(pokemonSearch),
    );

    setPokemons(pokemonsSearch || []);
  }, [pokemonSearch, pokemonData]);

  const handlePokemonsListDefault = useCallback(async () => {
    setPokemons(pokemonData?.results || []);
  }, [pokemonSearch]);

  useEffect(() => {
    const isSearch = pokemonSearch.length >= 2;
    isSearch ? handleSearchPokemons() : handlePokemonsListDefault()
  }, [pokemonSearch, handlePokemonsListDefault, handleSearchPokemons]);

  return (
    <Container>
      <div className='flex items-center mb-2'>
        <Pokeball />
        <h1 className="mr-9 ml-9 text-xl font-bold text-black">Pokemon Binpar</h1>
        <div className="ml-auto">
          <InputSearch value={pokemonSearch} onChange={setPokemonSearch} />
        </div>
      </div>
      <Pokemons>
        {pokemons && pokemons.map(pokemon => (
          <CardPokemon key={pokemon.name} name={pokemon.name} />
        ))}
      </Pokemons>
    </Container>

  );
}


const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex flex-col items-stretch md:p-20">
      {children}
    </div>
  );
};

const Pokemons = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex-1 grid grid-cols-3 gap-20">
      {children}
    </div>
  );
};
