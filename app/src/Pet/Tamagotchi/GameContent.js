/**
 * GameContent.js
 * Author: Petra Simonova xsimon30
 */
import React, {useState} from 'react';
import Quiz from './quiz.js';
import FPGame from '../../controllers/FPController.js';
import GameHop from '../Hop/Game.js';
import {Link} from 'react-router-dom';
import {useParams} from "react-router-dom";
import Notification from 'Pet/components/Notification.js';


const GameContent = ({ setShowGame, setHappiness }) => {
  const [currentGame, setCurrentGame] = useState(null);
  const [notification, setNotification] = useState(null);

  const closeNotification = () => {
    setNotification(null);
  };

  const handleKozaHopClick = () => setCurrentGame('GameHop');

  const handleQuizClick = async () => {
	try {
	  const response = await fetch('http://localhost:5000/api/pet/quiz', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify({
		  petId: 1,
		}),
	  });
  
	  const data = await response.json();
	  if (response.ok) {
		setHappiness((prevHappiness) => Math.max(0, prevHappiness - data.happinessReduced));
		setCurrentGame('Quiz');
	  } else {
		setNotification({ message: data.error || 'Unknown error', type: 'error' });
	  }
	} catch (error) {
	  console.error('Error starting quiz:', error);
	  setNotification({ message: error.error || 'Unknown error', type: 'error' });
	}
  };
  

  const { id } = useParams();

	const handleCrossClick = () => {
		if (currentGame) {
			setCurrentGame(null);
		} else {
			setShowGame(false);
		}
	};

	
	return (
		<div
			className={`flex flex-1 justify-center items-center text-white ${currentGame === 'FlappyPet' ? 'absolute inset-0' : ''}`}>
			{currentGame !== 'FlappyPet' && (
				<div className="absolute top-20 left-2 flex items-center">
				
				</div>
			)}

			{currentGame === null ? (
				<div
					className="relative flex flex-col justify-center items-center"
					style={{
						backgroundColor: '#3A4E93',
						width: '800px',
						height: '600px',
						border: '1px solid #B957CE',
					}}
				>
					<div className="absolute top-1 left-1 cursor-pointer" style={{width: '60px', height: '60px'}}
						 onClick={handleCrossClick}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							className="text-black hover:text-[#B957CE]"
							style={{width: '100%', height: '100%'}}
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
								  d="M6 18L18 6M6 6l12 12"/>
						</svg>
					</div>

					<div className="absolute top-16"
						 style={{width: '100%', height: '1px', backgroundColor: '#B957CE'}}/>

					<div className="flex space-x-20 mt-4">
						<h1
							className="text-4xl cursor-pointer hover:text-[#B957CE]"
							style={{fontFamily: 'Pixelify Sans'}}
							onClick={handleKozaHopClick}
						>
							Koza Hop
						</h1>
						<h1
							className="text-4xl cursor-pointer hover:text-[#B957CE]"
							style={{fontFamily: 'Pixelify Sans'}}
							onClick={handleQuizClick}
						>
							Quiz
						</h1>
						<Link to={`/animal/${id}/flappy-pet`} className="text-4xl cursor-pointer hover:text-[#B957CE]"
							  style={{fontFamily: 'Pixelify Sans'}}>
							Flappy Pet
						</Link>
						<Link to={`/animal/${id}/merge-a-pet`} className="text-4xl cursor-pointer hover:text-[#B957CE]"
							  style={{fontFamily: 'Pixelify Sans'}}>Merge-a-pet</Link>
					</div>
				</div>
			) : currentGame === 'Quiz' ? (
				<Quiz setShowGame={setShowGame}/>
			) : currentGame === 'FlappyPet' ? (
				<FPGame setShowGame={setShowGame}/>
			) : currentGame === 'GameHop' ? (
				<GameHop setShowGame={setShowGame}/>
			) : (
				<div className="text-white">Game not implemented yet!</div>
			)}
			  {notification && (
				<Notification
				message={notification.message}
				type={notification.type}
				onClose={closeNotification}
				/>
			)}
		</div>
	);
};

export default GameContent;
