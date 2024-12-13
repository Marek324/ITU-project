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

	async init() {
		const data = await GetFP(this.animalId);
		this.data = data;
		this.scores = data.leaderboards;
		this.highScore = data.highscore;
		this.colors = data.boughtColors;
		this.money = await GetMoney(data.id);
	}

	async updateHighScore() {
		const updatedData = {...this.data, highscore: this.score};
		await UpdateFP(this.data.id, updatedData);
		this.data = updatedData;
		this.highScore = updatedData.highscore;
		this.scores = updatedData.leaderboards;
	}


	toggleLeaderboard() {
		this.showLeaderboard = !this.showLeaderboard;
		this.showStore = false;
		this.showPopup = !this.showPopup;
	}

	toggleShop() {
		this.showStore = !this.showStore;
		this.showLeaderboard = false;
		this.showPopup = !this.showPopup;
	}

	buyColor(color) {
		if (this.money >= 100) {
			this.money -= 100;
			this.colors = this.colors.map(item =>
				item.color === color ? {...item, bought: true} : item
			);

			UpdatePetMoney(this.animalId, this.money).then(r => console.log(r));
			UpdatePetColors(this.animalId, this.colors).then(r => console.log(r));

			this.selectColor(color);
		} else {

			//něco na ukázání že nejsou penízky
			console.log('Not enough money');
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

	startGame() {
		this.score = 0;
		this.ballTopPos = window.innerHeight / 2;
		this.velocity = 0;
		this.obstacles = [];
		this.gameStarted = true;
		this.passedObstacles = [];
		this.showPopup = false;
	}

	stopGame() {
		this.gameStarted = false;
		this.showPopup = true;
		this.title = 'Game Over';
		this.subtitle = 'Restart Game';

		this.money += this.score;
		UpdatePetMoney(this.animalId, this.money).then(r => console.log(r));
	}

	jump() {
		this.velocity = -this.consts.maxVelocity * window.innerHeight * 0.002;
	}

	updatePosition() {
		this.velocity += this.consts.gravity * this.consts.timeInterval * 0.01 * window.innerHeight * 0.001;
		this.ballTopPos += this.velocity + 0.5 * this.consts.gravity * Math.pow(this.consts.timeInterval * 0.01, 2);
	}

	updateObstacles() {
		this.obstacles = this.obstacles.map(obstacle => {
			obstacle.left -= this.consts.obstSpeed;
			return obstacle;
		}).filter(obstacle => obstacle.left > -this.consts.obstRelativeWidth * (window.innerWidth * 0.01));
	}

	addObstacle(topPos) {
		const left = window.innerWidth;
		const topHeight = Math.floor(Math.random() * (window.innerHeight - this.downBarOffset - this.topPos - this.consts.gapSize - 50));
		const bottomPos = topHeight + this.consts.gapSize;
		this.obstacles.push({topPos, topHeight, bottomPos, bottomHeight: window.innerHeight - bottomPos, left});
	}

	checkCollision() {
		if (this.ballTopPos <= this.topBarRef.current.clientHeight || this.ballTopPos >= (window.innerHeight - this.downBarRef.current.clientHeight - this.ballRef.current.clientHeight)) {
			return true;
		}

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

			const horizontalOverlap = ballTopLeft <= obRight && ballTopRight >= obLeft;
			const verticalOverlap = ballTop <= obTop || ballBottom >= obBottom;

			if (horizontalOverlap && verticalOverlap) {
				return true;
			} else if (ballLeft > obRight && !this.passedObstacles.includes(ob)) {
				this.passedObstacles.push(ob);
				this.score += 1;
			}
		}
		return false;
	}
}

export default FPModel;
