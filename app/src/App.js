import 'App.css';

import { Route, Routes, BrowserRouter } from 'react-router-dom';

import MainPageController from "controllers/MainPageController";
import AnimalDetailsController from "controllers/AnimalDetailsController";
import Tamagotchi from "Pet/Tamagotchi/tamagotchi";
import MergeController from "controllers/MergeController";
import CreateAnimalController from "./controllers/CreateAnimalController";
import MeetingsController from "./controllers/MeetingsController";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<MainPageController />} />
				<Route path="/animal/:id" element={<AnimalDetailsController />} />
				<Route path="/animal/:id/tamagotchi" element={<Tamagotchi />} />
				<Route path="/animal/:id/merge-a-pet" element={<MergeController />} />
				<Route path="/animal/newAnimal" element={<CreateAnimalController />} />
				<Route path="/meetings" element={<MeetingsController/>}/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
