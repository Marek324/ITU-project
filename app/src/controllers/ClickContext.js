/**
 * ClickContext.js
 * Author: Marek Hric xhricma00
 */

export default class ClickContext {
	constructor() {
		this.selected = null;
		this.resolve = null;
		this.promise = new Promise((resolve) => {
			this.resolve = resolve;
		});
	}

	select(tile) {
        if (!this.tile1) {
            this.tile1 = tile;
            this.resolve(tile);
            console.log(`Tile selected: ${tile}`);
        }
    }

    async getSelectedTile() {
        return await this.promise;
    }
}
