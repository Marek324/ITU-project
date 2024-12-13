import React, { useState, useEffect, useRef } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function FilterForm({ filterCriteria, setFilterCriteria, speciesList, maxAge }) {
	const [isSpeciesCollapsed, setIsSpeciesCollapsed] = useState(true);
	const [isAgeCollapsed, setIsAgeCollapsed] = useState(true);
	const [isNeuteredCollapsed, setIsNeuteredCollapsed] = useState(true);
	const [isSexCollapsed, setIsSexCollapsed] = useState(true);
	const neuteredRef = useRef(null);

	const handleAgeChange = (value) => {
		setFilterCriteria((prevCriteria) => ({
			...prevCriteria,
			ageFrom: value[0],
			ageTo: value[1],
		}));
	};

	const handleSpeciesChange = (e) => {
		const { value, checked } = e.target;
		setFilterCriteria((prevCriteria) => {
			const newSpecies = checked
				? [...prevCriteria.species, value]
				: prevCriteria.species.filter((species) => species !== value);
			return { ...prevCriteria, species: newSpecies };
		});
	};

	const handleNeuteredChange = () => {
		setFilterCriteria((prevCriteria) => {
			let newNeutered;
			if (prevCriteria.neutered === '') {
				newNeutered = 'true';
			} else if (prevCriteria.neutered === 'true') {
				newNeutered = 'false';
			} else {
				newNeutered = '';
			}
			return { ...prevCriteria, neutered: newNeutered };
		});
	};

	const handleSexChange = (e) => {
		setFilterCriteria((prevCriteria) => ({
			...prevCriteria,
			sex: e.target.value,
		}));
	};

	useEffect(() => {
		if (neuteredRef.current) {
			if (filterCriteria.neutered === '') {
				neuteredRef.current.indeterminate = true;
				neuteredRef.current.checked = false;
			} else {
				neuteredRef.current.indeterminate = false;
				neuteredRef.current.checked = filterCriteria.neutered === 'true';
			}
		}
	}, [filterCriteria.neutered]);

	return (
		<form className="flex flex-col space-y-4">
			<div className="border-b pb-4">
				<label className="flex justify-between items-center text-black">
					Species:
					<button
						type="button"
						onClick={() => setIsSpeciesCollapsed(!isSpeciesCollapsed)}
						className="ml-2 text-black"
					>
						{isSpeciesCollapsed ? '▼' : '▲'}
					</button>
				</label>
				{!isSpeciesCollapsed && (
					<div className="flex flex-col space-y-2 mt-2">
						{speciesList.map((species, index) => (
							<label key={index} className="flex items-center space-x-2 text-black">
								<input
									type="checkbox"
									value={species}
									checked={filterCriteria.species.includes(species)}
									onChange={handleSpeciesChange}
									className="custom-checkbox"
								/>
								<span>{species}</span>
							</label>
						))}
					</div>
				)}
			</div>

			<div className="border-b pb-4">
				<label className="flex justify-between items-center text-black">
					Age Range: {filterCriteria.ageFrom} - {filterCriteria.ageTo}
					<button
						type="button"
						onClick={() => setIsAgeCollapsed(!isAgeCollapsed)}
						className="ml-2 text-black"
					>
						{isAgeCollapsed ? '▼' : '▲'}
					</button>
				</label>
				{!isAgeCollapsed && (
					<Slider
						range
						min={0}
						max={maxAge}
						value={[filterCriteria.ageFrom, filterCriteria.ageTo]}
						onChange={handleAgeChange}
						className="My-rc-slider mt-2"
					/>
				)}
			</div>

			<div className="border-b pb-4">
				<label className="flex justify-between items-center text-black">
					Neutered:
					<button
						type="button"
						onClick={() => setIsNeuteredCollapsed(!isNeuteredCollapsed)}
						className="ml-2 text-black"
					>
						{isNeuteredCollapsed ? '▼' : '▲'}
					</button>
				</label>
				{!isNeuteredCollapsed && (
					<label className="flex items-center space-x-2 mt-2 text-black">
						<input
							type="checkbox"
							ref={neuteredRef}
							onChange={handleNeuteredChange}
							className="custom-checkbox-threeway"
						/>
					</label>
				)}
			</div>

			<div className="border-b pb-4">
				<label className="flex justify-between items-center text-black">
					Sex:
					<button
						type="button"
						onClick={() => setIsSexCollapsed(!isSexCollapsed)}
						className="ml-2 text-black"
					>
						{isSexCollapsed ? '▼' : '▲'}
					</button>
				</label>
				{!isSexCollapsed && (
					<select
						className="mt-2 ml-2 text-black bg-Main_BG"
						value={filterCriteria.sex}
						onChange={handleSexChange}
					>
						<option value="">Any</option>
						<option value="M">M</option>
						<option value="F">F</option>
					</select>
				)}
			</div>
		</form>
	);
}

export default FilterForm;
