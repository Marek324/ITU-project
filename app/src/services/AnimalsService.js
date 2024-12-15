//Author: Tobiáš Adamčík (xadamc08)
//File: AnimalService.js
//Description: Service for managing animals in the shelter

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
		neutered: animal.neutered,
		favorited: animal.favorited
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
			neutered: animal.neutered,
			money: animal.money
		}
		} catch (error) {
			console.error('Error fetching animal:', error);
			return null;
		}
}

export async function CreateAnimal(new_animal) {
	try {
		const response = await axios.post(`http://localhost:${port}/api/animals`, new_animal);
	} catch (error) {
		console.error('Error adding animal:', error);
	}
}

export async function RemoveAnimal(id) {
	const response = await axios.delete(`http://localhost:${port}/api/animals/${id}`);
	if(response.status !== 200) {
		console.error('Error updating animal:', response);
	}
}

export async function UpdateAnimal(updated_animal) {
	const response = await axios.put(`http://localhost:${port}/api/animals/${updated_animal.id}`, updated_animal);
	if(response.status !== 200) {
		console.error('Error updating animal:', response);
	}
}

export async function FavoriteAnimal(id) {
	try {
		const response = await axios.post(`http://localhost:${port}/api/favoritedAnimals/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error favoriting animal:', error);
	}
}

export async function UnfavoriteAnimal(id) {
	try {
		const response = await axios.delete(`http://localhost:${port}/api/favoritedAnimals/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error unfavoriting animal:', error);
	}
}

