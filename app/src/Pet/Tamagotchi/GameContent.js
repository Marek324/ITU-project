import React from 'react';
import { money } from '../../svg.js'; 

const GameContent = ({ setShowGame }) => { 
  const handleTicTacToeClick = () => {
    console.log('Tic Tac Toe clicked!');
  };

  const handleQuizClick = () => {
    console.log('Quiz clicked!');
  };

  const handleFlappyPetClick = () => {
    console.log('Flappy Pet clicked!');
  };

  const handleCrossClick = () => {
    setShowGame(false); 
  };

  return (
    <div className="flex flex-1 justify-center items-center text-white">
      <div className="absolute top-20 left-2 flex items-center "> 
      <div className="flex top-20 left-2 items-center flex space-x-1"> 
        
        {money()} 
        <span className="text-2xl text-outline text-[#B957CE]">1200</span> 
       </div>
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
            onClick={handleTicTacToeClick}
          >
            Tic Tac Toe
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
    </div>
  );
};

export default GameContent;
