import React, { useState } from 'react';
import { moneyS } from '../../svg.js';
import Quiz from './quiz.js';
import Game from '../../controllers/FPController.js';
import GameHop from '../Hop/Game.js';
import { useEffect } from 'react';

const GameContent = ({ setShowGame }) => {
  const [currentGame, setCurrentGame] = useState(null);
  const [money, setMoney] = useState(0);

  const handleKozaHopClick = () => setCurrentGame('GameHop');
  const handleQuizClick = () => setCurrentGame('Quiz');
  const handleFlappyPetClick = () => setCurrentGame('FlappyPet');

  const handleCrossClick = () => {
    if (currentGame) {
      setCurrentGame(null);
    } else {
      setShowGame(false);
    }
  };

  useEffect(() => {
    const fetchShopMoney = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/pet');
        const data = await response.json();
        if (data.length > 0) {
          setMoney(data[0].money);
        } else {
          console.error('No data found');
        }
      } catch (error) {
        console.error('Error fetching money:', error);
      }
    };

    fetchShopMoney();
  }, []);
  return (
    <div className={`flex flex-1 justify-center items-center text-white ${currentGame === 'FlappyPet' ? 'absolute inset-0' : ''}`}>
      {currentGame !== 'FlappyPet' && (
        <div className="absolute top-20 left-2 flex items-center">
          <div className="flex items-center space-x-1">
            {moneyS()}
            <span className="text-2xl text-outline text-[#B957CE]">{money}</span>
          </div>
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
          <div className="absolute top-1 left-1 cursor-pointer" style={{ width: '60px', height: '60px' }} onClick={handleCrossClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="text-black hover:text-[#B957CE]"
              style={{ width: '100%', height: '100%' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <div className="absolute top-16" style={{ width: '100%', height: '1px', backgroundColor: '#B957CE' }} />

          <div className="flex space-x-20 mt-4">
            <h1
              className="text-4xl cursor-pointer hover:text-[#B957CE]"
              style={{ fontFamily: 'Pixelify Sans' }}
              onClick={handleKozaHopClick}
            >
              Koza Hop
            </h1>
            <h1
              className="text-4xl cursor-pointer hover:text-[#B957CE]"
              style={{ fontFamily: 'Pixelify Sans' }}
              onClick={handleQuizClick}
            >
              Quiz
            </h1>
            <h1
              className="text-4xl cursor-pointer hover:text-[#B957CE]"
              style={{ fontFamily: 'Pixelify Sans' }}
              onClick={handleFlappyPetClick}
            >
              Flappy Pet
            </h1>
          </div>
        </div>
      ) : currentGame === 'Quiz' ? (
        <Quiz setShowGame={setShowGame} />
      ) : currentGame === 'FlappyPet' ? (
        <Game setShowGame={setShowGame} />
      ) : currentGame === 'GameHop' ? (
        <GameHop setShowGame={setShowGame} />
      ) : (
        <div className="text-white">Game not implemented yet!</div>
      )}
    </div>
  );
};

export default GameContent;
