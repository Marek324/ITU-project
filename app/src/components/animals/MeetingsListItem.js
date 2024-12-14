import React from 'react';
import Image from "./Image";

function MeetingsListItem({ meeting, handleDelete }) {
	const { date, animal } = meeting;
	const { name, image } = animal;
	const formattedDate = new Date(date).toLocaleString();

	return (
		<div className="flex items-center p-4 border rounded-lg shadow-md bg-white w-5/6 mx-auto">
			<Image src={image} alt={name} className="w-list-img h-list-img object-cover rounded-lg" />
			<div className="flex flex-col ml-4">
				<span className="font-bold text-lg">{name}</span>
				<span className="text-gray-500">{formattedDate}</span>
			</div>
		</div>
	);
}

export default MeetingsListItem;
