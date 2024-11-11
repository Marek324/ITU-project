import RectangleItem from "./RectangleItem";

function RectangleList({ animals }) {
	return (
		<div className="flex flex-col items-center justify-center m-2">
			{animals.map((animal, index) => (
				<RectangleItem key={index} animal={animal} />
			))}
		</div>
	);
}

export default RectangleList;
