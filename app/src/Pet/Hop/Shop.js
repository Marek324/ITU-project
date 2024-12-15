//Author: Matouš Jašek (xjasek18)
//File: Shop.js
//Description: Shop for Koza Hop game
import React, { useState } from 'react';
import dogImage from './Assets/pes.png';
import kozeImage from './Assets/koza.png';
import goatHatImage from './Assets/kozabhat.png';
import bg1Image from './Assets/bg.jpg';
import bg2Image from './Assets/bg1.jpg';
import bg3Image from './Assets/bg2.jpg';
import bg4Image from './Assets/bg3.jpg';

export const Shop = ({ money, onBuyItem, onSelectItem, boughtItems, currentPlayer, currentBg, onClose }) => {
    const [previewPlayer, setPreviewPlayer] = useState(currentPlayer);
    const [previewBg, setPreviewBg] = useState(currentBg);

    const players = [
        { id: 'dog', name: 'Dog', image: dogImage },
        { id: 'koza', name: 'Goat', image: kozeImage },
        { id: 'bird', name: 'Goat with Hat', image: goatHatImage }
    ];

    const backgrounds = [
        { id: 'bg1', name: 'Background 1', image: bg1Image },
        { id: 'bg2', name: 'Background 2', image: bg2Image },
        { id: 'bg3', name: 'Background 3', image: bg3Image },
        { id: 'bg4', name: 'Background 4', image: bg4Image }
    ];

    const getPlayerImage = (id) => {
        return players.find(p => p.id === id)?.image || dogImage;
    };

    const getBgImage = (id) => {
        return backgrounds.find(b => b.id === id)?.image || bg1Image;
    };

    return (
        <div className="shop-overlay">
            <div className="shop-content">
                <div className="close-button" onClick={onClose}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        width="30"
                        height="30"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </div>

                {/* Preview Section */}
                <div className="preview-section">
                    <div className="flex flex-col items-center justify-center mr-5 w-48">
                        <div className="preview-container" 
                             style={{
                                 backgroundImage: `url(${getBgImage(previewBg)})`,
                                 backgroundSize: 'cover',
                                 width: '200px',
                                 height: '150px',
                                 position: 'relative'
                             }}>
                            <img
                                src={getPlayerImage(previewPlayer)}
                                alt="preview"
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    position: 'absolute',
                                    bottom: '20px',
                                    left: '50%',
                                    transform: 'translateX(-50%)'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Shop Items Section */}
                <div className="shop-items">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-Pet_Text text-pet font-Pet_Title text-2xl mr-4"
                             style={{textShadow: '2px 2px 0 black'}}>
                            <span className="text-yellow-500">{money}¥</span>
                        </div>
                        <h2 className="text-Pet_Text text-pet font-Pet_Title text-2xl"
                            style={{textShadow: '2px 2px 0 black'}}>Shop</h2>
                    </div>

                    {/* Characters Section */}
                    <div className="mb-4">
                        <h3 className="text-Pet_Text text-pet text-xl mb-2"
                            style={{textShadow: '2px 2px 0 black'}}>Characters</h3>
                        <ul>
                            {players.map((player) => (
                                <li key={player.id} 
                                    className="text-subtext text-sm flex items-center justify-between mb-2"
                                    onMouseEnter={() => setPreviewPlayer(player.id)}
                                    onMouseLeave={() => setPreviewPlayer(currentPlayer)}>
                                    <span className="text-Pet_Text" style={{textShadow: '2px 2px 0 black'}}>
                                        {player.name}
                                    </span>
                                    {boughtItems.find(item => item.id === player.id)?.bought ? (
                                        <button 
                                            className="ml-2 text-Pet_Text hover:text-yellow-500"
                                            onClick={() => onSelectItem(player.id)}
                                            style={{textShadow: '2px 2px 0 black'}}>
                                            {currentPlayer === player.id ? 'Selected' : 'Select'}
                                        </button>
                                    ) : (
                                        <>
                                            <span style={{color: money >= 100 ? '#90EE90' : 'red'}}>
                                                - 100¥
                                            </span>
                                            <button 
                                                className="ml-2"
                                                onClick={() => onBuyItem(player.id)}
                                                disabled={money < 100}>
                                                Buy
                                            </button>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Backgrounds Section */}
                    <div>
                        <h3 className="text-Pet_Text text-pet text-xl mb-2"
                            style={{textShadow: '2px 2px 0 black'}}>Backgrounds</h3>
                        <ul>
                            {backgrounds.map((bg) => (
                                <li key={bg.id} 
                                    className="text-subtext text-sm flex items-center justify-between mb-2"
                                    onMouseEnter={() => setPreviewBg(bg.id)}
                                    onMouseLeave={() => setPreviewBg(currentBg)}>
                                    <span className="text-Pet_Text" style={{textShadow: '2px 2px 0 black'}}>
                                        {bg.name}
                                    </span>
                                    {boughtItems.find(item => item.id === bg.id)?.bought ? (
                                        <button 
                                            className="ml-2 text-Pet_Text hover:text-yellow-500"
                                            onClick={() => onSelectItem(bg.id)}
                                            style={{textShadow: '2px 2px 0 black'}}>
                                            {currentBg === bg.id ? 'Selected' : 'Select'}
                                        </button>
                                    ) : (
                                        <>
                                            <span style={{color: money >= 100 ? '#90EE90' : 'red'}}>
                                                - 100¥
                                            </span>
                                            <button 
                                                className="ml-2"
                                                onClick={() => onBuyItem(bg.id)}
                                                disabled={money < 100}>
                                                Buy
                                            </button>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}; 