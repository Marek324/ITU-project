/**
 * tamagotchi.js
 * Author: Petra Simonova xsimon30
 */
import React, { useState } from 'react';
import GameContent from 'Pet/Tamagotchi/GameContent.js';
import DownBar from 'Pet/components/DownBar.js';
import TopBar from 'Pet/components/TopBar.js';
import MarketContent from 'Pet/Tamagotchi/MarketContent.js';
import InventoryContent from 'Pet/Tamagotchi/InventoryContent.js';
import Bar from 'Pet/components/Bar.js';
import { game, food, shop, hat, home, gameP, homeB, shopping_cart, hatB } from 'svg.js';
import { useEffect } from 'react';

function Tamagotchi() {
  const [showGame, setShowGame] = useState(false);
  const [showMarket, setShowMarket] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [happiness, setHappiness] = useState(100);
  const [hasHat, setHasHat] = useState(false);

  const handleHatChange = (newHasHat) => {
    setHasHat(newHasHat);
  };

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/pet');
        const data = await response.json();
        if (data.length > 0) {
          setHappiness(data[0].happiness);
          setHasHat(data[0].hasHat || false); 
        } else {
          console.error('No data found');
        }
      } catch (error) {
        console.error('Error fetching pet data:', error);
      }
    };
    fetchPetData();
  }, []);

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
  : hasHat
  ? { backgroundImage: `url('https://i.postimg.cc/tThM7HVM/pesbgh.png')` } 
  : { backgroundImage: `url('https://i.postimg.cc/sXdFD24k/pes3.png')` }; 


  const icons = showGame
    ? { firstIcon: shop(), secondIcon: homeB(), thirdIcon: hatB() }
    : showMarket || showInventory
    ? { firstIcon: showInventory ? shopping_cart() : hat(), secondIcon: home(), thirdIcon: gameP() }
    : { firstIcon: shop(),  secondIcon: game(), thirdIcon: hatB() };

  const iconsClick = showGame
    ? { onFirstClick: handleMarketClick, onSecondClick: handleHomeClick, onThirdClick: handleInventoryClick }
    : showMarket || showInventory
    ? { onFirstClick: showInventory ? handleMarketClick : handleInventoryClick, onSecondClick: handleHomeClick, onThirdClick: handleGameClick }
    : { onFirstClick: handleMarketClick, onSecondClick: handleGameClick, onThirdClick: handleInventoryClick };

  return (
    <div
      className="App min-h-screen flex flex-col bg-cover bg-center relative"
      style={backgroundStyle}
    >
    <TopBar title={showGame ? 'Games' : showMarket ? 'Market' : showInventory ? 'Inventory' : 'Pet'} />

    <div
    className="absolute top-[68px] right-[16px]"
    style={{
      width: '120px', 
      height: '20px', 
    }}
  >
<Bar label="Happiness" value={happiness} color="#B957CE" labelColor="#B9E9E9" />
  </div>

		<DownBar
			onFirstClick={iconsClick.onFirstClick}
			onSecondClick={iconsClick.onSecondClick}
			onThirdClick={iconsClick.onThirdClick}
			firstIcon={icons.firstIcon}
			secondIcon={icons.secondIcon}
			thirdIcon={icons.thirdIcon}
		/>

    <header className="App-header flex-1 flex justify-center items-center">
      {showGame ? (
        <GameContent setShowGame={setShowGame} setHappiness={setHappiness} />
      ) : showMarket ? (
        <MarketContent />
      ) : showInventory ? (
        <InventoryContent
          setHappiness={setHappiness}
          hasHat={hasHat}
          setHasHat={handleHatChange}
        />
      ) : null}
    </header>
    </div>
  );
}

export default Tamagotchi;
