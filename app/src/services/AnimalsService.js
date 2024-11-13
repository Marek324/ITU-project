import axios from 'axios';
const port = 5000;

export async function GetAnimals() {
	try {
		const response = await axios.get(`http://localhost:${port}/api/animals`);
		return mapAnimals(response);
	} catch (error) {
		console.error('Error fetching animals:', error);
		return [];
	}
}

function mapAnimals(response)
{
	return response.data.map(animal => ({
		id: animal.id,
		image: animal.image,
		name: animal.name,
		text: animal.text,
		species: animal.species,
		age: animal.age,
		sex: animal.sex,
		neutered: animal.neutered
	}));
}

export async function GetAnimal(id) {
	try {
		const response = await axios.get(`http://localhost:${port}/api/animals/${id}`);
		const animal = response.data;
		return {
			id: animal.id,
			image: animal.image,
			name: animal.name,
			text: animal.text,
			species: animal.species,
			age: animal.age,
			sex: animal.sex,
			neutered: animal.neutered
		}
		} catch (error) {
			console.error('Error fetching animal:', error);
			return null;
		}
}

export async function CreateAnimal(new_animal) {
	try {
		const response = await axios.post(`http://localhost:${port}/api/animals`, new_animal);
		console.log(response.data);
	} catch (error) {
		console.error('Error adding animal:', error);
	}
}

export async function RemoveAnimal(id) {
	const response = await axios.delete(`http://localhost:${port}/api/animals/${id}`);
	if(response.status === 200) {
		return response.data.map(animal => ({
			id: animal.id,
			image: animal.image,
			name: animal.name,
			text: animal.text,
			species: animal.species,
			age: animal.age,
			sex: animal.sex,
			neutered: animal.neutered
		}));
	}
}

export async function UpdateAnimal(updated_animal) {
	const response = await axios.put(`http://localhost:${port}/api/animals/${updated_animal.id}`, updated_animal);
	if(response.status === 200) {
		return response.data.map(animal => ({
			id: animal.id,
			image: animal.image,
			name: animal.name,
			text: animal.text,
			species: animal.species,
			age: animal
		}
	)
)
	}
}

