import React, { useEffect, useState } from 'react';
import { moneyS, hatS, food_01, food_02, background, pallete, hat_02, ball, toy, food_03 } from '../../svg.js';

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

const MarketContent = () => {
  const [items, setItems] = useState([]);
  const [money, setMoney] = useState(0);
  const [hasHat, setHasHat] = useState(false);
  const [tempPrice, setTempPrice] = useState(null); 
  const [showPriceAnimation, setShowPriceAnimation] = useState(false); 

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
  
    fetchShopMoney();
  }, []);
  

  const handleBuyItem = async (itemId, itemPrice) => {
    try {
      const response = await fetch('http://localhost:5000/api/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          petId: 1,  // Hardcoded petId
          itemId,  
        }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        alert(error.error); 
      } else {
        const updatedData = await response.json();
        console.log(updatedData);
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
          src={hasHat ? 'https://i.postimg.cc/rmjLnk57/peshat.png' : 'https://i.postimg.cc/GmC9sFNg/pess.png'}
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
        
            return (
              <div
                key={item.id || index}
                className="relative w-16 h-16 rounded-full border-2 border-[#B957CE] flex justify-center items-center cursor-pointer"
                onClick={() => handleBuyItem(item.id, item.price)} 
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
                  {item.price}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showPriceAnimation && tempPrice && (
        <div
          className="absolute top-36 left-2 text-2xl text-outline text-[#B957CE] animate-jump"
          style={{
           fontFamily: 'Pixelify Sans',
            fontSize: '2rem',
            transition: 'transform 0.5s ease',
            transform: showPriceAnimation ? 'translateY(0)' : 'translateY(-10px)',
          }}
        >
          -{tempPrice}
        </div>
      )}
    </div>
  );
};

export default MarketContent;
