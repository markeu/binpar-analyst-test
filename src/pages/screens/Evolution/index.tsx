/* eslint-disable react-hooks/exhaustive-deps */
import Link from "next/link";
import Image from 'next/image';
import { ReactNode, useEffect, useState } from "react";
import { FaLongArrowAltRight } from 'react-icons/fa';

import { trpc } from "~/utils/trpc";
import { Pokeball } from "~/assets/patterns";
import Spinner from '~/components/Spinner';
import router from "next/router";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface PokemonEvolvesProps {
    name: string;
    level: number;
    image?: string;
    number?: string;
}
const Evolution = ({ name }: { name: string | string[] | undefined, color: string }) => {

    const [evolvesPokemon, setEvolvesPokemon] = useState<PokemonEvolvesProps[]>([]);
    const pokemoneEvolutions = trpc.pokemon.getPokemonEvolutions.useQuery({ name });

    useEffect(() => {
        if (pokemoneEvolutions.data) {
            setEvolvesPokemon(pokemoneEvolutions.data)
        }
    }, [pokemoneEvolutions.data])

    useEffect(() => {
        if (pokemoneEvolutions.error) {
            router.push('/404');
        }
    }, [pokemoneEvolutions.error, router]);

    if (pokemoneEvolutions.isLoading) {
        return <Spinner />;
    }
    

    return (
        <div className="flex flex-row items-center justify-evenly w-full h-full py-20 px-0">
            {evolvesPokemon.length ? (
                evolvesPokemon.slice(0, 6).map((evolves, index) => (
                    <>
                        {index !== 0 && (
                            <EvolutionPokemon>
                                <FaLongArrowAltRight size={80} color="rgba(0, 0, 0, 0.06)" />
                                <p className="font-semibold text-gray-700 text-lg leading-22">(Level {evolves.level || 'null'})</p>
                            </EvolutionPokemon>
                        )}
                        <EvolutionPokemon>
                            <EvolutionPokemonImage href={`/pokemon/${encodeURIComponent(evolves.name)}`}>
                                <Pokeball />
                                <Image
                                    className="mx-auto w-140 h-140 z-20 transition-transform duration-400 ease-in-out"
                                    src={evolves.image as string | StaticImport}
                                    alt="Pokemon"
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </EvolutionPokemonImage>
                            <p className="font-semibold text-gray-700 text-lg leading-22">{evolves.number}</p>
                            <h4 className="capitalize text-3xl leading-26 text-black">{evolves.name}</h4>
                        </EvolutionPokemon>
                    </>
                ))
            )
                : (
                    <h1 className="text-center">Carregando...</h1>
                )}
        </div>
    )
}



const EvolutionPokemon = ({ children }: { children: ReactNode }) => (
    <div className="flex flex-col items-center">
        {children}
    </div>
);


const EvolutionPokemonImage = ({ href, children }: { href: string, children: ReactNode }) => (
    <Link className="relative flex items-center justify-center w-180 h-180 mb-10" href={href}>
        <svg
            className="absolute top-0 right-0 w-auto h-full transition-transform duration-800 ease-in-out"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
        >
            <path
                className="fill-current text-gray-100"
                d="M6 9l6 6 6-6"
            />
        </svg>
        {children}
    </Link>
);

export default Evolution;