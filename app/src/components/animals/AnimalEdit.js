import AdoptHeader from "./AdoptHeader";
import Image from "./Image";
import React from "react";
import {adminMode} from "../../svg";

function AnimalEdit({ animal, toggleAdminMode, handleSave, setEditableAnimal, adminMode }) {
	return (
		<div className="bg-white min-h-screen flex flex-col flex-grow">
			<header>
				<AdoptHeader onAdminModeClick={toggleAdminMode} adminMode={true}/>
			</header>
			<div className="flex-grow flex items-start m-3 justify-center align-middle relative p-4 min-h-custom-img">
				{animal.image && <Image src={animal.image} alt={animal.name} className="h-main-img w-main-img object-cover mt-10" />}
				<div className="ml-16 flex flex-col">
					<div className="items-center flex">
						<text className="text-black top-1/2">Name:</text>
						<textarea
							className="mt-2 ml-2 text-black bg-Main_BG"
							value={animal.name}
							onChange={(e) => setEditableAnimal({ ...animal, name: e.target.value })}
						/>
					</div>
					<div className="items-center flex">
						<text className="text-black top-1/2">Age:</text>
						<input
							type="number"
							className="mt-2 ml-2 text-black bg-Main_BG"
							value={animal.age}
							onChange={(e) => setEditableAnimal({ ...animal, age: e.target.value })}
						/>
					</div>
					<div className="items-center flex">
						<text className="text-black">Species:</text>
						<textarea
							className="mt-2 ml-2 text-black bg-Main_BG"
							value={animal.species}
							onChange={(e) => setEditableAnimal({ ...animal, species: e.target.value })}
						/>
					</div>
					<div className="items-center flex">
						<text className="text-black">Neutered:</text>
						<input
							type="checkbox"
							className="mt-2 ml-2 text-black bg-Main_BG"
							checked={animal.neutered}
							onChange={(e) => setEditableAnimal({ ...animal, neutered: e.target.checked })}
						/>
					</div>
					<div className="items-top flex">
						<text className="text-black">Text:</text>
						<textarea
							className="text-box mt-2 ml-2 text-black"
							value={animal.text}
							onChange={(e) => setEditableAnimal({ ...animal, text: e.target.value })}
						/>
					</div>
					<div className="justify-center relative flex align-middle mt-10">
						<button className="meet-button text-Main_BG font-bold text-2xl align-middle text-border-smaller" onClick={handleSave}>
							Save
						</button>
					</div>
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

export default AnimalEdit;
