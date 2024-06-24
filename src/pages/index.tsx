/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useCallback, useEffect, useState } from 'react';

import { trpc } from '../utils/trpc';
import { Pokeball } from '~/assets/patterns';
import Pagination from '~/components/Pagination/Pagination';
import { usePagination } from '~/contexts/PaginationContext';
import CardPokemon from '~/components/CardPokemon/CardPokemon';
import { InputSearch } from '~/components/InputSearch/InputSearch';
import { GlobalStateProvider } from '~/contexts/GlobalStateContext';
import Filter from '~/components/Filter';
import Spinner from '~/components/Spinner';

interface PokemonProps {
  url: string;
  name: string;
}

function PageComponent() {
  const { paginationState, setPaginationState } = usePagination();
  const queryResponse = trpc.pokemon.getAllPokemon.useQuery();
  const searchData = trpc.pokemon.getSearchPokemonData.useQuery();
  const { currentPageUrl } = paginationState;

  const { data: pokemonData, error, isLoading } = queryResponse;
  const { data: searchDataResult } = searchData;

  const [pokemons, setPokemons] = useState<PokemonProps[]>([]);
  const [pokemonSearch, setPokemonSearch] = useState('');

  const pageDataQuery = trpc.pokemon.retrieveByUrl.useQuery(
    { url: currentPageUrl || '' },
    { enabled: !!currentPageUrl }
  );

  useEffect(() => {
    if (pokemonData) {
      setPokemons(pokemonData.results || []);
      setPaginationState({
        nextPageUrl: pokemonData.next,
        prevPageUrl: pokemonData.previous,
      });
    }
  }, [pokemonData]);

  useEffect(() => {
    if (pageDataQuery.data) {
      setPokemons(pageDataQuery.data.results || []);
      setPaginationState({
        nextPageUrl: pageDataQuery.data.next,
        prevPageUrl: pageDataQuery.data.previous
      });
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
      setPaginationState({
        nextPageUrl: pokemonData.next,
        prevPageUrl: pokemonData.previous
      });
    }
  }, [pokemonData]);

  return (
    <Container>
      <div className='flex items-center mb-2'>
        <Pokeball />
        <h1 className="mr-9 ml-9 text-xl font-bold text-black">Pokemon</h1>
        {/* <Filter/> */}
        <div className="ml-auto">
          <InputSearch value={pokemonSearch} onChange={setPokemonSearch} />
        </div>
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <Pokemons>
          {pokemons.map(pokemon => (
            <CardPokemon key={pokemon.name} name={pokemon.name} />
          ))}
        </Pokemons>
      )}
      <Pagination/>
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


const page = () => (
  <GlobalStateProvider>
    <PageComponent/>
  </GlobalStateProvider>
)

export default page