import {GetFP, UpdateFP} from "./services/FlappyPetService";

class FPModel {
	constructor() {
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
		this.topPos = 0;
		this.downBarOffset = 0;
		this.data = null;
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

	async fetchHighScore() {
		const data = await GetFP(0);
		this.setData(data);
		this.setHighScore(data.highscore);
	}

	async updateHighScore() {
		const updatedData = { ...this.data, highscore: this.score };
		UpdateFP(this.data.id, updatedData).then(() => {
			this.data(updatedData);
		});
	}

	setHighScore(newHighScore) {
		this.highScore = newHighScore;
	}

	setTitle(newTitle) {
		this.title = newTitle;
	}

	setSubtitle(newSubtitle) {
		this.subtitle = newSubtitle;
	}

	toggleLeaderboard() {
		this.setShowLeaderboard(!this.showLeaderboard);
		this.setShowPopup(!this.showLeaderboard);
	}

	setShowLeaderboard(show) {
		this.showLeaderboard = show;
	}

	setShowPopup(show) {
		this.showPopup = show;
	}

	setTopPos(pos) {
		this.topPos = pos;
	}

	setDownBarOffset(offset) {
		this.downBarOffset = offset;
	}

	setData(data) {
		this.data = data;
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
		this.obstacles.push({ topPos, topHeight, bottomPos, bottomHeight: window.innerHeight - bottomPos, left });
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
