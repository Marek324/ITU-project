import axios from 'axios';

async function GetAnimals() {
	try {
		const response = await axios.get('http://localhost:5000/api/animals');
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

export default GetAnimals;
