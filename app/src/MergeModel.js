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
		this.slideGrid(direction);
		this.checkGameOver();
		this.addRandomTile();
	}

    createGrid() { // Create a square grid of size x size
        return Array.from({ length: this.size }, () => Array(this.size).fill(0));
    }

    addRandomTile() {
		const emptyPositions = this.grid.flatMap((row, i) =>
			row.map((cell, j) => cell === 0 ? [i, j] : null)
		).filter(pos => pos !== null);

		if (emptyPositions.length === 0) return;

		const [row, col] = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
		const value = this.score < 1250 ? 2 : Math.random() < 0.85 ? 2 : 4;
		this.grid[row][col] = value;
    }

	slideGrid(direction) {
		if (direction === "UP" || direction === "DOWN") {
			this.grid = transpose(this.grid);
			if (direction === "UP") {
				this.grid = this.grid.map(row => this.slideRow(row));
			} else {
				this.grid = this.grid.map(row => this.slideRow(row.reverse()).reverse());
			}
			this.grid = transpose(this.grid);
		} else {
			if (direction === "LEFT") {
				this.grid = this.grid.map(row => this.slideRow(row));
			} else {
				this.grid = this.grid.map(row => this.slideRow(row.reverse()).reverse());
			}
		}
	}

	slideRow(row) {
		// Step 1: Remove zeros and keep the numbers
		console.log(row);
		let newRow = row.filter(cell => cell !== 0);
		console.log(newRow);

		// Step 2: Merge adjacent numbers if they are the same
		for (let i = 0; i < newRow.length - 1; i++) {
			if (newRow[i] === newRow[i + 1]) {
				newRow[i] *= 2;        // Double the number
				newRow.splice(i + 1, 1); // Remove the merged number
			}
		}
		console.log(newRow);

		// Step 3: Fill with zeros to make the array the original size
		while (newRow.length < row.length) {
			newRow.push(0);
		}

		console.log(newRow);

		return newRow;
	}

    checkGameOver() {
        // check if game is over
    }
}

function transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}
