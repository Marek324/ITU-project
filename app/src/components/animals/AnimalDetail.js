//Author: Tobiáš Adamčík (xadamc08)
//File: AnimalDetail.js
//Description: View for displaying animal details and user interactions

import React from "react";
import AdoptHeader from "./AdoptHeader";
import Image from "./Image";
import { gamepad, donate } from "../../svg";

function AnimalDetail({ animal, handleGameClicked, toggleAdminMode, isMeetOpen, onMeetClose, handleOpenMeetModal, isDonateOpen, onDonateClose, handleDonateOpen }) {
	return (
		<div className="bg-white min-h-screen flex flex-col flex-grow">
			<header>
				<AdoptHeader onAdminModeClick={toggleAdminMode} adminMode={false} />
			</header>
			<div className="flex-grow flex flex-col items-center m-3 align-middle relative p-4 min-h-custom-img">
				<div className="flex flex-row ">
					<div className="flex flex-col">
						<Image src={animal.image} alt={animal.name} className="h-main-img w-main-img object-cover rounded-lg" />
						<div className="ml-4 flex flex-col">
							<div className="mt-4 flex flex-wrap">
								<div className="rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
									Species: {animal.species}
								</div>
								<div className="rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
									Age: {animal.age}
								</div>
								<div className="rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
									Sex: {animal.sex}
								</div>
								<div className="rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
									Neutered: {animal.neutered ? 'Yes' : 'No'}
								</div>
							</div>
						</div>
					</div>
					<div className="ml-8 flex flex-col justify-start">
						<div className="flex items-center justify-between">
							<span className="text-3xl font-Pet_Title text-border">{animal.name}</span>
							<div className="flex flex-row items-center justify-end">
								<div className="text-Pet_Text text-pet font-Pet_Title text-2xl"
									 style={{textShadow: '2px 2px 0 black'}}>
									<span className="text-yellow-500">{animal.money}¥</span>
								</div>
								<button onClick={handleGameClicked} style={{marginLeft: '16px'}}>
									{gamepad()}
								</button>
							</div>
						</div>
							<div className="text-box mt-2 text-black">
								<p>{animal.text}</p>
							</div>

							<div className="flex justify-between mt-4">
								<div className="flex justify-center w-full">
									<button
										className="meet-button text-Main_BG font-bold text-2xl align-middle text-border-smaller"
										onClick={handleOpenMeetModal}>
										Meet
									</button>
								</div>
								<button onClick={handleDonateOpen} className="ml-4">
									{donate()}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			);
			}

			export default AnimalDetail;
