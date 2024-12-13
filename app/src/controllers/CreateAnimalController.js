import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateAnimal } from "../services/AnimalsService";
import AnimalEdit from "../components/animals/AnimalEdit";

function CreateAnimalController() {
	const [animal, setAnimal] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		setAnimal({
			name: '',
			species: '',
			sex: '',
			age: 0,
			neutered: false,
			text: '',
			image: ''
		});
	}, []);

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
			setEditableAnimal={setAnimal}
			toggleAdminMode={null}
		/>
	);
}

export default CreateAnimalController;
