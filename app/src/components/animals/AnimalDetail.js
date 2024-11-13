import AdoptHeader from "./AdoptHeader";
import Image from "./Image";
import {adminMode, gamepad} from "../../svg";
import React from "react";

function AnimalDetail({animal, handleGameClicked, toggleAdminMode}) {

return (
	<div className="bg-white min-h-screen flex flex-col flex-grow">
		<header>
			<AdoptHeader onAdminModeClick={toggleAdminMode} adminMode={false} />
		</header>
		<div className="flex-grow flex items-start m-3 justify-center align-middle relative p-4 min-h-custom-img">
			<Image src={animal.image} alt={animal.name} className="h-main-img w-main-img object-cover mt-10"/>
			<div className="ml-16 flex flex-col">

				<span className="text-3xl font-Pet_Title text-border">{animal.name}</span>
				<p className="mt-2 text-black">Age: {animal.age}</p>


				<p className="mt-2 text-black">Species: {animal.species}</p>

				<p className="mt-2 text-black">Neutered: {animal.neutered ? 'Yes' : 'No'}</p>
				<div className="text-box mt-2 text-black">
					<p>{animal.text}</p>
				</div>
				<button className="meet-button text-Main_BG font-bold text-2xl align-middle text-border-smaller">
					Meet
				</button>
			</div>
			<div className="flex justify-center">
				<button className="-ml-12" onClick={handleGameClicked}>
					{gamepad()}
				</button>
			</div>
		</div>

		<footer className="bg-pink-50 p-4 y-">
			<div className="flex justify-center items-center">
				<p>Footer Content</p>
			</div>
		</footer>
	</div>
);
}

export default AnimalDetail
