// QuizController.js
// author: Petra Simonova xsimon30
import { useState, useEffect } from 'react';
import axios from 'axios';

const useQuizController = (setHappiness) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [noMoreQuestions, setNoMoreQuestions] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');

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

  useEffect(() => {
    if (noMoreQuestions) {
      const decreaseHappiness = async () => {
        try {
          await fetch('http://localhost:5000/api/pet/happiness', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ petId: 1, change: -10 }), 
          });
          setHappiness((prevHappiness) => prevHappiness - 10);
        } catch (error) {
          console.error('Error updating happiness:', error);
        }
      };

      decreaseHappiness();
    }
  }, [noMoreQuestions, setHappiness]);

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

      const currentQuestion = questions[currentQuestionIndex];
      const answerStatus = {
        question: currentQuestion.question,
        selectedAnswer: currentQuestion.answers[selectedAnswerIndex]?.text || userAnswer,
        isCorrect: data.isCorrect,
        user_created: currentQuestion.user_created,
      };

      setUserAnswers((prev) => [...prev, answerStatus]);

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

  return {
    showQuiz,
    setShowQuiz,
    questions,
    currentQuestionIndex,
    selectedAnswerIndex,
    setSelectedAnswerIndex,
    correctAnswersCount,
    setCorrectAnswersCount,
    noMoreQuestions,
    setNoMoreQuestions,
    userAnswers,
    setUserAnswers,
    userAnswer,
    setUserAnswer,
    handleNextClick,
  };
};

export default useQuizController;
