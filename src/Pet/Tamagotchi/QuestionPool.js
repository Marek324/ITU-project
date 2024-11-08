import React, { useState } from 'react';
import { money } from '../../svg.js'; 
import Quiz from './quiz.js';
const QuestionPool = ({ setShowGame }) => { 
  const [showQuiz, setShowQuiz] = useState(false); 
  const [questions, setQuestions] = useState([
    { question: 'Question 1.0', answer: 'Answer 1.0' },
    { question: 'Question 2.0', answer: 'Answer 2.0' },
    { question: 'Question 3.0', answer: 'Answer 3.0' },
  ]);
  const [showNewQuestionInput, setShowNewQuestionInput] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const handleCrossClick = () => {
    setShowQuiz(true); 
  };
  const handleQuizClick = (answer) => {
    console.log(`Answer ${answer} clicked!`);
  };


  const handleAddNewQuestionClick = () => {
    setShowNewQuestionInput(true);
  };

  const handleSaveNewQuestion = () => {
    if (newQuestion && newAnswer) {
      setQuestions([...questions, { question: newQuestion, answer: newAnswer }]);
      setNewQuestion('');
      setNewAnswer('');
      setShowNewQuestionInput(false);
    }
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

        <div className="flex flex-col space-y-4 pt-16 text-left">
          {questions.map((item, index) => (
            <div key={index}>
              <h1
                className="text-3xl cursor-pointer hover:text-[#B957CE]"
                style={{ fontFamily: 'Pixelify Sans' }}
                onClick={() => handleQuizClick(item.answer)}
              >
                {item.question}
              </h1>
              <h1
                className="text-3xl cursor-pointer hover:text-[#B957CE]"
                style={{ fontFamily: 'Pixelify Sans' }}
                onClick={() => handleQuizClick(item.answer)}
              >
                {item.answer}
              </h1>
            </div>
          ))}
        </div>

        {showNewQuestionInput && (
          <div className="flex flex-col space-y-4 mt-4">
            <input
              type="text"
              placeholder="Enter question"
              className="p-2 rounded"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter answer"
              className="p-2 rounded"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-[#B957CE] rounded hover:bg-[#9c3eb2] text-white"
              onClick={handleSaveNewQuestion}
            >
              Save Question
            </button>
          </div>
        )}

        {!showNewQuestionInput && (
          <div className="flex items-center justify-center">
            <button
              className="px-4 py-2 rounded hover:text-[#9c3eb2] text-3xl text-[#B9E9E9]"
              style={{ fontFamily: 'Pixelify Sans' }}
              onClick={handleAddNewQuestionClick}
            >
              Add New Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionPool;
