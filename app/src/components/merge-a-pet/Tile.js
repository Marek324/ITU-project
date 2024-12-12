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
					{/* {tile.value} */}
					<img src={tile.getTileImage()} />
				</motion.button>
			}
		</>
	);
}

export default Tile;
