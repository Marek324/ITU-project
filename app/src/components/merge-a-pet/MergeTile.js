import React from "react";
import { motion } from "motion/react"


const MergeTile = ({ tile }) => {

	return(
		<>
			{!tile ? <div></div> :
				<motion.div
					initial={{ ...tile.calculateAnimation().initial }}
					animate={{ ...tile.calculateAnimation().animate }}
					key={`${tile.id}`}
					className={`
						size-32 rounded-lg
						absolute
						${getTileColor(tile)}
						text-3xl text-white
						text-center font-bold
						flex items-center justify-center
						`}
				>
					{tile.value}
				</motion.div>
			}
		</>
	);
}

export default MergeTile;


const getTileColor = (tile) => {
	const colors = {
		2: 'bg-emerald-200',
		4: 'bg-emerald-400',
		8: 'bg-yellow-400',
		16: 'bg-orange-400',
		32: 'bg-red-400',
		64: 'bg-red-600',
		128: 'bg-purple-400',
		256: 'bg-purple-600',
		512: 'bg-blue-400',
		1024: 'bg-blue-600',
		2048: 'bg-fuchsia-500',
		4096: 'bg-pink-500',
		8192: 'bg-rose-600',
		16384: 'bg-amber-500',
		32768: 'bg-lime-500',
		65536: 'bg-cyan-600',
		131072: 'bg-indigo-700',
	};
    return colors[tile.value] || 'bg-gray-100';
};
