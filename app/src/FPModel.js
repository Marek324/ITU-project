class FPModel {
	constructor() {
		this.score = 0;
		this.highScore = 0;
		this.ballTopPos = window.innerHeight / 2;
		this.velocity = 0;
		this.obstacles = [];
		this.gameStarted = false;
		this.passedObstacles = [];
	}

	init(data) {
		this.highScore = data.highScore();
	}

	startGame() {
		this.score = 0;
		this.ballTopPos = window.innerHeight / 2;
		this.velocity = 0;
		this.obstacles = [];
		this.gameStarted = true;
		this.passedObstacles = [];
	}

	stopGame() {
		this.gameStarted = false;
	}

	jump(maxVelocity) {
		this.velocity = -maxVelocity * window.innerHeight * 0.003;
	}
	updatePosition(consts) {
		this.velocity += consts.gravity * consts.timeInterval * 0.01 * window.innerHeight * 0.001;
		this.ballTopPos += this.velocity + 0.5 * consts.gravity * Math.pow(consts.timeInterval * 0.01, 2);
	}

	updateObstacles(obstSpeed, consts) {
		this.obstacles = this.obstacles.map(obstacle => {
			obstacle.left -= obstSpeed;
			return obstacle;
		}).filter(obstacle => obstacle.left > -consts.obstRelativeWidth * (window.innerWidth * 0.01));
	}

	addObstacle(topPos, topHeight, bottomPos, gapSize) {
		const left = window.innerWidth;
		this.obstacles.push({ topPos, topHeight, bottomPos, bottomHeight: window.innerHeight - bottomPos, left });
	}

	checkCollision(ballRef, topPos, downBarOffset) {
		if (this.ballTopPos <= topPos || this.ballTopPos >= (window.innerHeight - downBarOffset - ballRef.current.clientHeight)) {
			return true;
		}

		for (let ob of this.obstacles) {
			const obWidth = consts.obstRelativeWidth * (window.innerWidth * 0.01);
			const obLeft = ob.left - (obWidth * 0.5);
			const obRight = ob.left + (obWidth * 0.5);
			const obTop = ob.topHeight + topPos;
			const obBottom = ob.bottomPos;
			const ballLeft = window.innerWidth * 0.01 * consts.ballLeftPos;
			const ballTopLeft = ballLeft - ballRef.current.clientWidth * 0.5;
			const ballTopRight = ballLeft + ballRef.current.clientWidth * 0.5;
			const ballTop = this.ballTopPos;
			const ballBottom = this.ballTopPos + ballRef.current.clientHeight;

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
