/* eslint-disable react-hooks/exhaustive-deps */
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FaChevronLeft } from 'react-icons/fa';
import { useEffect, useMemo, useState } from 'react';

import { About } from '../screens/About';
import iconTypePokemon from '~/assets/types';
import { pokemonColors } from '~/utils/color.utils';
import { PokemonData, PokemonDetailProps } from '~/types/types';
import Stats from '../screens/Stats';

const PokemonDetail = () => {
    const router = useRouter();
    const { name, data, backgroundColor } = router.query;
    const [pokemon, setPokemon] = useState<PokemonDetailProps | null>(null);
    const [nameSectionActive, setNameSectionActive] = useState('about');
    const pokemonBackgroundColor = decodeURIComponent(backgroundColor as string);

    useEffect(() => {
        if (data) {
            const {
                id,
                weight,
                height,
                stats,
                sprites,
                types,
                species,
            } = JSON.parse(decodeURIComponent(data as string)) as PokemonData;

            if (!types || types.length === 0) {
                console.error('Invalid types data:', types);
                return;
            }
            let bgColor = types[0].type.name;

            if (bgColor === 'normal' && types.length > 1) {
                bgColor = types[1].type.name;
            }

            setPokemon({
                id,
                number: `#${id.toString().padStart(3, '0')}`,
                image: sprites.other['official-artwork'].front_default || sprites.front_default,
                weight: `${weight / 10} kg`,
                specie: species.name,
                height: `${height / 10} m`,
                stats: {
                    hp: stats[0].base_stat,
                    attack: stats[1].base_stat,
                    defense: stats[2].base_stat,
                    specialAttack: stats[3].base_stat,
                    specialDefense: stats[4].base_stat,
                    speed: stats[5].base_stat,
                },
                type: types.map((pokemonType) => {
                    const typeName = pokemonType.type.name as keyof typeof iconTypePokemon;
                    return {
                        name: typeName,
                        icon: iconTypePokemon[typeName],
                        color: typeName,
                    };
                }),
            });
        }
    }, [data]);

    const screenSelected = useMemo(() => {
        if (!pokemon) return null;
    
        switch (nameSectionActive) {
            case 'about':
                return <About pokemon={pokemon} colorText={pokemonBackgroundColor} />;
            case 'stats':
                return pokemon.stats && <Stats stats={pokemon.stats} color={pokemonBackgroundColor} />;
            default:
                return null;
        }
    }, [nameSectionActive, pokemonBackgroundColor, pokemon]);

    const handleSectionChange = (section: string) => {
        if (section !== nameSectionActive) {
            setNameSectionActive(section);
        }
    };

    return (
        <div className={`relative flex h-screen w-full`} style={{ backgroundColor: pokemonColors[pokemonBackgroundColor] }}>
            <Link href="/" className="fixed top-10 left-4 z-10 flex items-center text-white hover:cursor-pointer">
                <FaChevronLeft size={40} />
            </Link>

            <div className="absolute left-2 right-0 top-0">
                <h1 className="font-bold text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-center uppercase"
                    style={{
                        background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.09) 60%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        WebkitTextStroke: '2px rgba(255, 255, 255, 0.6)',
                    }}>
                    {name}
                </h1>
            </div>

            <div className="flex-1 flex flex-col items-stretch mt-10">
                <div className="relative flex flex-row items-center self-center md:mt-14 mt-12 w-[350px] h-[350px]">
                    {pokemon && (
                        <Image
                            src={pokemon.image}
                            alt={`Imagem do pokémon ${name}`}
                            layout="fill"
                            objectFit="cover"
                        />
                    )}
                </div>

                <div className="flex items-center justify-around mb-[10px]">
                    {['about', 'stats', 'evolution'].map(nameSection => (
                        <SectionsNameButton
                            key={nameSection}
                            type="button"
                            onClick={() => handleSectionChange(nameSection)}
                            active={nameSection === nameSectionActive}
                        >
                            {nameSection}
                        </SectionsNameButton>
                    ))}
                </div>

                <div className="flex flex-col justify-center bg-white h-[320px] px-40 rounded-[45px] rounded-tl-[45px] rounded-tr-[45px]">
                    {screenSelected}
                </div>
            </div>
        </div>
    );
};

const SectionsNameButton = ({ active, children, onClick }: any) => {
    return (
        <button
            className={`relative border-0 outline-0 w-[170px] bg-none text-[35px] leading-[38px] text-white ${active ? 'opacity-100' : 'opacity-40'} capitalize`}
            onClick={onClick}
        >
            {children}
            <svg className="absolute top-[-34px] left-0 right-0 mx-auto z-0 w-[170px] h-auto">
                <path fill="rgba(255, 255, 255, 0.08)" />
            </svg>
        </button>
    );
};

export default PokemonDetail;
