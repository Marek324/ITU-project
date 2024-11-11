import 'App.css';

import { Route, Routes, BrowserRouter } from 'react-router-dom';

import MainPageController from "controllers/MainPageController";
import AnimalDetails from "./components/AnimalDetails";
import Game from "./Pet/FlappyBird/Game";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<MainPageController />} />
				<Route path="/animal/:id" element={<AnimalDetails />} />
				<Route path="/animal/:id/flappypet" element={<Game />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
