//Author: Tobiáš Adamčík (xadamc08)
//File: AnimalEdit.js
//Description: View for editing animal details in admin mode

import React from "react";
import AdoptHeader from "./AdoptHeader";


function AnimalEdit({ animal, toggleAdminMode, handleSave, setEditableAnimal, adminMode, images }) {
	return (
		<div className="bg-white min-h-screen flex flex-col flex-grow">
			<header>
				<AdoptHeader onAdminModeClick={toggleAdminMode} adminMode={true} />
			</header>
			<div className="flex-grow flex items-start m-3 justify-center align-middle relative p-4 min-h-custom-img">
				<div className="ml-16 flex flex-col">
					<div className="flex items-center mb-4">
						<label className="text-black w-24">Image:</label>
						<select
							className="mt-2 ml-2 text-black bg-Main_BG flex-grow"
							value={animal.image}
							onChange={(e) => setEditableAnimal({...animal, image: e.target.value})}
						>
							{images.map((image, index) => (
								<option key={index} value={image}>
									{image}
								</option>
							))}
						</select>
					</div>
					<div className="flex items-center mb-4">
						<label className="text-black w-24">Name:</label>
						<textarea
							className="mt-2 ml-2 text-black bg-Main_BG flex-grow"
							value={animal.name}
							onChange={(e) => setEditableAnimal({...animal, name: e.target.value})}
						/>
					</div>
					<div className="flex items-center mb-4">
						<label className="text-black w-24">Age:</label>
						<input
							type="number"
							className="mt-2 ml-2 text-black bg-Main_BG flex-grow"
							value={animal.age}
							onChange={(e) => setEditableAnimal({...animal, age: e.target.value})}
						/>
					</div>
					<div className="flex items-center mb-4">
						<label className="text-black w-24">Species:</label>
						<textarea
							className="mt-2 ml-2 text-black bg-Main_BG flex-grow"
							value={animal.species}
							onChange={(e) => setEditableAnimal({...animal, species: e.target.value})}
						/>
					</div>
					<div className="flex items-center mb-4">
						<label className="text-black w-24">Sex:</label>
						<select
							className="mt-2 ml-2 text-black bg-Main_BG flex-grow"
							value={animal.sex}
							onChange={(e) => setEditableAnimal({...animal, sex: e.target.value})}
						>
							<option value="M">M</option>
							<option value="F">F</option>
						</select>
					</div>
					<div className="flex items-center mb-4">
						<label className="text-black w-24">Neutered:</label>
						<input
							type="checkbox"
							className="mt-2 ml-2 text-black bg-Main_BG"
							checked={animal.neutered}
							onChange={(e) => setEditableAnimal({...animal, neutered: e.target.checked})}
						/>
					</div>
					<div className="flex items-top mb-4">
						<label className="text-black w-24">Text:</label>
						<textarea
							className="edit-text-box mt-2 ml-2 text-black flex-grow"
							value={animal.text}
							onChange={(e) => setEditableAnimal({...animal, text: e.target.value})}
						/>
					</div>
					<div className="justify-center relative flex align-middle mt-10">
						<button className="meet-button text-Main_BG font-bold text-2xl align-middle text-border-smaller"
								onClick={handleSave}>
							Save
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AnimalEdit;
