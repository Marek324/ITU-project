/**
 * MergeModel.js
 * Author: Marek Hric xhricma00
 */

export default class MergeModel {
    constructor(size = 4) {
        this.size = size;
        this.grid = this.createGrid();
		this.prevGrid = null;
        this.score = 0;
        this.gameOver = false;
		this.powerups = {
			undoMove: 2,
			deleteTile: 1,
			swapTiles: 0,
			deleteTilesByNumber: 0
		}
		this.startGame();
    }

	startGame() {
		this.score = 0;
		this.powerups = {
			undoMove: 2,
			deleteTile: 1,
			swapTiles: 0,
			deleteTilesByNumber: 0
		}
		this.gameOver = false;
		this.grid = this.createGrid();
		this.prevGrid = null;
		this.addRandomTile();
		this.addRandomTile();
	}

	move(direction) {
		if (this.gameOver) return;
		const tmpGrid = JSON.parse(JSON.stringify(this.grid.map(row =>
			row.map(tile => tile ? new Tile(tile.value, tile.row, tile.col) : null)
		)));
		const moveMade = this.slideGrid(direction);
		if (!moveMade) {
			return;
		}
		this.prevGrid = tmpGrid;
		console.log(this.prevGrid);
		this.updateTiles();
		this.addRandomTile();
		this.checkGameOver();
	}

	createGrid() {
		return Array.from({ length: this.size }, () =>
			Array.from({ length: this.size }, () =>
				null
			)
		);
	}

	updateTiles() {
		this.grid.forEach(row => {
			row.forEach(cell => {
				if (cell) {
					cell.recalculateAnimation()
				}
			});
		});
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
		const oldGrid = JSON.stringify(this.grid.flat(1).map(tile =>
			tile ? { value: tile.value, row: tile.row, col: tile.col } : null
		));

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
		const newGrid = JSON.stringify(this.grid.flat(1).map(tile =>
			tile ? { value: tile.value, row: tile.row, col: tile.col } : null
		));
		return oldGrid !== newGrid;
	}

	slideRow(row) {
		let newRow = row.filter(cell => cell !== null);

		for (let i = 0; i < newRow.length - 1; i++) {
			if (newRow[i] && newRow[i + 1] && newRow[i].equals(newRow[i + 1])) {
				newRow[i].merge(newRow[i + 1]);
				this.score += newRow[i].value;
				newRow.splice(i + 1, 1);
				switch (newRow[i].value) {
					case 128:
						this.powerups.undoMove = Math.min((this.powerups.undoMove+1), 3);
						break;
					case 256:
						this.powerups.deleteTile = Math.min((this.powerups.deleteTile+1), 3);
						break;
					case 512:
						this.powerups.swapTiles = Math.min((this.powerups.swapTiles+1), 3);
						break;
					case 1024:
						this.powerups.deleteTilesByNumber = Math.min((this.powerups.deleteTilesByNumber+1), 3);
						break;
				}
			}
		}

		newRow.forEach((tile, index) => {
			tile.setPosition(tile.row, index);
			tile.animationFlags.moved = true;
		});

		while (newRow.length < row.length) {
			newRow.push(null);
		}

		return newRow;
	}

	// Powerups

	undoMove() {
		if (this.powerups.undoMove === 0) return;
		if (this.prevGrid === null) return;
		this.powerups.undoMove--;
		this.grid = this.prevGrid.map(row =>
			row.map(tile => {
				if (tile) {
					const newTile = new Tile(tile.value, tile.row, tile.col);
					newTile.animationFlags = { ...tile.animationFlags };
					newTile.animationProps = { ...tile.animationProps };
					return newTile;
				}
				return null;
			})
		);
		this.prevGrid = null;
		this.updateTiles();
	}

	deleteTile(tile) {
		if (this.powerups.deleteTile === 0) return;
		this.powerups.deleteTile--;
		this.grid[tile.row][tile.col] = null;
	}

