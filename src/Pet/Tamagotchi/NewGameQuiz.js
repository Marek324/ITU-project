import React, { useState } from 'react';
import { money } from '../../svg.js'; 
import Quiz from './quiz'; 

const NewGameQuiz = ({ setShowGame }) => { 
  const [showQuiz, setShowQuiz] = useState(false); 

  const handleQuizClick = (answer) => {
    console.log(`Answer ${answer} clicked!`);
  };

  const handleCrossClick = () => {
    setShowQuiz(true); // Navigate back to Quiz
  };

  const handleNextClick = () => {
    console.log('Next question!');
  };

  const handlePreviousClick = () => {
    console.log('Previous question!');
  };

  return showQuiz ? (
    <Quiz setShowGame={setShowGame} /> 
  ) : (
    <div className="flex flex-1 text-white">
      <div className="absolute top-20 left-2 flex"> 
        <div className="flex items-center space-x-1"> 
          {money()} 
          <span className="text-2xl text-outline text-[#B957CE]">1200</span> 
        </div>
      </div>
      
      <div
        className="relative flex flex-col justify-start"
        style={{
          backgroundColor: '#3A4E93',
          width: '800px', 
          height: '600px',
          border: '1px solid #B957CE',
          padding: '20px'
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
        <div className="mt-10 text-center">
          <h1 className="text-2xl mb-8 pt-12 text-pet text-[#B957CE]">
            tu bude otazka za milion jupiiiii
          </h1>
        </div>
        <div className="flex flex-col space-y-12 pt-8 text-left">
          <h1
            className="text-3xl cursor-pointer hover:text-[#B957CE]"
            style={{ fontFamily: 'Pixelify Sans' }}
            onClick={() => handleQuizClick('Answer 1.0')}
          >
            a/ Answer 1.0
          </h1>
          <h1
            className="text-3xl cursor-pointer hover:text-[#B957CE]"
            style={{ fontFamily: 'Pixelify Sans' }}
            onClick={() => handleQuizClick('Answer 2.0')}
          >
            b/ Answer 2.0
          </h1>
          <h1
            className="text-3xl cursor-pointer hover:text-[#B957CE]"
            style={{ fontFamily: 'Pixelify Sans' }}
            onClick={() => handleQuizClick('Answer 3.0')}
          >
            c/ Answer 3.0
          </h1>
        </div>

        <div className="flex items-center justify-center mt-16 space-x-4">
          <button
            className="px-4 py-2 rounded hover:text-[#9c3eb2] text-3xl text-[#B9E9E9]"
            style={{ fontFamily: 'Pixelify Sans' }}
            onClick={handlePreviousClick}
          >
            Previous
          </button>
          <button
            className="px-4 py-2 rounded hover:text-[#9c3eb2] text-3xl text-[#B9E9E9]"
            style={{ fontFamily: 'Pixelify Sans' }}
            onClick={handleNextClick}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewGameQuiz;
