import RectangleItem from "./RectangleItem";
import { deleteCross } from "svg";

function RectangleList({ animals, adminMode, handleRemoveAnimal }) {
	return (
		<div className="flex flex-col items-center justify-center m-2">
			{animals.map((animal, index) => (
				<div key={index} className="flex items-center justify-center w-full">
					{adminMode && (
						<button onClick={() => handleRemoveAnimal(animal.id)} className="mr-2">
							{deleteCross()}
						</button>
					)}
					<RectangleItem animal={animal} adminMode={adminMode} />
				</div>
			))}
		</div>
	);
}

export default RectangleList;
