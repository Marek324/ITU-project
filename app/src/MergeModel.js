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
		console.log(this.grid);
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

		while (newRow.length < row.length) {
			newRow.push(null);
		}

		newRow.forEach((tile, index) => {
			if (tile) tile.setPosition(tile.row, index);
		});

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
				if (transposedGrid[i][j] !== null) transposedGrid[i][j].setPosition(i, j);
				if (transposedGrid[j][i] !== null) transposedGrid[j][i].setPosition(j, i);
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
		this.prevRow = null;
		this.prevCol = null;
	}

	setPosition(row, col) {
		this.prevRow = this.row;
		this.prevCol = this.col;
		this.row = row;
		this.col = col;
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

	calculateAnimation() {
		if (this.prevRow === null || this.prevCol === null) return `top-m${this.row} left-m${this.col}`;
		const rowOffset = this.row - this.prevRow;
		const colOffset = this.col - this.prevCol;
		this.prevRow = this.row;
		this.prevCol = this.col;
		if (rowOffset === 0 && colOffset === 0) return "";

		if (rowOffset < 0) return `-translate-y-m${rowOffset}`;
		if (colOffset < 0) return `-translate-x-m${colOffset}`;
		return `translate-${colOffset !== 0 ? 'x' : 'y'}-m${colOffset !== 0 ? colOffset : rowOffset}`;
	}
}
