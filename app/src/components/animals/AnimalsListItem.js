//Author: Tobiáš Adamčík (xadamc08)
//File: AnimalListItem.js
//Description: View for displaying a single animal in the list of animals

import { Link } from "react-router-dom";
import Image from "../Image";
import { heartIcon } from "../../svg";

function AnimalsListItem({ animal, adminMode, favorited, onChangeFavorite }) {
	return (
		<div className="relative w-5/6 h-auto bg-Animal_Card_BG flex m-3 justify-start p-4 min-h-custom-img rounded-lg">
			<Link to={`/animal/${animal.id}`} state={{ adminMode }} className="flex-grow flex items-start">
				<Image src={animal.image} alt={animal.name} className="w-list-img h-list-img object-cover rounded-lg" />
				<div className="ml-4 flex flex-col justify-between">
					<div className="ml-4 flex flex-col">
						<span className="text-3xl font-Pet_Title text-border">{animal.name}</span>
						<span>{animal.text}</span>
					</div>
					<div className="mt-auto flex flex-wrap absolute bottom-2">
						<div className="rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
							Species: {animal.species}
						</div>
						<div className="rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
							Age: {animal.age}
						</div>
						<div className="rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
							Sex: {animal.sex}
						</div>
						<div className="rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
							Neutered: {animal.neutered ? 'Yes' : 'No'}
						</div>
					</div>
				</div>
			</Link>
			<button
				onClick={() => onChangeFavorite(animal.id)}
				className="absolute bottom-4 right-4"
				aria-label="Favorite"
			>
				{heartIcon(favorited)}
			</button>
		</div>
	);
}

export default AnimalsListItem;
