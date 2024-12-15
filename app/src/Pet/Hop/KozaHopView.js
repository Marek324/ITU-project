import React from 'react';
import './KozaHop.css';
import dogImage from './Assets/pes.png';
import kozeImage from './Assets/koza.png';
import birdImage from './Assets/kozabhat.png';
import bg1Image from './Assets/bg.jpg';
import bg2Image from './Assets/bg1.jpg';
import bg3Image from './Assets/bg2.jpg';
import bg4Image from './Assets/bg3.jpg';
import { Shop } from './Shop';

class KozaHopView extends React.Component {
    getPlayerImage = (id) => {
        switch(id) {
            case 'koza':
                return kozeImage;
            case 'bird':
                return birdImage;
            case 'dog':
            default:
                return dogImage;
        }
    };

    getBackgroundImage = (id) => {
        switch(id) {
            case 'bg2':
                return bg2Image;
            case 'bg3':
                return bg3Image;
            case 'bg4':
                return bg4Image;
            case 'bg1':
            default:
                return bg1Image;
        }
    };

    calculateMoneyEarned = (score, difficulty) => {
        let multiplier;
        switch(difficulty) {
            case 'easy':
                multiplier = 0.5;
                break;
            case 'hard':
                multiplier = 1.5;
                break;
            case 'medium':
            default:
                multiplier = 1.0;
                break;
        }
        return Math.ceil(score * multiplier);
    }

    render() {
        const { 
            koza, 
            platforms, 
            gameOver, 
            score, 
            showDifficultySelect, 
            onSelectDifficulty, 
            highestScores,
            currentDifficulty,
            onToggleShop,
            showShop,
            currentPlayer,
            currentBg,
            onBuyItem,
            onSelectItem,
            boughtItems,
            money
        } = this.props;

        return (
            <>
                <div className="koza-hop-container" 
                     style={{
                         backgroundImage: `url(${this.getBackgroundImage(currentBg)})`,
                         backgroundSize: 'cover',
                         backgroundPosition: 'center'
                     }}>
                    {showDifficultySelect ? (
                        <div className="difficulty-select">
                            <h2 className="text-Pet_Text text-pet font-Pet_Title text-2xl"
                                style={{textShadow: '2px 2px 0 black'}}>
                                Select Difficulty
                            </h2>
                            <div className="difficulty-scores text-Pet_Text">
                                <p className="text-xl mb-2" style={{textShadow: '2px 2px 0 black'}}>
                                    Highest Scores:
                                </p>
                                <p className="text-lg" style={{textShadow: '2px 2px 0 black'}}>
                                    Easy: <span className="text-yellow-500">{highestScores.easy}</span>
                                </p>
                                <p className="text-lg" style={{textShadow: '2px 2px 0 black'}}>
                                    Medium: <span className="text-yellow-500">{highestScores.medium}</span>
                                </p>
                                <p className="text-lg" style={{textShadow: '2px 2px 0 black'}}>
                                    Hard: <span className="text-yellow-500">{highestScores.hard}</span>
                                </p>
                            </div>
                            <div className="difficulty-buttons">
                                <button 
                                    className={`font-Pet_Title ${currentDifficulty === 'easy' ? 'selected' : ''}`}
                                    onClick={() => onSelectDifficulty('easy')}
                                >
                                    Easy
                                </button>
                                <button 
                                    className={`font-Pet_Title ${currentDifficulty === 'medium' ? 'selected' : ''}`}
                                    onClick={() => onSelectDifficulty('medium')}
                                >
                                    Medium
                                </button>
                                <button 
                                    className={`font-Pet_Title ${currentDifficulty === 'hard' ? 'selected' : ''}`}
                                    onClick={() => onSelectDifficulty('hard')}
                                >
                                    Hard
                                </button>
                            </div>
                            <div className="shop-button" onClick={onToggleShop}>
                                <svg fill="#b9e9e9" width="62px" height="62px" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M891 308H340q-6 0-10.5-4t-5.5-10l-32-164q-2-14-12-22.5T256 99H110q-15 0-25.5 10.5T74 135v5q0 15 10.5 26t25.5 11h102q4 0 7 2.5t4 6.5l102 544q3 19 20 28 8 5 18 5h17q-22 25-21 58.5t25 56.5 57.5 23 58-23 25.5-56.5-22-58.5h186q-23 25-21.5 58.5T693 878t57.5 23 57.5-23 25-56.5-21-58.5h17q15 0 25.5-10.5T865 727v-8q0-15-11-25.5T828 683H409q-6 0-10.5-4t-5.5-9l-10-54q-1-8 4-14t12-5h460q13 0 22.5-8t11.5-21l33-219q3-16-7.5-28.5T891 308z"/>
                                </svg>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="score text-Pet_Text font-Pet_Title text-2xl"
                                 style={{textShadow: '2px 2px 0 black'}}>
                                Score: <span className="text-yellow-500">{score}</span>
                            </div>
                            <div className="game-area">
                                <div 
                                    className="player"
                                    style={{
                                        left: `${koza.left}px`,
                                        bottom: `${koza.bottom}px`,
                                        backgroundImage: `url(${this.getPlayerImage(currentPlayer)})`,
                                        backgroundSize: 'contain',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                />
                                {platforms.map((platform, index) => (
                                    <div
                                        key={index}
                                        className={`platform ${platform.isMoving ? 'moving' : ''} ${platform.hasSpikes ? `spiked-${platform.spikePosition}` : ''}`}
                                        style={{
                                            left: `${platform.left}px`,
                                            bottom: `${platform.bottom}px`,
                                            width: `${platform.width}px`,
                                            height: `${platform.height}px`
                                        }}
                                    />
                                ))}
                            </div>
                            {gameOver && (
                                <div className="game-over">
                                    <h2 className="text-Pet_Text text-pet font-Pet_Title text-2xl"
                                        style={{textShadow: '2px 2px 0 black'}}>
                                        Game Over!
                                    </h2>
                                    <p className="text-Pet_Text text-xl"
                                       style={{textShadow: '2px 2px 0 black'}}>
                                        Score: <span className="text-yellow-500">{score}</span>
                                    </p>
                                    <p className="text-Pet_Text text-xl mb-4"
                                       style={{textShadow: '2px 2px 0 black'}}>
                                        Money Earned: <span className="text-yellow-500">
                                            {this.calculateMoneyEarned(score, currentDifficulty)}¥
                                        </span>
                                    </p>
                                    <button 
                                        className="font-Pet_Title"
                                        onClick={this.props.onRestart}>
                                        Play Again
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {showShop && (
                    <Shop 
                        money={money}
                        onBuyItem={onBuyItem}
                        onSelectItem={onSelectItem}
                        boughtItems={boughtItems}
                        currentPlayer={currentPlayer}
                        currentBg={currentBg}
                        onClose={onToggleShop}
                    />
                )}
            </>
        );
    }
}

export default KozaHopView;