// questionPoolController.js
// author: Petra Simonova xsimon30
import { useState, useEffect } from 'react';
import axios from 'axios';

const useQuestionPoolController = (setShowGame) => {
const port = 5000;
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
  return {
    questions,
    showNewQuestionInput,
    newQuestion,
    newAnswer,
    handleAddNewQuestionClick,
    handleSaveNewQuestion,
    handleDeleteQuestion,
    setNewQuestion, 
    setNewAnswer,
    handleCrossClick,
    showQuiz,
    
  };
};

export default useQuestionPoolController;
