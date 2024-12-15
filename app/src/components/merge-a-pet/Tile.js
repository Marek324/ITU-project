/**
 * Tile.js
 * Author: Marek Hric xhricma00
 */

import React from "react";
import { motion } from "motion/react"


const Tile = ({ tile, onSelectTile }) => {

	return(
		<>
			{!tile ? <div></div> :
				<motion.button
					onClick={() => onSelectTile(tile)}
					initial={{ ...tile.animationProps.initial }}
					animate={{ ...tile.animationProps.animate }}
					transition={{ duration: 0.05 }}
					key={`${tile.id}`}
					className={`
						size-32 rounded-lg
						absolute
						${tile.getTileColor()}
						text-3xl text-white
						text-center font-bold
						flex items-center justify-center
						`}
				>
					<div className="relative w-full h-full"></div>
					{<p className="absolute text-xs top-2 left-2 text-black " >{tile.value}</p>}
					<img src={tile.getTileImage()} />
				</motion.button>
			}
		</>
	);
}

export default Tile;
