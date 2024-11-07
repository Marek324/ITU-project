import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import './tailwind.config.js';
import './index.css';
import App from './App';
import User from "./components/User";
import reportWebVitals from './reportWebVitals';
import MainPageUser from "./MainPageUser";
import AnimalDetails from "./components/AnimalDetails";

ReactDOM.render(
	<Router>
		<Routes>
			<Route path="/" element={<MainPageUser />} />
			<Route path="/user" element={<User /> } />
			<Route path="/animal/:id" element={<AnimalDetails />} />
		</Routes>
	</Router>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
