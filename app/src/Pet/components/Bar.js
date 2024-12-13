import React from 'react';

const Bar = ({ value, label, color, labelColor }) => {
  return (
    <div className="w-full flex flex-col items-center">
     <span
        className="bar-label"
        style={{
          fontFamily: 'Pixelify Sans',
          color: labelColor || '#B9E9E9', 
          display: 'block', 
          marginBottom: '4px', 
        }}
      >
        {label}
      </span>     
      <div className="w-full h-4 rounded-full overflow-hidden" style={{ backgroundColor: '#B9E9E9' }}>     
        <div
          className="h-full"
          style={{
            width: `${value}%`,
            backgroundColor: color,
            transition: 'width 0.3s ease',
          }}
        ></div>
      </div>
    </div>
  );
};

export default Bar;
