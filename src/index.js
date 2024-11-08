import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import './tailwind.config.js';
import './index.css';
import App from './App';
import Shop from "./pages/shop/Shop";
import UserProfile from "./pages/user/UserProfile";
import reportWebVitals from './reportWebVitals';
import AnimalDetails from "./components/AnimalDetails";
import Game from "./Pet/FlappyBird/Game";

ReactDOM.render(
	<Router>
		<Routes>
			<Route path="/" element={<App />} />
			<Route path="/user" element={<UserProfile /> } />
			<Route path="/shop" element={<Shop />} />
			<Route path="/animal/:id" element={<AnimalDetails />} />
			<Route path="/animal/:id/flappypet" element={<Game />} />
		</Routes>
	</Router>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
