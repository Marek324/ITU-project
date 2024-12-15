//Author: Tobiáš Adamčík (xadamc08)
//File: AnimalList.js
//Description: Component for displaying a list of animals

import AnimalsListItem from "./AnimalsListItem";
import { deleteCross } from "svg";

function AnimalList({ animals, adminMode, handleRemoveAnimal, handleChangeFavorite }) {
	return (
		<div className="flex flex-col items-center justify-center m-2">
			{animals.map((animal, index) => (
				<div key={index} className="flex items-center justify-center w-full">
					{adminMode && (
						<button onClick={() => handleRemoveAnimal(animal.id)} className="mr-2">
							{deleteCross()}
						</button>
					)}
					<AnimalsListItem animal={animal} adminMode={adminMode} favorited={animal.favorited} onChangeFavorite={handleChangeFavorite}/>
				</div>
			))}
		</div>
	);
}

export default AnimalList;
