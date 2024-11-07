import React from 'react';
import {Link, useParams} from 'react-router-dom';
import GetAnimals from '../API/GetAnimalsApiCaller';
import AdoptHeader from "./AdoptHeader";
import {gamepad} from "../svg";

function AnimalDetails() {
	const { id } = useParams();
	const animals = GetAnimals();
	const animal = animals.find(animal => animal.id === parseInt(id));

	if (!animal) {
		return <div>Animal not found</div>;
	}

	return (
		<div className="bg-white min-h-screen flex flex-col flex-grow">
			<header>
				<AdoptHeader/>
			</header>
			<div className="flex-grow  flex items-start m-3 justify-center align-middle relative p-4 min-h-custom-img">
				<img src={animal.image} alt={animal.name} className="h-main-img w-main-img object-cover mt-10"/>

				<div className="ml-16 flex flex-col">
					<span className="text-3xl font-Pet_Title text-border">{animal.name}</span>
					<p className="mt-2 text-black">Age: {animal.age}</p>
					<p className="mt-2 text-black">Species: {animal.species}</p>
					<p className="mt-2 text-black">Neutered: {animal.neutered ? 'Yes' : 'No'}</p>
					<div className="text-box mt-2 text-black">
						<p>{animal.text}</p>
					</div>
					<div className="justify-center relative flex align-middle mt-10">
					<button className="meet-button text-Main_BG font-bold text-2xl align-middle text-border-smaller">
						 Meet
					</button>
					</div>
				</div>
				<button className="-ml-12">
					{gamepad()}
				</button>
			</div>

			<footer className="bg-pink-50 p-4 y-">
				<div className="flex justify-center items-center">
					<p>Footer Content</p>
				</div>
			</footer>
		</div>
	);
}

export default AnimalDetails;
