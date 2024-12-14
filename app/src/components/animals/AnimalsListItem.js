import {Link} from "react-router-dom";
import Image from "./Image";

function RectangleItem({ animal, adminMode }) {
	return (
		<Link to={`/animal/${animal.id}`} state = {{adminMode}}
			  className="w-5/6 h-auto bg-Animal_Card_BG flex items-start m-3 justify-start relative p-4 min-h-custom-img">
			<Image src={animal.image} alt={animal.name} className="w-list-img h-list-img object-cover" />
			<div className="ml-4 flex flex-col">
				<span className="text-3xl font-Pet_Title text-border">{animal.name}</span>
				<span>{animal.text} </span>
			</div>
		</Link>
	);
}

export default RectangleItem;
