import DB from './DB.json';

function GetAnimals()
{
	return DB.animals.map(animal => ({
		id: animal.id,
		image: animal.image,
		name: animal.name,
		text: animal.text,
		species: animal.species,
		age: animal.age,
		sex: animal.sex,
		neutered: animal.neutered
	}))
}

export default GetAnimals;
