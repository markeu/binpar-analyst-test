/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { ReactNode, SVGProps, useEffect, useState } from 'react';

import iconTypePokemon from '~/assets/types';
import { PokemonData } from '~/types/types';
import {  globalColors } from '~/utils/color.utils';
import { trpc } from '~/utils/trpc';

interface CardContainerProps {
    color: string;
    href: string;
    children: ReactNode
}

interface PokemonTypesProps {
    name: string;
    color: string;
    icon: ReactNode;
}

interface PokemonProps {
    id: number;
    image: string;
    type: PokemonTypesProps[];
    backgroundColor: string;
}

const CardPokemon = ({ name }: { name: string }) => {

    const { data: pokemonData, error, isLoading } = trpc.pokemon.getPokemonByName.useQuery({ name });

    const [pokemon, setPokemon] = useState({} as PokemonProps);

    useEffect(() => {
        if (!pokemonData) return
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
                const typeName = pokemonType.type
                    .name as keyof typeof iconTypePokemon; 
                return {
                    name: typeName,
                    icon: iconTypePokemon[typeName],
                    color: typeName,
                };
            })
        })
    }, [name, pokemonData])

    return (
        <div className={`relative flex flex-col mt-10 text-gray-700 shadow-md bg-clip-border rounded-xl w-96 `} style={{ backgroundColor: globalColors.backgroundType[pokemon.backgroundColor] }}>
            <div className="absolute right-0 top-neg-50 z-20 h-56 w-56">
                <img className="object-cover rounded-xl filter grayscale transition-all ease duration-400 hover:grayscale-0" src={pokemon.image} alt={`Imagem do pokémon ${name}`} />
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
                            <div className={`flex flex-row items-center p-1.5 bg-${pokemonType.color} rounded-sm`} key={pokemonType.name}>
                                {pokemonType.icon} <span className='ml-0.5 text-sm font-sm leading-3.5 capitalize'> {pokemonType.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}






const Container = ({ color, href, children }: CardContainerProps) => {
    return (
        <Link href={href} >
            <div className="absolute right-0 top-[-50px] z-10 h-[210px] w-[210px] grayscale transition-all duration-400 ease-in-out hover:grayscale-0 hover:top-[-45px]">
                {children}
            </div>
        </Link>
    );
};

const Pokemon = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex-1 flex flex-col items-stretch justify-center relative pl-7">
            <svg className="absolute right-1.25 top-0 h-[180px] w-[180px]">
                <path fill="rgba(255, 255, 255, 0.2)" />
            </svg>
            <div className="flex flex-row items-center mt-1.25">
                {children}
            </div>
        </div>
    );
};

const PokemonNumber = ({ children }: { children: ReactNode }) => {
    return (
        <span className="text-2xl font-bold tracking-widest" >
            {children}
        </span>
    );
};

const PokemonType = ({ children, color }: { children: ReactNode, color: string }) => {
    return (
        <div className={`flex flex-row items-center p-2 rounded-md bg-${color} text-white font-medium text-base capitalize`}>
            {children}
        </div>
    );
};




export default CardPokemon;