/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { trpc } from '../utils/trpc';

import { InputSearch } from '~/components/InputSearch/InputSearch';
import { Pokeball } from '~/assets/patterns';
import CardPokemon from '~/components/CardPokemon/CardPokemon';
import Pagination from '~/components/Pagination/Pagination';

interface PokemonProps {
  url: string;
  name: string;
}

export default function Page() {
  const queryResponse = trpc.pokemon.getAllPokemon.useQuery();
  const searchData = trpc.pokemon.getSearchPokemonData.useQuery();

  const { data: pokemonData, error, isLoading } = queryResponse;
  const { data: searchDataResult } = searchData;

  const [pokemons, setPokemons] = useState<PokemonProps[]>([]);
  const [pokemonSearch, setPokemonSearch] = useState('');
  const [nextUrl, setNextUrl] = useState<string | undefined>();
  const [prevUrl, setPrevUrl] = useState<string | undefined>();
  const [pageUrl, setPageUrl] = useState<string | undefined>();

  const pageDataQuery = trpc.pokemon.retrieveByUrl.useQuery(
    { url: pageUrl || '' },
    { enabled: !!pageUrl }
  );

  useEffect(() => {
    if (pokemonData) {
      setPokemons(pokemonData.results || []);
      setNextUrl(pokemonData.next);
      setPrevUrl(pokemonData.previous);
    }
  }, [pokemonData]);

  useEffect(() => {
    if (pageDataQuery.data) {
      setPokemons(pageDataQuery.data.results || []);
      setNextUrl(pageDataQuery.data.next);
      setPrevUrl(pageDataQuery.data.previous);
    }
  }, [pageDataQuery.data]);

  const handleSearchPokemons = useCallback(() => {
    if (searchDataResult) {
      const pokemonsSearch = searchDataResult.results.filter(
        ({ name }: PokemonProps) => name.toLowerCase().includes(pokemonSearch.toLowerCase())
      );
      setPokemons(pokemonsSearch);
    }
  }, [pokemonSearch, searchDataResult]);

  useEffect(() => {
    if (pokemonSearch.length >= 2) {
      handleSearchPokemons();
    } else {
      handlePokemonsListDefault();
    }
  }, [pokemonSearch, handleSearchPokemons]);

  const handlePokemonsListDefault = useCallback(() => {
    if (pokemonData) {
      setPokemons(pokemonData.results || []);
      setNextUrl(pokemonData.next);
      setPrevUrl(pokemonData.previous);
    }
  }, [pokemonData]);

  const handlePageChange = useCallback((url?: string) => {
    setPageUrl(url);
  }, []);

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
        {pokemons.map(pokemon => (
          <CardPokemon key={pokemon.name} name={pokemon.name} />
        ))}
      </Pokemons>
      <Pagination
        nextUrl={nextUrl}
        prevUrl={prevUrl}
        onPageChange={handlePageChange}
      />
    </Container>
  );
}

const Container = ({ children }: { children: ReactNode }) => (
  <div className="relative flex flex-col items-stretch md:p-20">
    {children}
  </div>
);

const Pokemons = ({ children }: { children: ReactNode }) => (
  <div className="flex-1 grid grid-cols-3 gap-20 mb-12">
    {children}
  </div>
);
