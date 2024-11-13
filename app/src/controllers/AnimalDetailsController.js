﻿import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { CreateAnimal, GetAnimal, UpdateAnimal } from '../services/AnimalsService';
import AnimalDetail from "../components/animals/AnimalDetail";
import AnimalEdit from "../components/animals/AnimalEdit";

function AnimalDetailsController() {
	const { id } = useParams();
	const location = useLocation();
	const [animal, setAnimal] = useState(null);
	const [adminMode, setAdminMode] = useState(location.state?.adminMode || false);
	const [editableAnimal, setEditableAnimal] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchAnimal() {
			try {
				const fetchedAnimal = await GetAnimal(id);
				setAnimal(fetchedAnimal);
				setEditableAnimal(fetchedAnimal);
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
		navigate(`/animal/${id}/tamagotchi`);
	};

	const toggleAdminMode = () => {
		setAdminMode(prevAdminMode => !prevAdminMode);
	};

	const handleSave = async () => {
		await UpdateAnimal(editableAnimal);
		setAnimal(editableAnimal);
		setAdminMode(false);
	};

	return (
		<div>
			{adminMode ? (
				<AnimalEdit
					animal={editableAnimal}
					toggleAdminMode={toggleAdminMode}
					adminMode={adminMode}
					handleSave={handleSave}
					setEditableAnimal={setEditableAnimal}
				/>
			) : (
				<AnimalDetail
					animal={animal}
					adminMode={adminMode}
					toggleAdminMode={toggleAdminMode}
					handleGameClicked={handleGameClicked}
				/>
			)}
		</div>
	);
}

export default AnimalDetailsController;
