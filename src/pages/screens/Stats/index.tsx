interface StatsChartProps {
    stats: {
        hp: number;
        attack: number;
        defense: number;
        specialAttack: number;
        specialDefense: number;
        speed: number;
    };
    color: string;
}

const Stats = ({ stats, color }: StatsChartProps) => {
    const statsContent: { title: string; field: keyof typeof stats }[] = [
        { title: 'HP', field: 'hp' },
        { title: 'Attack', field: 'attack' },
        { title: 'Defense', field: 'defense' },
        { title: 'Special Attack', field: 'specialAttack' },
        { title: 'Special Defense', field: 'specialDefense' },
        { title: 'Speed', field: 'speed' },
    ];

    return (
        <div className="flex flex-col items-stretch justify-evenly w-full max-w-screen-xl mx-auto h-full p-5 px-4">
            {statsContent.map(stat => (
                <div key={stat.field} className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <strong className="font-semibold text-20 leading-22 text-black w-24 text-center">
                            {stat.title}
                        </strong>
                        <span className="ml-4 text-lg text-gray-600 mr-1">
                            {stats[stat.field] || 0}
                        </span>
                    </div>
                    <div className="flex items-center w-full h-1 bg-gray-200 rounded-full">
                        <div
                            className="h-full rounded-full"
                            style={{
                                width: `${stats[stat.field] < 100 ? stats[stat.field] : 100}%`,
                                backgroundColor: color,
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Stats;
