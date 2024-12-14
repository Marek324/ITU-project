import React from 'react';
import Image from "./Image";

function MeetingsListItem({ meeting, handleDelete }) {
	const { id, date, animal } = meeting;
	const { name, image } = animal;
	const formattedDate = new Date(date).toLocaleString();

	return (
		<div className="flex items-center p-4 border rounded-lg shadow-md bg-white w-5/6 mx-auto">
			<Image src={image} alt={name} className="w-48 h-48 object-cover rounded-lg" />
			<div className="flex flex-col ml-8 flex-grow">
				<span className="font-bold text-2xl">{name}</span>
				<span className="text-gray-500 text-xl">{formattedDate}</span>
			</div>
			<button
				onClick={() => handleDelete(id)}
				className="text-red-500 hover:text-red-700 ml-8 text-4xl"
			>
				&times;
			</button>
		</div>
	);
}

export default MeetingsListItem;
