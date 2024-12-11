import React, { useState } from 'react';
import { moneyS
 } from '../../svg.js'; 
import MainPage from '../../Pet/components/MainPage.js';
import NewGameQuiz from './NewGameQuiz.js';
import QuestionPool from './QuestionPool.js';
import { useEffect } from 'react';

const Quiz = ({ setShowGame }) => { 
  const [mainPage, setMainPage] = useState(false);
  const [newGame, setNewGame] = useState(false);
  const [questionPool, setQuestionPool] = useState(false);
  const  [money, setMoney] = useState(0);

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
  
  const handleCrossClick = () => {
    if (mainPage || (!newGame && !questionPool)) {
      setShowGame(false);
    } else {
      setNewGame(false);
      setQuestionPool(false);
    }
  };

  const handleNewGameClick = () => {
    setNewGame(true); 
  };

  const handleQuestionPoolClick = () => {
    setQuestionPool(true);
  };

  return mainPage ? (
    <MainPage setShowGame={setShowGame} />
  ) : newGame ? (
    <NewGameQuiz setShowGame={setShowGame} />
  ) : questionPool ? (
    <QuestionPool setShowGame={setShowGame} />
  ) : (
    <div className="flex flex-col justify-center items-center text-white">
      <div className="flex absolute top-20 left-2 items-center space-x-1">
        {moneyS()}
        <span className="text-2xl text-outline text-[#B957CE]">{money}</span>
      </div>

      <div
        className="relative flex flex-col justify-center items-center"
        style={{
          backgroundColor: '#3A4E93',
          width: '800px',
          height: '600px',
          border: '1px solid #B957CE',
        }}
      >
        <div
          className="absolute top-1 left-1 cursor-pointer"
          style={{
            width: '60px',
            height: '60px',
          }}
          onClick={handleCrossClick} 
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="text-black hover:text-[#B957CE]"
            style={{ width: '100%', height: '100%' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <div
          className="absolute top-16"
          style={{
            width: '100%',
            height: '1px',
            backgroundColor: '#B957CE',
          }}
        />

        <div className="flex space-x-20 mt-4">
          <h1
            className="text-4xl cursor-pointer hover:text-[#B957CE]"
            style={{ fontFamily: 'Pixelify Sans' }}
            onClick={handleNewGameClick}
          >
            New Game
          </h1>
          <h1
            className="text-4xl cursor-pointer hover:text-[#B957CE]"
            style={{ fontFamily: 'Pixelify Sans' }}
            onClick={handleQuestionPoolClick}
          >
            Question Pool
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
