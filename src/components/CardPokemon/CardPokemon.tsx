import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { trpc } from '~/utils/trpc';
import iconTypePokemon from '~/assets/types';
import { pokemonColors } from '~/utils/color.utils';
import { PokemonData, PokemonProps } from '~/types/types';
import Spinner from '../Spinner';


const CardPokemon = ({ name }: { name: string }) => {
    const { data: pokemonData, error, isLoading } = trpc.pokemon.getPokemonByName.useQuery({ name });
    const [pokemon, setPokemon] = useState({} as PokemonProps);
    const backgroundColor = pokemonColors[pokemon.backgroundColor] as string;

    useEffect(() => {
        if (!pokemonData) return;
        const { id, types, sprites } = pokemonData as PokemonData;
        let backgroundColor = types[0].type.name;

        if (backgroundColor === 'normal' && types.length > 1) {
            backgroundColor = types[1].type.name;
        }

        setPokemon({
            id,
            backgroundColor,
            image: sprites.other['official-artwork'].front_default,
            type: types.map((pokemonType) => {
                const typeName = pokemonType.type.name as keyof typeof iconTypePokemon;
                return {
                    name: typeName,
                    icon: iconTypePokemon[typeName],
                    color: typeName,
                };
            }),
        });
    }, [name, pokemonData]);


    if (isLoading) return <Spinner />;
    if (error) return <div>Error loading Pokémon data</div>;

    return (
        <Link href={{
            pathname: `/pokemon/${name}`,
            query: {
                data: encodeURIComponent(JSON.stringify(pokemonData)),
                backgroundColor: encodeURIComponent(backgroundColor),
            },
        }} passHref
        >
            <div className={`relative flex flex-col mt-10 text-gray-700 shadow-md bg-clip-border rounded-xl w-96 `} style={{ backgroundColor }}>
                <div className="absolute right-0 top-neg-50 z-20 h-56 w-56">
                    <Image
                        src={pokemon.image}
                        alt={`Imagem do pokémon ${name}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl filter grayscale transition-all ease duration-400 hover:grayscale-0"
                        priority
                    />
                </div>
                <div className="p-7">
                    <h4 className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                        #{pokemon.id} - {pokemonData?.name}
                    </h4>
                </div>
                <div className="p-6 pt-0">
                    {pokemon.type && (
                        <div className="flex flex-row items-center mt-5">
                            {pokemon.type.map(pokemonType => (
                                <TypeBadge key={pokemonType.name} type={pokemonType}/>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default CardPokemon;


const TypeBadge = ({ type }: { type: any }) => (
    <div className={`flex flex-row items-center p-1.5 bg-${type.color} rounded-sm`} >
        {type.icon} <span className='ml-0.5 text-sm font-sm leading-3.5 capitalize'>{type.name}</span>
    </div>
);
