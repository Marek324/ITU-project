import React from 'react';
import { useParams } from 'react-router-dom';
import GetAnimals from '../BE/AnimalsAPI';

function AnimalDetails() {
	const { id } = useParams();
	const animals = GetAnimals();
	const animal = animals.find(animal => animal.id === parseInt(id));

	if (!animal) {
		return <div>Animal not found</div>;
	}

	return (
		<div className="animal-details">
			<h1>{animal.name}</h1>
			<img src={animal.image} alt={animal.name} />
			<p>{animal.text}</p>
			<p>Age: {animal.age}</p>
			<p>Species: {animal.species}</p>
			<p>Neutered: {animal.neutered ? 'Yes' : 'No'}</p>
		</div>
	);
}

export default AnimalDetails;
