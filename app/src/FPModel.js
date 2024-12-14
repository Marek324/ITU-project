import {GetLeaderboards, GetFP, UpdateFP, UpdatePetColors} from "./services/FlappyPetService";
import {GetMoney, UpdatePetMoney} from "./services/GameService";

class FPModel {
	constructor(animalId) {
		this.animalId = animalId;
		this.score = 0;
		this.highScore = 0;
		this.ballTopPos = window.innerHeight / 2;
		this.velocity = 0;
		this.obstacles = [];
		this.gameStarted = false;
		this.passedObstacles = [];
		this.ballRef = null;
		this.topBarRef = null;
		this.downBarRef = null;
		this.title = 'Flappy Pet';
		this.subtitle = 'Start Game';
		this.showLeaderboard = false;
		this.showPopup = true;
		this.showStore = false;
		this.topPos = 0;
		this.downBarOffset = 0;
		this.data = null;
		this.scores = [];
		this.colors = [];
		this.money = 0;
		this.equippedColor = 'Default';
		this.consts = {
			timeInterval: 10,
			gravity: 5,
			obstRelativeWidth: 5,
			ballLeftPos: 10,
			gapSize: window.innerHeight * 0.28,
			spawnInterval: 2000,
			obstSpeed: window.innerWidth * 0.0022,
			maxVelocity: window.innerHeight * 0.004
		};
	}

	//Data initialization
	async init() {
		const data = await GetFP(this.animalId);
		this.data = data;
		this.scores = data.leaderboards;
		this.highScore = data.highscore;
		this.colors = data.boughtColors;
		console.log(data.boughtColors);
		this.money = await GetMoney(data.id);
	}

	//Updating highscore
	async updateHighScore() {
		//Delete old player score from leaderboards and add a new one
		const updatedLeaderboards = this.scores.filter(entry => entry.name !== 'Player');
		updatedLeaderboards.push({name: 'Player', score: this.score});
		updatedLeaderboards.sort((a, b) => b.score - a.score);

		//Update data
		const updatedData = {
			...this.data,
			highscore: this.score,
			leaderboards: updatedLeaderboards
		};

		//Send data to the server
		await UpdateFP(this.data.id, updatedData);
		this.data = updatedData;
		this.highScore = updatedData.highscore;
		this.scores = updatedData.leaderboards;
	}

	//Show or hide leaderboard
	toggleLeaderboard() {
		this.showLeaderboard = !this.showLeaderboard;
		this.showStore = false;
		this.showPopup = !this.showStore && !this.showLeaderboard;
	}

	//Show or hide shop
	toggleShop() {
		this.showStore = !this.showStore;
		this.showLeaderboard = false;
		this.showPopup = !this.showStore && !this.showLeaderboard;
	}

	//Buying a new color
	buyColor(color) {
		if (this.money >= 100) {
			this.money -= 100;
			this.colors = this.colors.map(item =>
				item.color === color ? {...item, bought: true} : item
			);

			//Sending data to the server
			UpdatePetMoney(this.animalId, this.money).then(r => console.log(r));
			UpdatePetColors(this.animalId, this.colors).then(r => console.log(r));

			//Update selected color
			this.selectColor(color);
		}
	}

	selectColor(color) {
		this.equippedColor = color;
	}

	setTopPos(pos) {
		this.topPos = pos;
	}

	setDownBarOffset(offset) {
		this.downBarOffset = offset;
	}

	//Setting variables for start of the game
	startGame() {
		this.score = 0;
		this.ballTopPos = window.innerHeight / 2;
		this.velocity = 0;
		this.obstacles = [];
		this.gameStarted = true;
		this.passedObstacles = [];
		this.showPopup = false;
	}

	//Stopping the game
	stopGame() {
		//Putting this here to avoid a bug where this would be called multiple times
		if (!this.gameStarted) {
			return;
		}
		this.gameStarted = false;
		this.showPopup = true;
		this.title = 'Game Over';
		this.subtitle = 'Restart Game';

		//Money will increase based on the score
		this.money += this.score;
		//Sending the new money to the server
		UpdatePetMoney(this.animalId, this.money).then(r => console.log(r));
	}

	jump() {
		this.velocity = -this.consts.maxVelocity * window.innerHeight * 0.002;
	}

	//Updating the ball position based on velocity and gravity
	updatePosition() {
		this.velocity += this.consts.gravity * this.consts.timeInterval * 0.01 * window.innerHeight * 0.001;
		this.ballTopPos += this.velocity + 0.5 * this.consts.gravity * Math.pow(this.consts.timeInterval * 0.01, 2);
	}

	//Updating positions of all obstacles
	updateObstacles() {
		this.obstacles = this.obstacles.map(obstacle => {
			obstacle.left -= this.consts.obstSpeed;
			return obstacle;
		}).filter(obstacle => obstacle.left > -this.consts.obstRelativeWidth * (window.innerWidth * 0.01));
	}

	//Creating new obstacles
	addObstacle(topPos) {
		const left = window.innerWidth;
		const topHeight = Math.floor(Math.random() * (window.innerHeight - this.downBarOffset - this.topPos - this.consts.gapSize - 50));
		const bottomPos = topHeight + this.consts.gapSize;
		this.obstacles.push({topPos, topHeight, bottomPos, bottomHeight: window.innerHeight - bottomPos, left});
	}

	//Checking for collisions
	checkCollision() {
		//Collision with top or bottom of the screen
		if (this.ballTopPos <= this.topBarRef.current.clientHeight || this.ballTopPos >= (window.innerHeight - this.downBarRef.current.clientHeight - this.ballRef.current.clientHeight)) {
			return true;
		}

		//Collision with obstacles
		for (let ob of this.obstacles) {
			const obWidth = this.consts.obstRelativeWidth * (window.innerWidth * 0.01);
			const obLeft = ob.left - (obWidth * 0.5);
			const obRight = ob.left + (obWidth * 0.5);
			const obTop = ob.topHeight + this.topBarRef.current.clientHeight;
			const obBottom = ob.bottomPos;
			const ballLeft = window.innerWidth * 0.01 * this.consts.ballLeftPos;
			const ballTopLeft = ballLeft - this.ballRef.current.clientWidth * 0.5;
			const ballTopRight = ballLeft + this.ballRef.current.clientWidth * 0.5;
			const ballTop = this.ballTopPos;
			const ballBottom = this.ballTopPos + this.ballRef.current.clientHeight;

			//Checking for overlap
			const horizontalOverlap = ballTopLeft <= obRight && ballTopRight >= obLeft;
			const verticalOverlap = ballTop <= obTop || ballBottom >= obBottom;

			if (horizontalOverlap && verticalOverlap) {
				return true;
			} else if (ballLeft > obRight && !this.passedObstacles.includes(ob)) { //Passed obstacle
				this.passedObstacles.push(ob);
				this.score += 1;
			}
		}
		return false;
	}
}

export default FPModel;
