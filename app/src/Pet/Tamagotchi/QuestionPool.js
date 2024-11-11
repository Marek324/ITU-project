import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { money, user } from '../../svg.js';
import Quiz from './quiz.js';

const QuestionPool = ({ setShowGame }) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [showNewQuestionInput, setShowNewQuestionInput] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const handleCrossClick = () => {
    setShowQuiz(true);
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/questions');
        const questionsWithCorrectAnswers = response.data.questions.map((question) => {
          const correctAnswer = question.answers?.find(ans => ans.correct) || null;
          return { ...question, correctAnswer };
        });
        setQuestions(questionsWithCorrectAnswers);
        console.log('Fetched Questions:', questionsWithCorrectAnswers);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleAddNewQuestionClick = () => {
    setShowNewQuestionInput(true);
  };

  const handleSaveNewQuestion = async () => {
    if (newQuestion && newAnswer) {
      try {
        const response = await axios.post('http://localhost:5001/api/questions', {
          question: newQuestion,
          answer: newAnswer,
          correct: true, 
          user_created: true, 
        });
        const updatedQuestions = await axios.get('http://localhost:5001/api/questions');
        const questionsWithCorrectAnswers = updatedQuestions.data.questions.map((question) => {
          const correctAnswer = question.answers?.find(ans => ans.correct) || null;
          return { ...question, correctAnswer };
        });
  
        setQuestions(questionsWithCorrectAnswers);
  
        setNewQuestion('');
        setNewAnswer('');
        setShowNewQuestionInput(false);
      } catch (error) {
        console.error('Error saving new question:', error);
      }
    }
  };
  const handleDeleteQuestion = async (questionId) => {
    console.log("Deleting question with ID:", questionId); 
    const updatedQuestions = questions.filter(q => q.id !== questionId);
    const updatedQuestionsWithCorrectAnswers = updatedQuestions.map((question) => {
      const correctAnswer = question.answers?.find(ans => ans.correct) || null;
      return { ...question, correctAnswer };
    });
  
    setQuestions(updatedQuestionsWithCorrectAnswers);
  
    try {
      await axios.delete(`http://localhost:5001/api/questions/${questionId}`);
    } catch (error) {
      console.error('Error deleting question:', error);
  
      const updatedQuestionsFromServer = await axios.get('http://localhost:5001/api/questions');
      setQuestions(updatedQuestionsFromServer.data.questions);
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
  {questions.map((item, questionIndex) => (
    <div key={questionIndex} className="flex flex-col space-y-2">
      <div className="flex items-center space-x-4">
        {item.user_created ? (  
          <button
            className="text-red-500"
            onClick={() => handleDeleteQuestion(item.id)} 
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 text-red-500 hover:text-red-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        ) : null}

        {/* Question */}
        <h1 className="text-3xl" style={{ fontFamily: 'Pixelify Sans' }}>
          {item.question}
        </h1>
      </div>

      <div className="flex flex-col">
        {item.correctAnswer ? (
          <div className="text-2xl mt-2 text-green-500" style={{ fontFamily: 'Pixelify Sans' }}>
            {item.correctAnswer.text}
          </div>
        ) : (
          <div className="text-2xl mt-2 text-red-500" style={{ fontFamily: 'Pixelify Sans' }}>
            No correct answer available
          </div>
        )}
      </div>
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
          <div
            className="px-4 py-2 bg-[#B957CE] rounded hover:bg-[#9c3eb2] mt-4 cursor-pointer"
            onClick={handleAddNewQuestionClick}
          >
            Add New Question
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionPool;
