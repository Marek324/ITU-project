import React from 'react';
import { money } from '../../svg.js';

const InventoryContent = () => {
  return (
    <div className="flex flex-1 justify-center items-start text-white">
      <div className="absolute top-20 left-2 flex items-center "> 
      <div className="flex top-20 left-2 items-center flex space-x-1"> 
        
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
          src="https://i.postimg.cc/kGxYnpp1/kozachat.png" 
          alt="Character" 
          className="absolute"
          style={{
            top: '110px', 
            left: '42%',  
            width: '200px',  
            height: 'auto'
          }}
        />
      </div>
    </div>
  );
};

export default InventoryContent;
