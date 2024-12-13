import { GetAnimals, RemoveAnimal } from "../services/AnimalsService";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import MainPage from "../components/animals/MainPage";

function MainPageController() {
	const location = useLocation();
	const [animals, setAnimals] = useState([]);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [filterCriteria, setFilterCriteria] = useState({ species: '', ageFrom: 0, ageTo: 0, neutered: '', sex: '' });
	const [filterActive, setFilterActive] = useState(false);
	const [maxAge, setMaxAge] = useState(0);
	const [adminMode, setAdminMode] = useState(location.state?.adminMode || false);

	const handleAdminModeClick = () => {
		setAdminMode(prevAdminMode => !prevAdminMode);
	};

	const handleRemoveAnimal = async (id) => {
		const updatedAnimals = await RemoveAnimal(id);
		setAnimals(updatedAnimals);
	};

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
				neutered: prev.neutered,
				sex: prev.sex
			}));
		}
		fetchAnimals();
	}, []);

	useEffect(() => {
		const isFilterActive = filterCriteria.species.length > 0 || filterCriteria.ageFrom > 0 || filterCriteria.ageTo < maxAge || filterCriteria.neutered !== '' || filterCriteria.sex !== '';
		setFilterActive(isFilterActive);
	}, [filterCriteria, maxAge]);

	const filteredAnimals = animals.filter((animal) => {
		return (
			(filterCriteria.species.length === 0 || filterCriteria.species.includes(animal.species)) &&
			(animal.age >= filterCriteria.ageFrom && animal.age <= filterCriteria.ageTo) &&
			(filterCriteria.neutered === '' || animal.neutered === (filterCriteria.neutered === 'true')) &&
			(filterCriteria.sex === '' || animal.sex === filterCriteria.sex)
		);
	});

	const removeFilter = (filterName) => {
		setFilterCriteria((prevCriteria) => {
			const newCriteria = { ...prevCriteria };
			if (filterName === 'species') {
				newCriteria.species = '';
			} else if (filterName === 'age') {
				newCriteria.ageFrom = 0;
				newCriteria.ageTo = maxAge;
			} else if (filterName === 'neutered') {
				newCriteria.neutered = '';
			} else if (filterName === 'sex') {
				newCriteria.sex = '';
			}
			return newCriteria;
		});
	};

	const speciesList = [...new Set(animals.map(animal => animal.species))];

	return (
		MainPage(handleAdminModeClick, adminMode, handleRemoveAnimal, speciesList, maxAge, filteredAnimals, setIsFilterOpen, filterCriteria, setFilterCriteria, filterActive, isFilterOpen, removeFilter)
	);
}

export default MainPageController;
