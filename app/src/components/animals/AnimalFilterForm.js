import React, {useState, useEffect, useRef} from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function FilterForm({ filterCriteria, setFilterCriteria, speciesList, maxAge }) {
	const [isSpeciesCollapsed, setIsSpeciesCollapsed] = useState(true);
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

	useEffect(() => {
		if (filterCriteria.neutered === '') {
			neuteredRef.current.indeterminate = true;
			neuteredRef.current.checked = false;
		} else {
			neuteredRef.current.indeterminate = false;
			neuteredRef.current.checked = filterCriteria.neutered === 'true';
		}
	}, [filterCriteria.neutered]);

	return (
		<form className="flex flex-col space-y-4">
			<label>
				Species:
				<button
					type="button"
					onClick={() => setIsSpeciesCollapsed(!isSpeciesCollapsed)}
					className="ml-2 text-blue-500"
				>
					{isSpeciesCollapsed ? 'Show' : 'Hide'}
				</button>
				{!isSpeciesCollapsed && (
					<div className="flex flex-col space-y-2 mt-2">
						{speciesList.map((species, index) => (
							<label key={index} className="flex items-center space-x-2">
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
			</label>
			<label>
				Age Range: {filterCriteria.ageFrom} - {filterCriteria.ageTo}
				<Slider
					range
					min={0}
					max={maxAge}
					value={[filterCriteria.ageFrom, filterCriteria.ageTo]}
					onChange={handleAgeChange}
					className="My-rc-slider"
				/>
			</label>
			<label className="flex items-center space-x-2">
				Neutered:
				<input
					type="checkbox"
					ref={neuteredRef}
					onChange={handleNeuteredChange}
					className="custom-checkbox-threeway ml-2"
				/>
			</label>
		</form>
	);
}

export default FilterForm;
