// InventoryController.js
// Author: Petra Simonova xsimon30
import { useState, useEffect } from 'react';

 const useInventoryController = (setHappiness, setHasHat) => {
  const [items, setItems] = useState([]);
  const [money, setMoney] = useState(0);
  const [inventory, setInventory] = useState([]);
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
    }
  };

  const fetchShopMoney = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/animal/1/money');
      const data = await response.json();
      if (data && data.money !== undefined) {
        setMoney(data.money); 
      } else {
        console.error('No money data found');
      }
    } catch (error) {
      console.error('Error fetching money:', error);
    }
  };

  const fetchPetData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pet');
      const data = await response.json();
      if (data.length > 0) {
        setInventory(data[0].inventory);
        setHasHat(data[0].hasHat || false); 
        console.log(data[0].hasHat);
      } else {
        console.error('No data found');
      }
    } catch (error) {
      console.error('Error fetching pet data:', error);
    }
  };

  const handleIconClick = async (item, hasHat) => {
    try {
      const response = await fetch('http://localhost:5000/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ petId: 1, itemId: item.id }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        console.error('Error updating item:', error);
        setNotification({ message: error.error || 'Unknown error', type: 'error' });
        return;
      }
  
      const updatedPet = await response.json();
      setInventory(updatedPet.pet.inventory);
  
      if (item.id === 4) {
        setHasHat(prevHasHat => {
          const newHasHat = !prevHasHat;
          fetch('http://localhost:5000/api/pet', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              petId: 1,
              hasHat: newHasHat,
            }),
          });
          return newHasHat;
        });
      } else {
        const randomHappiness = Math.floor(Math.random() * 11) + 5; 
        await fetch('http://localhost:5000/api/pet/happiness', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ petId: 1, change: randomHappiness }),
        });
        setHappiness((prevHappiness) => Math.min(100, prevHappiness + randomHappiness));
      }
    } catch (error) {
      console.error('Error making API call:', error);
    }
  };
  

  useEffect(() => {
    fetchShopItems();
    fetchShopMoney();
    fetchPetData();
  }, []);

  return {
    items,
    money,
    inventory,
    notification,
    closeNotification,
    handleIconClick,
  };
};

export default useInventoryController;
