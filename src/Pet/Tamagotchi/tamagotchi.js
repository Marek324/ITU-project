import React, { useState } from 'react';
import './App.css'; 
import './index.css';
import GameContent from './GameContent.js';
import DownBar from '../components/DownBar.js';
import TopBar from '../components/TopBar.js';
import MainPage from '../components/MainPage.js';
import MarketContent from './MarketContent.js';
import { game, food, shop, hat, home, check, homeB } from '../../svg.js';

function App() {
  const [showGame, setShowGame] = useState(false);
  const [showMarket, setShowMarket] = useState(false);
  const [showHome, setShowHome] = useState(false);

  const handleGameClick = () => {
    setShowGame(true);
    setShowMarket(false); 
    setShowHome(false); 
  };

  const handleMarketClick = () => {
    setShowMarket(true);
    setShowGame(false); 
    setShowHome(false); 
  };

  const handleHomeClick = () => {
    setShowHome(true);
    setShowMarket(false);
    setShowGame(false); 
  };

  const backgroundStyle = showGame || showMarket 
    ? { backgroundColor: '#2A2356' } 
    : { backgroundImage: `url('https://i.postimg.cc/JznxpgQY/itukoza.jpg')` }; 

  const icons = showGame 
    ? { firstIcon: game(), secondIcon: homeB(), thirdIcon: shop() } 
    : showMarket 
    ? { firstIcon: hat(), secondIcon: home(), thirdIcon: check() } 
    : { firstIcon: game(), secondIcon: food(), thirdIcon: shop() }; 

  const iconsClick = showGame 
    ? { onFirstClick: handleGameClick, onSecondClick: handleHomeClick, onThirdClick: handleMarketClick } 
    : showMarket 
    ? { onFirstClick: handleMarketClick, onSecondClick: handleHomeClick, onThirdClick: handleMarketClick } 
    : { onFirstClick: handleGameClick, onSecondClick: handleHomeClick, onThirdClick: handleMarketClick };

  return (
    <div
      className="App min-h-screen flex flex-col bg-cover bg-center relative"
      style={backgroundStyle}
    >
      <TopBar title={showGame ? 'Games' : showMarket ? 'Market' : 'Pet'} /> {/* Dynamic title */}

      <header className="App-header flex-1 flex justify-center items-center">
        {showGame ? <GameContent setShowGame={setShowGame} /> : showMarket ? <MarketContent /> : <MainPage />}
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
