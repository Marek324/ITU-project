//Author: Tobiáš Adamčík (xadamc08)
//File: AnimalDetailsController.js
//Description: Controller for displaying animal details and managing them

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { GetAnimal, UpdateAnimal } from '../services/AnimalsService';
import AnimalDetail from "../components/animals/AnimalDetail";
import AnimalEdit from "../components/animals/AnimalEdit";
import ScheduleMeeting from "../components/animals/ScheduleMeeting";
import DonateModal from "../components/animals/Donate";
import { UpdatePetMoney } from "../services/GameService";
import {GetImageNames} from "../services/FileService";

function AnimalDetailsController() {
	const { id } = useParams();
	const location = useLocation();
	const [animal, setAnimal] = useState(null);
	const [adminMode, setAdminMode] = useState(location.state?.adminMode || false);
	const [editableAnimal, setEditableAnimal] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDonateOpen, setIsDonateOpen] = useState(false);
	const [images, setImages] = useState([]);
	const navigate = useNavigate();

	const fetchAnimal = async () => {
		try {
			const fetchedAnimal = await GetAnimal(id);
			setAnimal(fetchedAnimal);
			setEditableAnimal(fetchedAnimal);
			const imagesData = await GetImageNames();
			setImages(imagesData);
		} catch (error) {
			console.error('Error fetching animal:', error);
		}
	};

	useEffect(() => {
		fetchAnimal();
	}, [id]);

	if (!animal) {
		return <div>Animal not found</div>;
	}

	const handleDonate = async (amount) => {
		await UpdatePetMoney(id, parseInt(animal.money) + parseInt(amount));
		await fetchAnimal(); // Refetch the animal data after donation
		handleCloseDonateModal();
	};

	const handleGameClicked = () => {
		navigate(`/animal/${id}/tamagotchi`);
	};

	const toggleAdminMode = () => {
		setAdminMode(prevAdminMode => !prevAdminMode);
	};

	const handleSave = async () => {
		// Saves the edited animal and refetches the animal data
		await UpdateAnimal(editableAnimal);
		await fetchAnimal();
		setAdminMode(false);
	};

	const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleOpenDonateModal = () => {
		setIsDonateOpen(true);
	};

	const handleCloseDonateModal = () => {
		setIsDonateOpen(false);
	};
	return (
		<div>
			{adminMode ? (
				<AnimalEdit
					animal={editableAnimal}
					images={images}
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
					handleOpenMeetModal={handleOpenModal}
					handleDonateOpen={handleOpenDonateModal}
				/>
			)}
			<ScheduleMeeting isOpen={isModalOpen} onClose={handleCloseModal} animalId={id} />
			<DonateModal isOpen={isDonateOpen} onClose={handleCloseDonateModal} handleDonate={handleDonate} />
		</div>
	);
}

export default AnimalDetailsController;
