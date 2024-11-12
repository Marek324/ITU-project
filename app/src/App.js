import 'App.css';

import { Route, Routes, BrowserRouter } from 'react-router-dom';

import MainPageController from "controllers/MainPageController";
import AnimalDetailsController from "controllers/AnimalDetailsController";
import Game from "Pet/FlappyBird/Game";
import BlogController from 'controllers/BlogController';
import ArticleController from 'controllers/ArticleController';
import App_t from "Pet/Tamagotchi/tamagotchi";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<MainPageController />} />
				<Route path="/blog" element={<BlogController />} />
				<Route path="/blog:id" element={<ArticleController />} />
				<Route path="/animal/:id" element={<AnimalDetailsController />} />
				<Route path="/animal/:id/flappypet" element={<Game />} />
				<Route path="/animal/:id/tamagotchi" element={<App_t />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
