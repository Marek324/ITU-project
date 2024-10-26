import { shop, user, filter, list, tiles } from "./svg";
import GetAnimals from "./BE/AnimalsAPI";
import AnimalFilterWindow from "./components/AnimalFilter";
import {useEffect, useState} from "react";
import FilterForm from "./components/AnimalFilterForm";
import {Link} from "react-router-dom";
function MainPageUser() {
	let animals = GetAnimals();
	const maxAge = animals.reduce((max, animal) => (animal.age > max ? animal.age : max), animals[0].age);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [filterCriteria, setFilterCriteria] = useState({ species: '', ageFrom: 0, ageTo: maxAge, neutered: ''});
	const [filterActive, setFilterActive] = useState(false);

	const filteredAnimals = animals.filter((animal) => {
		return (
			(filterCriteria.species.length === 0 || filterCriteria.species.includes(animal.species)) &&
			(animal.age >= filterCriteria.ageFrom && animal.age <= filterCriteria.ageTo) &&
			(filterCriteria.neutered === '' || animal.neutered === (filterCriteria.neutered === 'true'))
		);
	});

	useEffect(() => {
		const filtersApplied = filterCriteria.species.length > 0 ||
			filterCriteria.ageFrom > 0 ||
			filterCriteria.ageTo < maxAge ||
			filterCriteria.neutered !== '';
		setFilterActive(filtersApplied);
	}, [filterCriteria, maxAge]);

	const resetFilters = () => {
		setFilterCriteria({ species: '', ageFrom: 0, ageTo: maxAge, neutered: '' });
	};

	const speciesList = [...new Set(animals.map(animal => animal.species))];

	return (
		<div className="bg-Main_BG min-h-screen flex flex-col flex-grow">
			<header className="">
				<Rectangle />
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
					<RectangleList animals={filteredAnimals}/>
				</div>
			</div>
			<footer className="bg-pink-50 p-4">
				<div className="flex justify-center items-center">
					<p>Footer Content</p>
				</div>
			</footer>
			<AnimalFilterWindow isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
				<h2 className="text-2xl font-Pet_Title text-border-smaller">Filter</h2>
				<FilterForm filterCriteria={filterCriteria} setFilterCriteria={setFilterCriteria} speciesList={speciesList} maxAge={maxAge}/>
			</AnimalFilterWindow>
		</div>
	);
}

function Rectangle() {
	return (
		<div
			className="w-full h-48 bg-Main_Header flex items-center justify-center border-2 border-Main_Header_Border relative">
			<h1 className="text-3xl font-Pet_Title text-border absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-Main_Header">Adopt & Play</h1>
			<button className="absolute right-24 top-1/2 transform -translate-y-1/2">
				{shop()}
			</button>
			<button className="absolute right-4 top-1/2 transform -translate-y-1/2">
				{user()}
			</button>
		</div>
	);
}

function RectangleItem({ animal }) {
	return (
		<div
			className="w-11/12 h-auto bg-Animal_Card_BG flex items-start m-3 justify-start relative p-4 min-h-custom-img">
			<img src={animal.image} alt={animal.name} className="w-custom-img h-custom-img object-cover"/>
			<div className="ml-4 flex flex-col">
				<span className="text-3xl font-Pet_Title text-border">{animal.name}</span>
				<span>{animal.text} </span>
				<Link to={`/animal/${animal.id}`} className="text-blue-500 mt-2">View Details</Link>
			</div>
		</div>
	);
}

function RectangleList({animals}) {
	return (
		<div className="flex flex-col items-center justify-center m-2">
			{animals.map((animal, index) => (
				<RectangleItem key={index} animal={animal} />
			))}
		</div>
	);
}

export default MainPageUser;
