import { shop, user, filter, list, tiles } from "../svg";
import { GetAnimals } from "../services/AnimalsService";
import AnimalFilterWindow from "../components/AnimalFilter";
import { useEffect, useState } from "react";
import FilterForm from "../components/AnimalFilterForm";
import AdoptHeader from "../components/AdoptHeader";
import RectangleList from "../components/RectangleList";

function MainPageController() {
	const [animals, setAnimals] = useState([]);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [filterCriteria, setFilterCriteria] = useState({ species: '', ageFrom: 0, ageTo: 0, neutered: '' });
	const [filterActive, setFilterActive] = useState(false);
	const [maxAge, setMaxAge] = useState(0);

	useEffect(() => {
		async function fetchAnimals() {
			const fetchedAnimals = await GetAnimals();
			setAnimals(fetchedAnimals);
			const calculatedMaxAge = fetchedAnimals.reduce((max, animal) => (animal.age > max ? animal.age : max), 0);
			setMaxAge(calculatedMaxAge);
			setFilterCriteria(prev => ({
				species: prev.species,
				ageFrom: prev.ageFrom,
				ageTo: calculatedMaxAge,
				neutered: prev.neutered
			}));
		}
		fetchAnimals();
	}, []);

	const filteredAnimals = animals.filter((animal) => {
		return (
			(filterCriteria.species.length === 0 || filterCriteria.species.includes(animal.species)) &&
			(animal.age >= filterCriteria.ageFrom && animal.age <= filterCriteria.ageTo) &&
			(filterCriteria.neutered === '' || animal.neutered === (filterCriteria.neutered === 'true'))
		);
	});

	const resetFilters = () => {
		setFilterCriteria({ species: '', ageFrom: 0, ageTo: maxAge, neutered: '' });
	};

	const speciesList = [...new Set(animals.map(animal => animal.species))];

	return (
		<div className="bg-Main_BG min-h-screen flex flex-col flex-grow">
			<header className="">
				<AdoptHeader/>
			</header>
			<div className="flex-grow justify-center m-2 items-center relative">
				<div className="absolute right-0 m-2 items-start justify-start flex space-x-4">
					{filterActive && (
						<button onClick={resetFilters} className="text-red-500 mr-10">
							Remove Filters
						</button>
					)}

					<button id="Tiles">
						{tiles()}
					</button>
					<button id="List">
						{list()}
					</button>
					<button id="Filter" onClick={() => setIsFilterOpen(true)}>
						{filter()}
					</button>

				</div>
				<div className="mt-12">
					<RectangleList animals={filteredAnimals} />
				</div>
			</div>
			<footer className="bg-pink-50 p-4">
				<div className="flex justify-center items-center">
					<p>Footer Content</p>
				</div>
			</footer>
			<AnimalFilterWindow isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
				<h2 className="text-2xl font-Pet_Title text-border-smaller">Filter</h2>
				<FilterForm filterCriteria={filterCriteria} setFilterCriteria={setFilterCriteria} speciesList={speciesList} maxAge={maxAge} />
			</AnimalFilterWindow>
		</div>
	);
}

export default MainPageController;
