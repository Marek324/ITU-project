import React, { useEffect, useState } from 'react';
import { money, yen, hatS, food_01, food_02, background, pallete } from '../../svg.js';

const iconMap = {
  hatS,
  food_01,
  food_02,
  background,
  pallete,
  yen,
};

const MarketContent = () => {
  const [items, setItems] = useState([]);

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

  return (
    <div className="flex flex-1 justify-center items-start text-white">
      <div className="absolute top-20 left-2 flex items-center">
        <div className="flex top-20 left-2 items-center space-x-1">
        {money()}
          <span className="text-2xl text-outline text-[#B957CE]">1200</span>
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

            return (
              <div
                key={item.id || index}
                className="relative w-16 h-16 rounded-full border-2 border-[#B957CE] flex justify-center items-center"
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
    </div>
  );
};

export default MarketContent;
