import RectangleItem from "./RectangleItem";

function RectangleList({ animals, adminMode, handleRemoveAnimal }) {
	return (
		<div className="flex flex-col items-center justify-center m-2">
			{animals.map((animal, index) => (
				<div key={index} className="flex items-center justify-center w-full">
					{adminMode && (
						<button onClick={() => handleRemoveAnimal(animal.id)} className="mr-2">
							Remove
						</button>
					)}
					<RectangleItem animal={animal} />
				</div>
			))}
		</div>
	);
}

export default RectangleList;
