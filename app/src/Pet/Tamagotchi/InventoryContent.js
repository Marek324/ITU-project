/**
 * InventoryContent.js
 * Author: Petra Simonova xsimon30
 */
import { hatS, food_01, food_02, background, pallete, hat_02, ball, toy, food_03, moneyS } from '../../svg.js';
import Notification from 'Pet/components/Notification.js';
import useInventoryController from 'Pet/Tamagotchi/Controllers/InventoryController.js';

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

const InventoryContent = ({ setHappiness, hasHat, setHasHat }) => {
  const { items, money, inventory, notification, closeNotification, handleIconClick } = useInventoryController(setHappiness, setHasHat);

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
        {notification && (
    <Notification
      message={notification.message}
      type={notification.type}
      onClose={closeNotification}
    />
  )}
      </div>
    </div>
  );
};

export default InventoryContent;
