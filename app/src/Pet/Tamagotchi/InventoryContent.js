import React, { useState, useEffect } from 'react';
import { hatS, food_01, food_02, background, pallete, hat_02, ball, toy, food_03, moneyS } from '../../svg.js';

const iconMap = {
  hatS,
  food_01,
  food_02,
  background,
  pallete,
  hat_02,
  ball,
  toy,
  food_03,
};

const InventoryContent = ({ setHappiness }) => {
  const [items, setItems] = useState([]);
  const [money, setMoney] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [hasHat, setHasHat] = useState(false);

  useEffect(() => {
    const fetchShopItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/shop');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching shop items:', error);
      }
    };
    fetchShopItems();
  }, []);

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/pet');
        const data = await response.json();
        if (data.length > 0) {
          setMoney(data[0].money);
          setInventory(data[0].inventory);
          setHasHat(data[0].hasHat || false); 
        } else {
          console.error('No data found');
        }
      } catch (error) {
        console.error('Error fetching pet data:', error);
      }
    };
    fetchPetData();
  }, []);

  const handleIconClick = async (item) => {
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
        alert(error.error || 'Failed to update item');
        return;
      }
  
      const updatedPet = await response.json();
      setInventory(updatedPet.pet.inventory);
  
      if (item.id !== 4) {
        const randomHappiness = Math.floor(Math.random() * 11) + 5; 
        await fetch('http://localhost:5000/api/pet/happiness', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ petId: 1, change: randomHappiness }),
        });
        setHappiness((prevHappiness) => prevHappiness + randomHappiness); 

      } else {
        setHasHat(!hasHat);
      }
    } catch (error) {
      console.error('Error making API call:', error);
    }
  };
  

  return (
    <div className="flex flex-1 justify-center items-start text-white">
      <div className="absolute top-20 left-2 flex items-center">
        <div className="flex items-center space-x-1">
          {moneyS()}
          <span className="text-2xl text-outline text-[#B957CE]">{money}</span>
        </div>
      </div>

      <div
        className="flex justify-center items-center"
        style={{
          backgroundColor: '#3A4E93',
          width: '100%',
          height: '350px',
          border: '2px solid #B957CE',
          marginTop: '240px',
        }}
      >
        <img
          src={hasHat ? 'https://i.postimg.cc/rmjLnk57/peshat.png' : 'https://i.postimg.cc/Qtkzv9T6/pess.png'}
          alt="Character"
          className="absolute"
          style={{
            top: '100px',
            left: '40%',
            width: '250px',
            height: 'auto',
          }}
        />

        {/* Inventory grid */}
        <div className="grid grid-cols-3 gap-x-36 gap-y-12 mt-30">
          {items.map((item, index) => {
            const IconComponent = iconMap[item.icon];
            const inventoryItem = inventory.find((inv) => inv.id === item.id);

            return (
              <div
                key={item.id || index}
                className={`relative w-16 h-16 rounded-full border-2 flex justify-center items-center cursor-pointer ${
                  item.id === 4 && hasHat ? 'border-green-500' : 'border-[#B957CE]'
                }`}
                onClick={() => handleIconClick(item)}
                title={item.name}
                style={{
                  backgroundColor: item.id === 4 && hasHat ? '#3A4E93' : 'transparent',
                }}
              >
                {IconComponent && <IconComponent />}
                <div
                  className="absolute top-0 right-0 w-6 h-6 rounded-full bg-[#B957CE] flex justify-center items-center"
                  style={{
                    fontSize: '0.8rem',
                    color: 'white',
                  }}
                >
                  {inventoryItem ? inventoryItem.count : 0}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InventoryContent;
