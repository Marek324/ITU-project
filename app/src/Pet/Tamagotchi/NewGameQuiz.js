import React, { useState, useEffect } from 'react';
import { moneyS } from '../../svg.js';
import Quiz from './quiz';
import axios from 'axios';
import '../../App.css';

const port = 5000;

const NewGameQuiz = ({ setShowGame }) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [noMoreQuestions, setNoMoreQuestions] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
const [money, setMoney] = useState(0);

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
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/questions');
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);
  const handleNextClick = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/quiz/progress', {
        currentQuestionIndex,
        selectedAnswerIndex,
        userAnswer,
      });

      const data = response.data;
      if (data.isCorrect) {
        setCorrectAnswersCount((prev) => prev + 1);
      }

      if (data.hasMoreQuestions) {
        setCurrentQuestionIndex(data.nextQuestionIndex);
        setSelectedAnswerIndex(null);
        setUserAnswer('');
      } else {
        setNoMoreQuestions(true);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const handlePreviousClick = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return showQuiz ? (
    <Quiz setShowGame={setShowGame} />
  ) : (
    <div className="flex flex-1 text-white justify-center">
      <div className="absolute top-20 left-2 flex">
        <div className="flex items-center space-x-1">
          {moneyS()}
          <span className="text-2xl text-outline text-[#B957CE]">{money}</span>
        </div>
      </div>

      <div
  className="relative flex flex-col justify-center"
  style={{
    backgroundColor: '#3A4E93',
    width: '800px',
    height: '600px',
    border: '1px solid #B957CE',
    padding: '20px',
    overflowY: 'auto',
  }}
>
  <div
    className="absolute top-1 left-1 cursor-pointer"
    style={{
      width: '60px',
      height: '60px',
    }}
    onClick={() => setShowQuiz(true)}
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
      left: 0,
    }}
  />



        <div className="mt-10 text-center">
          {noMoreQuestions ? (
            <div>
              <h1 className="text-2xl mb-8 pt-12 text-pet text-[#B957CE]">
                You answered {correctAnswersCount} correct answers!
              </h1>
              <div className="text-left">
                {userAnswers.map((answer, index) => (
                  <div key={index} className="mb-4">
                    <h2 className="text-xl text-[#B957CE]">{answer.question}</h2>
                    <p
                      className={`text-lg ${
                        answer.isCorrect ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      You {answer.user_created ? 'typed' : 'selected'}: "{answer.selectedAnswer}" - {answer.isCorrect ? 'Correct' : 'Incorrect'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <h1 className="text-2xl mb-8 pt-12 text-pet text-[#B957CE]">
              {currentQuestion?.question || 'No question available'}
            </h1>
          )}
        </div>

        {!noMoreQuestions && (
          <div className="flex flex-col space-y-12 pt-8 text-left">
            {currentQuestion?.user_created ? (
              <div className="flex flex-col space-y-4">
                <input
                  type="text"
                  placeholder="Type your answer"
                  value={userAnswer}
                  
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="p-2 rounded text-black bg-white"
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '16px',
                    border: '2px solid #B957CE',
                    borderRadius: '5px',
                  }}
                  
                />
              </div>
              
            ) : (
              currentQuestion?.answers?.map((answer, index) => (
                <h1
                  key={index}
                  className={`text-3xl cursor-pointer hover:text-[#B957CE] ${
                    selectedAnswerIndex === index ? 'border-2 border-[#B957CE] rounded-full px-4 py-1 inline-block' : ''
                  }`}
                  onClick={() => setSelectedAnswerIndex(index)}
                >
                  {answer.text}
                </h1>
              ))
            )}
          </div>
        )}

        {!noMoreQuestions && (
          <div className="flex items-center justify-center mt-16 space-x-4">
            {/* <button
              className="px-4 py-2 rounded hover:text-[#9c3eb2] text-3xl text-[#B9E9E9]"
              style={{ fontFamily: 'Pixelify Sans' }}
              onClick={handlePreviousClick}
            >
              Previous
            </button> */}
            <button
              className="px-4 py-2 rounded hover:text-[#9c3eb2] text-3xl text-[#B9E9E9]"
              style={{ fontFamily: 'Pixelify Sans' }}
              onClick={handleNextClick}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewGameQuiz;
