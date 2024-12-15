/**
 * notification.js
 * Author: Petra Simonova xsimon30
 */
import React, { useEffect } from 'react';

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); 
      return () => clearTimeout(timer); 
    }
  }, [message, onClose]);

  return (
    <div
      style={{
        fontFamily: 'Pixelify Sans',
        position: 'fixed',
        bottom: '36px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#B957CE', 
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '5px',
        fontSize: '16px',
        zIndex: '9999',
        transition: 'opacity 0.3s ease',
      }}
    >
      {message}
    </div>
  );
};

export default Notification;
