import React from 'react';
import { hatS, food_01, food_02, background, pallete,  hat_02, ball, toy, food_03, moneyS} from '../../svg.js';
import { useState, useEffect } from 'react';

  const iconMap = {hatS,
    food_01,
    food_02,
    background,
    pallete,
    hat_02,
    ball,
    toy,
    food_03,
  };
const InventoryContent = () => {

  const [items, setItems] = useState([]);
  const [money, setMoney] = useState(0);
  const [inventory, setInventory] = useState([]);

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
    const fetchShopMoney = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/pet');
        const data = await response.json();
        console.log(data); 
        if (data.length > 0) {
          setMoney(data[0].money); 
          setInventory(data[0].inventory); 

        } else {
          console.error('No data found');
        }
      } catch (error) {
        console.error('Error fetching money:', error);
      }
    };
  
    fetchShopMoney();
  }, []);
  

  return (
    <div className="flex flex-1 justify-center items-start text-white">
      <div className="absolute top-20 left-2 flex items-center">
        <div className="flex top-20 left-2 items-center space-x-1">
        {moneyS()}
          <span className="text-2xl text-outline text-[#B957CE]">
          {money}
          </span>
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
          src="https://i.postimg.cc/rmjLnk57/peshat.png"
          alt="Character"
          className="absolute"
          style={{
            top: '100px',
            left: '40%',
            width: '250px',
            height: 'auto',
          }}
        />

<div className="grid grid-cols-3 gap-x-36 gap-y-12 mt-30">
{items.map((item, index) => {
  const IconComponent = iconMap[item.icon];
  const inventoryItem = inventory.find((inv) => inv.id === item.id);

  const handleIconClick = () => {
    console.log(`Clicked on ${item.name} with ID: ${item.id}`);
    alert(`You clicked on ${item.name}. Inventory count: ${inventoryItem ? inventoryItem.count : 0}`);
  };

  return (
    <div
      key={item.id || index}
      className="relative w-16 h-16 rounded-full border-2 border-[#B957CE] flex justify-center items-center cursor-pointer"
      onClick={handleIconClick} 
      title={item.name} 
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
