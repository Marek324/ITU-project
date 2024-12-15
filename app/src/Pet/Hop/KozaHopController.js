import React from 'react';
import KozaHopModel from './KozaHopModel';
import KozaHopView from './KozaHopView';
import { getHighestScore, saveScore } from '../../services/HopService';
import { GetMoney, UpdatePetMoney } from '../../services/GameService';

class GameHop extends React.Component {
    constructor(props) {
        super(props);
        this.model = new KozaHopModel();
        this.state = {
            koza: { ...this.model.koza },
            platforms: [...this.model.platforms],
            gameOver: this.model.gameOver,
            score: this.model.score,
            showDifficultySelect: true,
            highestScores: {
                easy: 0,
                medium: 0,
                hard: 0
            },
            currentDifficulty: null,
            gameStarted: false,
            showShop: false,
            money: 0,
            boughtItems: [],
            currentPlayer: 'dog',
            currentBg: 'bg1'
        };
        this.gameLoop = null;
    }

    async componentDidMount() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        
        try {
            // Fetch highest scores, money and inventory
            const [easyScore, mediumScore, hardScore, money, inventoryResponse] = await Promise.all([
                getHighestScore('easy'),
                getHighestScore('medium'),
                getHighestScore('hard'),
                GetMoney(this.props.animalId || 1),
                fetch(`http://localhost:5000/api/doodlejump/inventory/${this.props.animalId || 1}`)
            ]);

            const inventory = await inventoryResponse.json();
            
            // Convert inventory arrays to boughtItems format
            const boughtItems = [
                ...inventory.characters.map(id => ({ id, bought: true })),
                ...inventory.backgrounds.map(id => ({ id, bought: true }))
            ];

            this.setState({
                highestScores: {
                    easy: easyScore?.height || 0,
                    medium: mediumScore?.height || 0,
                    hard: hardScore?.height || 0
                },
                money: money || 0,
                boughtItems,
                currentPlayer: inventory.currentCharacter,
                currentBg: inventory.currentBackground
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    componentWillUnmount() {
        this.stopGame();
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }

    handleToggleShop = () => {
        this.setState(prevState => ({
            showShop: !prevState.showShop
        }));
    }

    handleBuyItem = async (itemId) => {
        const { money, boughtItems } = this.state;
        
        // Check if already bought
        if (boughtItems.some(item => item.id === itemId && item.bought)) {
            return;
        }

        // Check if enough money
        if (money < 100) {
            return;
        }

        try {
            // Determine item type
            const itemType = itemId.startsWith('bg') ? 'background' : 'character';

            // Send buy request to new endpoint
            const response = await fetch('http://localhost:5000/api/doodlejump/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    petId: this.props.animalId || 1,
                    itemId,
                    itemType
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Buy error:', error);
                return;
            }

            const data = await response.json();

            // Update state with new inventory and money
            this.setState({
                money: data.money,
                boughtItems: [
                    ...data.inventory.characters.map(id => ({ id, bought: true })),
                    ...data.inventory.backgrounds.map(id => ({ id, bought: true }))
                ]
            });
        } catch (error) {
            console.error('Error buying item:', error);
        }
    }

    handleSelectItem = async (itemId) => {
        // Check if item is bought
        if (!this.state.boughtItems.some(item => item.id === itemId && item.bought)) {
            return;
        }

        try {
            // Determine item type
            const itemType = itemId.startsWith('bg') ? 'background' : 'character';

            // Send selection request to new endpoint
            const response = await fetch('http://localhost:5000/api/doodlejump/select', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    petId: this.props.animalId || 1,
                    itemId,
                    itemType
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Selection error:', error);
                return;
            }

            const inventory = await response.json();

            // Update state with new selections
            this.setState({
                currentPlayer: inventory.currentCharacter,
                currentBg: inventory.currentBackground
            });
        } catch (error) {
            console.error('Error selecting item:', error);
        }
    }

    handleDifficultySelect = (difficulty) => {
        this.model.setDifficulty(difficulty);
        this.setState({ 
            currentDifficulty: difficulty,
            showDifficultySelect: false,
            gameStarted: true,
            showShop: false
        }, () => {
            this.startGame();
        });
    }

    startGame = () => {
        this.model.initGame();
        this.setState({
            koza: { ...this.model.koza },
            platforms: [...this.model.platforms],
            gameOver: false,
            score: 0
        });
        this.gameLoop = setInterval(this.updateGame, 16);
    }

    stopGame = () => {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }

    updateGame = () => {
        this.model.update();
        
        this.setState({
            koza: { ...this.model.koza },
            platforms: [...this.model.platforms],
            gameOver: this.model.gameOver,
            score: this.model.score
        });

        if (this.model.gameOver) {
            this.handleGameOver();
        }
    }

    handleKeyDown = (event) => {
        switch (event.key) {
            case 'ArrowLeft':
                this.model.setMovement('left', true);
                break;
            case 'ArrowRight':
                this.model.setMovement('right', true);
                break;
            default:
                break;
        }
    }

    handleKeyUp = (event) => {
        switch (event.key) {
            case 'ArrowLeft':
                this.model.setMovement('left', false);
                break;
            case 'ArrowRight':
                this.model.setMovement('right', false);
                break;
            default:
                break;
        }
    }

    handleRestart = () => {
        this.setState({
            showDifficultySelect: true,
            currentDifficulty: null,
            score: 0,
            gameOver: false
        });
    }

    handleGameOver = async () => {
        this.stopGame();

        const { score, currentDifficulty } = this.state;

        // Calculate money earned based on difficulty multiplier
        let moneyMultiplier;
        switch(currentDifficulty) {
            case 'easy':
                moneyMultiplier = 0.5;
                break;
            case 'hard':
                moneyMultiplier = 1.5;
                break;
            case 'medium':
            default:
                moneyMultiplier = 1.0;
                break;
        }

        // Calculate money earned (rounded up)
        const moneyEarned = Math.ceil(score * moneyMultiplier);

        try {
            // Save the score
            await saveScore(score, currentDifficulty);

            // Update money in the database
            const currentMoney = await GetMoney(this.props.animalId || 1);
            const newMoney = currentMoney + moneyEarned;
            await UpdatePetMoney(this.props.animalId || 1, newMoney);

            // Update state with new money amount
            this.setState({ money: newMoney });
        } catch (error) {
            console.error('Error updating score and money:', error);
        }
    }

    render() {
        return (
            <KozaHopView
                koza={this.state.koza}
                platforms={this.state.platforms}
                gameOver={this.state.gameOver}
                score={this.state.score}
                showDifficultySelect={this.state.showDifficultySelect}
                onSelectDifficulty={this.handleDifficultySelect}
                onRestart={this.handleRestart}
                highestScores={this.state.highestScores}
                currentDifficulty={this.state.currentDifficulty}
                onToggleShop={this.handleToggleShop}
                showShop={this.state.showShop}
                money={this.state.money}
                boughtItems={this.state.boughtItems}
                currentPlayer={this.state.currentPlayer}
                currentBg={this.state.currentBg}
                onBuyItem={this.handleBuyItem}
                onSelectItem={this.handleSelectItem}
            />
        );
    }
}

export default GameHop;