import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Quiz from './quiz.js';

const port = 5000;

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
        const response = await axios.get(`http://localhost:${port}/api/questions`);
        const questionsWithCorrectAnswers = response.data.filter(q =>
          q.answers.some(a => a.correct === true)
        ).map(q => ({
          id: q.id,
          question: q.question,
          answers: q.answers,
          user_created: q.user_created,
        }));
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
        const q = {
          question: newQuestion,
          correctAnswer: newAnswer, 
          answers: [
            {
              text: newAnswer,
              correct: true,
            },
          ],
        };
        await axios.post(`http://localhost:${port}/api/questions`, { question: q });
        const updatedQuestions = await axios.get(`http://localhost:${port}/api/questions`);
        setQuestions(updatedQuestions.data);
        setNewQuestion('');
        setNewAnswer('');
        setShowNewQuestionInput(false);
      } catch (error) {
        console.error('Error saving new question:', error);
      }
    }
  };
  

  const handleDeleteQuestion = async (questionId) => {
    const updatedQuestions = questions.filter(q => q.id !== questionId);
    setQuestions(updatedQuestions);
    try {
      await axios.delete(`http://localhost:${port}/api/questions/${questionId}`);
    } catch (error) {
      console.error('Error deleting question:', error);

      const updatedQuestionsFromServer = await axios.get(`http://localhost:${port}/api/questions`);
      setQuestions(updatedQuestionsFromServer.data.questions);
    }
  };

  return showQuiz ? (
    <Quiz setShowGame={setShowGame} />
  ) : (
    <div className="flex flex-1 text-white justify-center">
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
            left: 0,
          }}
        />
        <div className="flex flex-col space-y-4 pt-16 text-left">
          {questions.map((item, questionIndex) => (
            <div key={questionIndex} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-4">
                {item.user_created === true && (
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
                )}

                {/* Question */}
                <h1 className="text-3xl" style={{ fontFamily: 'Pixelify Sans' }}>
                  {item.question}
                </h1>
              </div>

              <div className="flex flex-col">
                {item.answers.some(a => a.correct === true) ? (
                  <div
                    className="text-2xl mt-2 text-green-500"
                    style={{ fontFamily: 'Pixelify Sans' }}
                  >
                    {item.answers.find(a => a.correct === true).text}
                  </div>
                ) : (
                  <div
                    className="text-2xl mt-2 text-red-500"
                    style={{ fontFamily: 'Pixelify Sans' }}
                  >
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
