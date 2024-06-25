import { useState } from "react";
import {  fetchJson, getNames } from "~/utils/pokemon.utils";
import { trpc } from "~/utils/trpc";

const Filter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const PokemonGenerations = trpc.pokemon.getAllGenerations.useQuery();
    const pokemonTypes = trpc.pokemon.getAllTypes.useQuery();

  
    const pokemonTypesAndGeneration = getNames(pokemonTypes.data, PokemonGenerations.data);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const closeDropdown = () => {
        setIsOpen(false);
    };

    const handleItemClick = async (event, item) => {
        event.preventDefault();

        closeDropdown();
    
     
    };
    return (
        <div className="relative inline-block">
            <button
                type="button"
                className="px-4 py-2 text-white bg-gray-800 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm inline-flex items-center"
                onClick={toggleDropdown}
            >
                Filter by type or generation{" "}
                <svg
                    className="w-2.5 h-2.5 ml-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <ul
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                    >
                        {pokemonTypesAndGeneration.map((item, index) => (
                            <li key={index}>
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={(event) => handleItemClick(event, item)}
                                >
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Filter;
