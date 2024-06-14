import { useEffect, useState } from 'react';
import Head from "next/head";
import { trpc } from '../utils/trpc';

export default function Page() {
  const { data: pokemonData, error, isLoading } = trpc.pokemon.getAllPokemon.useQuery();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(isLoading);
    if (error) {
      console.error('Failed to fetch Pokémon data:', error);
      setLoading(false); // Set loading to false on error
    }

  }, [isLoading, error]); // Depend on isLoading and error to update loading state

  if (isLoading || loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <Head>
        <title>Pokemon App Binpar</title>
      </Head>
      <div>
        {pokemonData.results.map((pokemon: any) => (
          <p key={pokemon.name}>{pokemon.name}</p> // Render pokemon.name instead of pokemon
        ))}
      </div>
    </>
  );
}
