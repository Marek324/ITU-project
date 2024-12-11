export default class MergeModel {
    constructor(size = 4) {
        this.size = size;
        this.grid = this.createGrid();
        this.score = 0;
        this.gameOver = false;
		this.startGame();
    }

	startGame() {
		this.score = 0;
		this.gameOver = false;
		this.grid = this.createGrid();
		this.addRandomTile();
		this.addRandomTile();
	}

	move(direction) {
		if (this.gameOver) return;
		const moveMade = this.slideGrid(direction);
		if (!moveMade) return;
		this.addRandomTile();
		this.checkGameOver();
		this.grid.forEach(row => {
			row.forEach(cell => {
				if (cell !== null) {
					console.log(cell);
				}
			});
		});
		console.log("-------------------");
	}

	createGrid() {
		return Array.from({ length: this.size }, () =>
			Array.from({ length: this.size }, () =>
				null
			)
		);
	}

	addRandomTile() {
		const emptyPositions = this.grid.flatMap((row, i) =>
			row.map((cell, j) => cell === null ? [i, j] : null)
		).filter(pos => pos !== null);

		if (emptyPositions.length === 0) return;

		const [row, col] = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
		const value = this.score < 1250 ? 2 : Math.random() < 0.85 ? 2 : 4;
		const tile = new Tile(value, row, col);
		this.grid[row][col] = tile;
	}

	slideGrid(direction) {
		const oldGrid = JSON.stringify(this.grid.flat(2));

		switch (direction) {
			case "LEFT":
				this.grid = this.grid.map(row => this.slideRow(row));
				break;
			case "UP":
				this.transposeGrid();
				this.grid = this.grid.map(row => this.slideRow(row));
				this.transposeGrid();
				break;
			case "RIGHT":
				this.grid = this.grid.map(row => this.reverseRow(this.slideRow(this.reverseRow(row))));
				break;
			case "DOWN":
				this.transposeGrid();
				this.grid = this.grid.map(row => this.reverseRow(this.slideRow(this.reverseRow(row))));
				this.transposeGrid();
				break;
		}
		return oldGrid !== JSON.stringify(this.grid.flat(2));
	}

	slideRow(row) {
		let newRow = row.filter(cell => cell !== null);

		for (let i = 0; i < newRow.length - 1; i++) {
			if (newRow[i] && newRow[i + 1] && newRow[i].equals(newRow[i + 1])) {
				newRow[i].merge(newRow[i + 1]);
				this.score += newRow[i].value;
				newRow.splice(i + 1, 1);
			}
		}

		newRow.forEach((tile, index) => {
			tile.setPosition(tile.row, index);
		});

		while (newRow.length < row.length) {
			newRow.push(null);
		}

		return newRow;
	}

	checkGameOver() {
		if (this.grid.flat().includes(null)) return;

		for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				if (i < this.size - 1 && this.grid[i][j].equals(this.grid[i + 1][j])) return;
				if (j < this.size - 1 && this.grid[i][j].equals(this.grid[i][j + 1])) return;
			}
		}

		this.gameOver = true;
	}

	transposeGrid() {
		const transposedGrid = this.grid.map(row => [...row]);
		const len = this.grid.length;
		for (let i = 0; i < len; i++) {
			for (let j = i + 1; j < len; j++) {
				if (i === j) continue;
				const tmp = transposedGrid[i][j];
				transposedGrid[i][j] = transposedGrid[j][i];
				transposedGrid[j][i] = tmp;
				if (transposedGrid[i][j] !== null) transposedGrid[i][j].transposePosition();
				if (transposedGrid[j][i] !== null) transposedGrid[j][i].transposePosition();
			}
		}

		this.grid = transposedGrid;
	}

	reverseRow(tileRow) {
		const reversedRow = [...tileRow].reverse();
		reversedRow.forEach((tile, newIndex) => {
		if (tile) {
			tile.setPosition(tile.row, newIndex);
		}
		});
		return reversedRow;
	}
}

class Tile {
	constructor(value, row, col) {
		this.value = value;
		this.row = row;
		this.col = col;
		this.prevRow = row;
		this.prevCol = col;
		this.id = Math.random().toString(36).substring(2, 9);
	}

	setPosition(row, col) {
		this.prevRow = this.row;
		this.prevCol = this.col;
		this.row = row;
		this.col = col;
		this.animationProps = {
			created: true,
			destroyed: false,
			moved: false,
			merged: false
		}
	}

	transposePosition() {
		[this.row, this.col] = [this.col, this.row];
		[this.prevRow, this.prevCol] = [this.prevCol, this.prevRow];
	}

	setValue(value) {
		this.value = value;
	}

	equals(tile) {
		return this.value === tile.value;
	}

	merge(tile) {
		this.value *= 2;
		tile = null;
	}

	calculateAnimation() { // https://motion.dev/docs/react-quick-start

		const initial = {
			top: this.animationProps.moved ? `${this.prevRow * 8.5}rem` : `${this.row * 8.5}rem`,
			left: this.animationProps.moved ? `${this.prevCol * 8.5}rem` : `${this.col * 8.5}rem`,
			opacity: 1,
			scale: this.animationProps.merged ? 1.2 : this.animationProps.created ? 0 : 1,
		};

		  const animate = {
			top: `${this.row * 8.5}rem`,
			left: `${this.col * 8.5}rem`,
			opacity: this.animationProps.destroyed ? 1 : 0,
			scale: 1
		  };

		  // Update the previous row and column for future calculations
		  this.prevRow = this.row;
		  this.prevCol = this.col;

		  return { initial, animate };

		// let animation = [];
		// animation.push(`left-m${this.prevCol} top-m${this.prevRow}`);
		// if (this.row !== this.prevRow){
		// 	const rowOffset = this.row - this.prevRow;
		// 	animation.push(`${rowOffset < 0 ? "-" : ""}translate-y-m${Math.abs(rowOffset)}`);
		// 	this.prevRow = this.row;
		// }

		// if (this.col !== this.prevCol){
		// 	const colOffset = this.col - this.prevCol;
		// 	animation.push(`${colOffset < 0 ? "-" : ""}translate-x-m${Math.abs(colOffset)}`);
		// 	this.prevCol = this.col;
		// }

		// if (this.row !== this.prevRow){
		// 	animation.push(`translate-y-m${this.row}`);
		// 	this.prevRow = this.row;
		// } else {
		// 	animation.push(`translate-y-m${this.prevRow}`);
		// }

		// if (this.col !== this.prevCol){;
		// 	animation.push(`translate-x-m${this.col}`);
		// 	this.prevCol = this.col;
		// } else {
		// 	animation.push(`translate-x-m${this.prevCol}`);
		// }

		// return animation.join(" ");
	}
}
