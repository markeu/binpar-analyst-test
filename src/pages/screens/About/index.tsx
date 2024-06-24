/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import { trpc } from "~/utils/trpc";
import iconTypePokemon from '~/assets/types';
import { pokemonColors } from "~/utils/color.utils";
import {
    AboutProps,
    ListItemProps,
    PokemonTypesProps,
    SpecieProps,
    WeaknesseProps
} from "~/types/types";
import Spinner from '~/components/Spinner';
import router from "next/router";

export const About = ({ pokemon, colorText }: AboutProps) => {
    const [weaknesses, setWeaknesses] = useState<PokemonTypesProps[]>([]);
    const [pokemonSpecie, setPokemonSpecie] = useState<SpecieProps>({} as SpecieProps);

    const pokemonDataType = trpc.pokemon.getPokemonType.useQuery({ name: pokemon.type[0]?.name });
    const pokemonSpecies = trpc.pokemon.getPokemonSpecies.useQuery({ name: pokemon.specie });

    useEffect(() => {
        if (pokemonDataType.data) {
            const {
                damage_relations: { double_damage_from },
            } = pokemonDataType.data;

            const auxWeaknesses = double_damage_from.map(
                (typeDamage: { name: keyof typeof iconTypePokemon }) => ({
                    icon: iconTypePokemon[typeDamage.name],
                    color: typeDamage.name,
                    name: typeDamage.name,
                }),
            );
            setWeaknesses(auxWeaknesses);
        }
    }, [pokemonDataType.data]);

    useEffect(() => {
        if (pokemonSpecies.data) {
            const { capture_rate, base_happiness, growth_rate } = pokemonSpecies.data;
            setPokemonSpecie({
                capture_rate,
                base_happiness,
                growth_rate: growth_rate.name.replace('-', ' '),
            });
        }
    }, [pokemonSpecies.data]);
    
    useEffect(() => {
        if (pokemonDataType.error || pokemonSpecies.error) {
            router.push('/404');
        }
    }, [pokemonDataType.error, pokemonSpecies.error, router]);

    if (pokemonDataType.isLoading || pokemonSpecies.isLoading) {
        return <Spinner />;
    }

    return (
        <section className="flex flex-col items-stretch">
            <section className="flex flex-1 justify-evenly items-stretch ">
                <div className="flex flex-col items-stretch">
                    <h3 className={`text-2xl font-semibold mb-3 w-180 `} style={{ color: colorText }}>Pokémon Data</h3>
                    <ul className="flex flex-col items-stretch list-none">
                        <ListItem label="Height" value={pokemon.height} />
                        <ListItem label="Weight" value={pokemon.weight} />
                        <li className="flex items-center justify-start mt-2">
                            <strong className="font-semibold text-[22px] leading-[24px] text-black w-[180px]">
                                Weaknesses
                            </strong>
                            {weaknesses &&
                                weaknesses.map(weakness => (
                                    <Weaknesse key={weakness.name} color={weakness.color} icon={weakness.icon} />
                                ))}
                        </li>
                        <ListItem label="Capture Rate" value={pokemonSpecie.capture_rate} />
                        <ListItem label="Base Happiness" value={pokemonSpecie.base_happiness} />
                        <ListItem label="Growth Rate" value={pokemonSpecie.growth_rate} />
                    </ul>
                </div>
                <div className="flex flex-col items-stretch">
                    <h3 className={`text-2xl font-semibold mb-3 w-180 `} style={{ color: colorText }}>Training</h3>
                    <ul className="flex flex-col items-stretch list-none">
                        <ListItem label="Catch Rate" value={pokemonSpecie.capture_rate} />
                        <ListItem label="Base Friendship" value={pokemonSpecie.base_happiness} />
                        <ListItem label="Growth Rate" value={pokemonSpecie.growth_rate} />
                    </ul>
                </div>
            </section>
        </section>
    );
};


const ListItem = ({ label, value }: ListItemProps) => (
    <li className="flex items-center justify-start mt-2">
        <strong className="font-semibold text-[22px] leading-[24px] text-black w-[180px]">
            {label}
        </strong>
        <span className="text-[24px] leading-[21px] text-gray-600">
            {value}
        </span>
    </li>
);

const Weaknesse = ({ color, icon, key }: WeaknesseProps) => (
    <div key={key} className={`flex items-center justify-center rounded-6 w-34 h-34 mr-6`} style={{ backgroundColor: pokemonColors[color] }}>
        <div className="w-18 h-18">{icon} </div>
    </div>
);
