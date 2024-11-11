import React from 'react';
import { star, heart } from '../../svg'; 

const MainPage = () => {
  return (
    <div className=""> 
      {star()}
      <div className="flex items-center absolute top-24 left-16">
        <span
          className="text-[#B957CE] font-bold"
          style={{
            textShadow: '1px 1px 0px #B9E9E9, -1px -1px 0px #B9E9E9, 1px -1px 0px #B9E9E9, -1px 1px 0px #B9E9E9'
          }}
        >
          10/100
        </span>
      </div>

      <div className="flex space-x-2 absolute absolute top-20 right-4"> 
        {heart()}
        {heart()}
        {heart()}
      </div>
    </div>
  );
};

export default MainPage;
