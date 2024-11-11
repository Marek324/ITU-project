import axios from 'axios';
const port = 5000;

export async function GetAnimals() {
	try {
		const response = await axios.get(`http://localhost:${port}/api/animals`);
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
	} catch (error) {
		console.error('Error fetching animals:', error);
		return [];
	}
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
