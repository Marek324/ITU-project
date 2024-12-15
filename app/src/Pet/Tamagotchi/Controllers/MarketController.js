// marketController.js
// author: Petra Simonova xsimon30
import { useState, useEffect } from 'react';

const useMarketController = () => {
  const [items, setItems] = useState([]);
  const [money, setMoney] = useState(0);
  const [hasHat, setHasHat] = useState(false);
  const [tempPrice, setTempPrice] = useState(null); 
  const [showPriceAnimation, setShowPriceAnimation] = useState(false); 
  const [notification, setNotification] = useState(null);
  const closeNotification = () => {
    setNotification(null);
  };

  const fetchShopItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/shop');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching shop items:', error);
      setNotification({ message: 'Failed to load shop items', type: 'error' });
    }
  };

  const fetchHat = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pet');
      const data = await response.json();
      if (data.length > 0) {
        setHasHat(data[0].hasHat); 
      } else {
        setNotification({ message: 'No pet data found', type: 'error' });
      }
    } catch (error) {
      console.error('Error fetching hat:', error);
      setNotification({ message: 'Failed to fetch hat info', type: 'error' });
    }
  };

  const fetchShopMoney = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/animal/1/money');
      const data = await response.json();
      if (data && data.money !== undefined) {
        setMoney(data.money); 
      } else {
        setNotification({ message: 'Failed to fetch money data', type: 'error' });
      }
    } catch (error) {
      console.error('Error fetching money:', error);
      setNotification({ message: 'Failed to fetch money', type: 'error' });
    }
  };

  const handleBuyItem = async (itemId, itemPrice) => {
    try {
      const response = await fetch('http://localhost:5000/api/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          petId: 1,  
          itemId,  
        }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        setNotification({ message: error.error || 'Unknown error', type: 'error' });
        throw new Error(error.error || 'Unknown error');
      
      } else {
        const updatedData = await response.json();
        setMoney(updatedData.money); 
        setTempPrice(itemPrice);
        setShowPriceAnimation(true);
        setTimeout(() => {
          setShowPriceAnimation(false);
          setTempPrice(null);  
        }, 500); 
      }
    } catch (error) {
      console.error('Error buying item:', error);
    }
  };

  useEffect(() => {
    fetchShopItems();
    fetchHat();
    fetchShopMoney();
  }, []);

  return {
    items,
    money,
    hasHat,
    tempPrice,
    showPriceAnimation,
    notification,
    fetchShopItems,
    fetchHat,
    fetchShopMoney,
    handleBuyItem,
    closeNotification,
  };
};

export default useMarketController;