	swapTiles(tile1, tile2) {
		if (this.powerups.swapTiles === 0) return;
		this.powerups.swapTiles--;
		let [row1, col1] = [tile1.row, tile1.col];
		tile1.setPosition(tile2.row, tile2.col);
		tile2.setPosition(row1, col1);
		tile1.animationFlags.moved = true;
		tile2.animationFlags.moved = true;

		this.updateTiles();
	}

	deleteTilesByNumber(tile) {
		if (this.powerups.deleteTilesByNumber === 0) return;
		this.powerups.deleteTilesByNumber--;

		let tileCount = 0;

		this.grid = this.grid.map(row => row.map(cell => {
			if (cell) {
				if (cell.value === tile.value)
					return null;
				else
					tileCount++;
			}
			return cell;
		}));

		if(tileCount < 2) {
			this.addRandomTile();
		}

		this.updateTiles();
	}


	// Helper functions

	checkGameOver() {
		if (this.grid.flat().includes(null)) return;
		if (this.powerups.undoMove > 0 || this.powerups.deleteTile > 0 || this.powerups.swapTiles > 0 || this.powerups.deleteTilesByNumber > 0) return;

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
		this.animationFlags = {
			created: true,
			destroyed: false,
			moved: false,
			merged: false
		}
		this.animationProps = this.calculateAnimation();
	}

	setPosition(row, col) {
		this.prevRow = this.row;
		this.prevCol = this.col;
		this.row = row;
		this.col = col;
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

	recalculateAnimation() {
		const { initial, animate, destroy } = this.calculateAnimation();
		this.animationProps = { initial, animate };
		return destroy;
	}

	calculateAnimation() {

		const initial = {
			top: this.animationFlags.moved ? `${this.prevRow * 8.5}rem` : `${this.row * 8.5}rem`,
			left: this.animationFlags.moved ? `${this.prevCol * 8.5}rem` : `${this.col * 8.5}rem`,
			opacity: 1,
			scale: this.animationFlags.merged ? 1.2 : this.animationFlags.created ? 0 : 1,
		};

		const animate = {
			top: `${this.row * 8.5}rem`,
			left: `${this.col * 8.5}rem`,
			opacity: this.animationFlags.destroyed ? 0 : 1,
			scale: 1
		};

		if (this.animationFlags.moved) this.animationFlags.moved = false;
		if (this.animationFlags.created) this.animationFlags.created = false;
		if (this.animationFlags.merged) this.animationFlags.merged = false;

		this.prevRow = this.row;
		this.prevCol = this.col;

		if (this.animationFlags.destroyed) {
			return { initial, animate, destroy: true };
		}

		return { initial, animate };
	}

	getTileColor() {
		const colors = {
			2: 'bg-Tile_1',
			4: 'bg-Tile_1',
			8: 'bg-Tile_1',
			16: 'bg-Tile_2',
			32: 'bg-Tile_2',
			64: 'bg-Tile_2',
			128: 'bg-Tile_3',
			256: 'bg-Tile_3',
			512: 'bg-Tile_4',
			1024: 'bg-Tile_4',
			2048: 'bg-Tile_5',
			4096: 'bg-Tile_5',
			8192: 'bg-Tile_6',
			16384: 'bg-Tile_6',
			32768: 'bg-Tile_7',
			65536: 'bg-Tile_7',
			131072: 'bg-Tile_8',
		};
		return colors[this.value];
	};

	getTileImage() {
		const images = {
			2: '/tiles/01.png',
			4: '/tiles/02.png',
			8: '/tiles/03.png',
			16: '/tiles/04.png',
			32: '/tiles/05.png',
			64: '/tiles/06.png',
			128: '/tiles/07.png',
			256: '/tiles/08.png',
			512: '/tiles/09.png',
			1024: '/tiles/10.png',
			2048: '/tiles/11.png',
			4096: '/tiles/12.png',
			8192: '/tiles/13.png',
			16384: '/tiles/14.png',
			32768: '/tiles/15.png',
			65536: '/tiles/16.png',
			131072: '/tiles/17.png'
		}
		return images[this.value];
	}

}
