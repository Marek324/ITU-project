import { useEffect, useState } from "react";
import { CreateAnimal } from "../services/AnimalsService";
import AnimalEdit from "../components/animals/AnimalEdit";

function CreateAnimalController() {
	const [animal, setAnimal] = useState(null);

	useEffect(() => {
		setAnimal({
			name: '',
			species: '',
			age: 0,
			neutered: false,
			text: '',
			image: ''
		});
	}, []);

	const handleSave = async () => {
		await CreateAnimal(animal);
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
