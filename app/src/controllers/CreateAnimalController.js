import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateAnimal } from "../services/AnimalsService";
import AnimalEdit from "../components/animals/AnimalEdit";
import {GetImageNames} from "../services/FileService";

function CreateAnimalController() {
	const [animal, setAnimal] = useState(null);
	const [images, setImages] = useState([]);
	const navigate = useNavigate();

	useEffect( () => {
		setAnimal({
			name: '',
			species: '',
			sex: '',
			age: 0,
			money: 0,
			neutered: false,
			text: '',
			image: ''
		});
		fetchImages();
	}, []);

	const fetchImages = async () => {
		const imagesData = await GetImageNames();
		setImages(imagesData);
	};

	const handleSave = async () => {
		await CreateAnimal(animal);
		navigate(-1); // Navigate back to the previous page
	};

	if (!animal) {
		return <div>Loading...</div>;
	}

	return (
		<AnimalEdit
			handleSave={handleSave}
			animal={animal}
			images={images}
			setEditableAnimal={setAnimal}
			toggleAdminMode={null}
		/>
	);
}

export default CreateAnimalController;
