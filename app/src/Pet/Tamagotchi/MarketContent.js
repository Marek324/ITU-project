import React from 'react';
import { money, yen } from '../../svg.js';

const MarketContent = () => {
  return (
    <div className="flex flex-1 justify-center items-start text-white">
      <div className="absolute top-20 left-2 flex items-center "> 
      <div className="flex top-20 left-2 items-center flex space-x-1"> 
        
        {money()} 
        <span className="text-2xl text-outline text-[#B957CE]">1200</span>
       </div>
      </div>
      <div
      // square
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
            top: '90px',  
            left: '40%',  
            width: '270px',  
            height: 'auto'
          }}
        />
<div className="grid grid-cols-3 gap-x-36 gap-y-12 mt-30">
  {Array.from({ length: 9 }).map((_, index) => (
    <div
      key={index}
      className="w-16 h-16 rounded-full border-2 border-[#B957CE] flex justify-center items-center"
    >
      {/* Placeholder content in the circles (can replace with icons or text) */}
      <span className="text-white">🔘</span>
    </div>
  ))}
</div>
</div>
</div>


  );
};

export default MarketContent;
