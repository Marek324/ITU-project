﻿import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GetAnimal } from '../services/AnimalsService';
import AdoptHeader from '../components/AdoptHeader';
import { gamepad } from '../svg';
import Image from '../components/Image';

function AnimalDetailsController() {
	const { id } = useParams();
	const [animal, setAnimal] = useState(null);
	const [adminMode, setAdminMode] = useState(false);
	const [editableText, setEditableText] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchAnimal() {
			try {
				const fetchedAnimal = await GetAnimal(id);
				setAnimal(fetchedAnimal);
				setEditableText(fetchedAnimal.text);
			} catch (error) {
				console.error('Error fetching animal:', error);
			}
		}
		fetchAnimal();
	}, [id]);

	if (!animal) {
		return <div>Animal not found</div>;
	}

	const handleGameClicked = () => {
		navigate(`/animal/${id}/flappypet`);
	};

	const handleTextChange = (e) => {
		setEditableText(e.target.value);
	};

	const toggleAdminMode = () => {
		setAdminMode(prevAdminMode => !prevAdminMode);
	};

	return (
		<div className="bg-white min-h-screen flex flex-col flex-grow">
			<header>
				<AdoptHeader onAdminModeClick={toggleAdminMode} />
			</header>
			<div className="flex-grow flex items-start m-3 justify-center align-middle relative p-4 min-h-custom-img">
				<Image src={animal.image} alt={animal.name} className="h-main-img w-main-img object-cover mt-10" />
				<div className="ml-16 flex flex-col">
					<span className="text-3xl font-Pet_Title text-border">{animal.name}</span>
					<p className="mt-2 text-black">Age: {animal.age}</p>
					<p className="mt-2 text-black">Species: {animal.species}</p>
					<p className="mt-2 text-black">Neutered: {animal.neutered ? 'Yes' : 'No'}</p>
					{adminMode ? (
						<textarea className="text-box mt-2 text-black" value={editableText} onChange={handleTextChange} />
					) : (
						<div className="text-box mt-2 text-black">
							<p>{animal.text}</p>
						</div>
					)}
					<div className="justify-center relative flex align-middle mt-10">
						<button className="meet-button text-Main_BG font-bold text-2xl align-middle text-border-smaller">
							Meet
						</button>
					</div>
				</div>
				<button className="-ml-12" onClick={handleGameClicked}>
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

export default AnimalDetailsController;
