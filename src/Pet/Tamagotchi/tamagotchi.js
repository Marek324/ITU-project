import React, { useState } from 'react';
import './App.css'; 
import './index.css';
import GameContent from './Pet/Tamagotchi/GameContent.js';
import DownBar from './Pet/components/DownBar.js';
import TopBar from './Pet/components/TopBar.js';
import MainPage from './Pet/components/MainPage.js';
import MarketContent from './Pet/Tamagotchi/MarketContent.js';
import InventoryContent from './Pet/Tamagotchi/InventoryContent.js';
import { game, food, shop, hat, home, check, homeB, shopP } from './svg.js';

function App() {
  const [showGame, setShowGame] = useState(false);
  const [showMarket, setShowMarket] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [showInventory, setShowInventory] = useState(false);

  const handleGameClick = () => {
    setShowGame(true);
    setShowMarket(false); 
    setShowHome(false); 
    setShowInventory(false);
  };

  const handleMarketClick = () => {
    setShowMarket(true);
    setShowGame(false); 
    setShowHome(false); 
    setShowInventory(false);
  };

  const handleInventoryClick = () => {
    setShowInventory(true);
    setShowMarket(false);
    setShowGame(false); 
    setShowHome(false); 
  };

  const handleHomeClick = () => {
    setShowHome(true);
    setShowMarket(false);
    setShowGame(false); 
    setShowInventory(false);
  };

  const backgroundStyle = (showGame || showMarket || showInventory) 
    ? { backgroundColor: '#2A2356' }  
    : { backgroundImage: `url('https://i.postimg.cc/JznxpgQY/itukoza.jpg')` };  

  const icons = showGame 
    ? { firstIcon: game(), secondIcon: homeB(), thirdIcon: shop() } 
    : showMarket || showInventory 
    ? { firstIcon: showInventory ? shopP() : hat(), secondIcon: home(), thirdIcon: check() }  
    : { firstIcon: game(), secondIcon: food(), thirdIcon: shop() }; 

  const iconsClick = showGame 
    ? { onFirstClick: handleGameClick, onSecondClick: handleHomeClick, onThirdClick: handleMarketClick } 
    : showMarket || showInventory 
    ? { onFirstClick: showInventory ? handleMarketClick : handleInventoryClick, onSecondClick: handleHomeClick, onThirdClick: handleMarketClick } 
    : { onFirstClick: handleGameClick, onSecondClick: handleHomeClick, onThirdClick: handleMarketClick };

  return (
    <div
      className="App min-h-screen flex flex-col bg-cover bg-center relative"
      style={backgroundStyle}
    >
      <TopBar title={showGame ? 'Games' : showMarket ? 'Market' : showInventory ? 'Inventory' : 'Pet'} />

      <header className="App-header flex-1 flex justify-center items-center">
        {showGame ? (
          <GameContent setShowGame={setShowGame} />
        ) : showMarket ? (
          <MarketContent />
        ) : showInventory ? (
          <InventoryContent />
        ) : (
          <MainPage />
        )}
      </header>

      <DownBar 
        onFirstClick={iconsClick.onFirstClick} 
        onSecondClick={iconsClick.onSecondClick}
        onThirdClick={iconsClick.onThirdClick}
        firstIcon={icons.firstIcon} 
        secondIcon={icons.secondIcon} 
        thirdIcon={icons.thirdIcon} 
      />
    </div>
  );
}

export default App;
