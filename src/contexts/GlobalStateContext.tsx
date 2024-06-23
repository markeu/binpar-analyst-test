import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { trpc } from '~/utils/trpc';

interface PokemonProps {
  url: string;
  name: string;
}

interface GlobalStateContextProps {
  pokemons: PokemonProps[];
  nextUrl?: string;
  prevUrl?: string;
  pageUrl?: string;
  setNextUrl: (url?: string) => void;
  setPrevUrl: (url?: string) => void;
  setPageUrl: (url?: string) => void;
  fetchDataByUrl: (url: string) => void;
}

const GlobalStateContext = createContext<GlobalStateContextProps | undefined>(undefined);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [pokemons, setPokemons] = useState<PokemonProps[]>([]);
  const [nextUrl, setNextUrl] = useState<string | undefined>();
  const [prevUrl, setPrevUrl] = useState<string | undefined>();
  const [pageUrl, setPageUrl] = useState<string | undefined>();

  const fetchDataByUrl = useCallback((url: string) => {
    setPageUrl(url);
  }, []);

  const queryResponse = trpc.pokemon.retrieveByUrl.useQuery({ url: pageUrl });

  useEffect(() => {
    if (queryResponse.data) {
      setPokemons(queryResponse.data.results || []);
      setNextUrl(queryResponse.data.next);
      setPrevUrl(queryResponse.data.previous);
    }
  }, [queryResponse]);

  useEffect(() => {
    if (pageUrl) {
      fetchDataByUrl(pageUrl);
    }
  }, [fetchDataByUrl, pageUrl]);

  return (
    <GlobalStateContext.Provider value={{ 
      pokemons, 
      nextUrl, 
      prevUrl, 
      pageUrl, 
      setNextUrl, 
      setPrevUrl, 
      setPageUrl, 
      fetchDataByUrl 
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};
