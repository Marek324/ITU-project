// GameController.js
// Author: Petra Simonova xsimon30
import { useState } from 'react';

const useGameController = (setHappiness, setNotification) => {
  const [currentGame, setCurrentGame] = useState(null);

  const closeNotification = () => {
    setNotification(null);
  };

  const handleKozaHopClick = () => setCurrentGame('GameHop');

  const handleQuizClick = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pet/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          petId: 1,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setHappiness((prevHappiness) => Math.max(0, prevHappiness - data.happinessReduced));
        setCurrentGame('Quiz');
      } else {
        setNotification({ message: data.error || 'Unknown error', type: 'error' });
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
      setNotification({ message: error.error || 'Unknown error', type: 'error' });
    }
  };

  const handleCrossClick = (setShowGame) => {
    if (currentGame) {
      setCurrentGame(null);
    } else {
      setShowGame(false);
    }
  };

  return {
    currentGame,
    handleKozaHopClick,
    handleQuizClick,
    handleCrossClick,
    closeNotification,
  };
};

export default useGameController;
