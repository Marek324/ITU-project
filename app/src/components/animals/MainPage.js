import AdoptHeader from "./AdoptHeader";
import { filter, list, tiles } from "../../svg";
import RectangleList from "./RectangleList";
import { Link } from "react-router-dom";
import AnimalFilterWindow from "./AnimalFilter";
import FilterForm from "./AnimalFilterForm";

function MainPage(handleAdminModeClick, adminMode, handleRemoveAnimal, speciesList, maxAge, filteredAnimals, setIsFilterOpen, filterCriteria, setFilterCriteria, filterActive, isFilterOpen, removeFilter) {
	return (
		<div className="bg-Main_BG min-h-screen flex flex-col flex-grow">
			<header className="">
				<AdoptHeader isHome={true} onAdminModeClick={handleAdminModeClick} adminMode={adminMode} />
			</header>
			<div className="flex-grow justify-center m-2 items-center relative">
				{!adminMode && (
					<div className="absolute right-0 m-2 items-start justify-start flex space-x-4">
						{filterCriteria.species && (
							<div className="bg-gray-200 border border-gray-300 rounded-lg px-3 py-1 m-1 flex items-center">
								Species: {filterCriteria.species.join(', ')}
								<button onClick={() => removeFilter('species')} className="text-red-500 ml-2">x</button>
							</div>
						)}
						{(filterCriteria.ageFrom > 0 || filterCriteria.ageTo < maxAge) && (
							<div className="bg-gray-200 border border-gray-300 rounded-lg px-3 py-1 m-1 flex items-center">
								Age: {filterCriteria.ageFrom} - {filterCriteria.ageTo}
								<button onClick={() => removeFilter('age')} className="text-red-500 ml-2">x</button>
							</div>
						)}
						{filterCriteria.neutered !== '' && (
							<div className="bg-gray-200 border border-gray-300 rounded-lg px-3 py-1 m-1 flex items-center">
								Neutered: {filterCriteria.neutered}
								<button onClick={() => removeFilter('neutered')} className="text-red-500 ml-2">x</button>
							</div>
						)}
						{filterCriteria.sex !== '' && (
							<div className="bg-gray-200 border border-gray-300 rounded-lg px-3 py-1 m-1 flex items-center">
								Sex: {filterCriteria.sex}
								<button onClick={() => removeFilter('sex')} className="text-red-500 ml-2">x</button>
							</div>
						)}
						<button id="Tiles" className="m-1">
							{tiles()}
						</button>
						<button id="List" className="m-1">
							{list()}
						</button>
						<button id="Filter" onClick={() => setIsFilterOpen(true)} className="m-1">
							{filter()}
						</button>
					</div>
				)}
				<div className="mt-12">
					<RectangleList animals={filteredAnimals} adminMode={adminMode} handleRemoveAnimal={handleRemoveAnimal} />
				</div>
				{adminMode && (
					<div className="flex justify-center w-full mt-4">
						<Link to={`/animal/newAnimal`} className="bg-pink-500 text-white p-2 rounded">
							Add Animal
						</Link>
					</div>
				)}
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

export default MainPage;
