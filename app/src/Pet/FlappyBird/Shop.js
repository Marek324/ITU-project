import React, {useState} from 'react';
import ballImg from './Assets/ball.png';

//Component for buying and selecting colors
const Shop = ({colors, onColorSelect, topBar, downBar, currentColor, coins, onColorBuy}) => {
	//State for showing preview of the ball with the color the user is hovering over
	const [hoveredColor, setHoveredColor] = useState(null);

	//Function to get the filter for colloring the ball preview
	const getFilter = (color) => {
		switch (color) {
			case 'Pink':
				return 'sepia(1) hue-rotate(200deg) saturate(100)';
			case 'Green':
				return 'sepia(1) hue-rotate(50deg) saturate(100)';
			case 'Blue':
				return 'sepia(1) hue-rotate(100deg) saturate(100)';
			case 'Yellow':
				return 'sepia(1) saturate(100)';
			case 'Cyan':
				return 'sepia(1) saturate(100) hue-rotate(150deg)';
			case 'Grey':
				return 'grayscale(1) brightness(0.5)';
			default:
				return;
		}
	};

	return (
		<div className="absolute left-0 right-0 flex items-center justify-center z-1000"
			 style={{top: topBar, bottom: downBar, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
			<div className="bg-Pet_Header_BG p-5 rounded-lg text-center flex">
				<div className="flex items-center justify-center mr-5">

					{/* Ball preview */}
					<img
						src={ballImg}
						alt="ball"
						style={{filter: hoveredColor ? getFilter(hoveredColor) : getFilter(currentColor)}}
						className="w-32 h-32"
					/>
				</div>
				<div>
					<div className="flex items-center justify-between mb-4">

						{/* Coins count */}
						<div className="text-Pet_Text text-pet font-Pet_Title text-2xl mr-4"
							 style={{textShadow: '2px 2px 0 black'}}>
							<span className="text-yellow-500">{coins}¥</span>
						</div>

						{/* Shop title */}
						<h2 className="text-Pet_Text text-pet font-Pet_Title text-2xl"
							style={{textShadow: '2px 2px 0 black'}}>Shop</h2>
					</div>
					<ul>

						{/* Iterating through colors and displaying each of them */}
						{colors.map((item, index) => (
							<React.Fragment key={index}>
								<li className="text-subtext text-sm flex items-center justify-between"

									//Changing the preview color on hover
									onMouseEnter={() => setHoveredColor(item.color)}
									onMouseLeave={() => setHoveredColor(currentColor)}
									style={{textShadow: '2px 2px 0 black'}}>
									<span style={{color: item.color}}>
										{item.color}
									</span>

									{/* Displaying the price and the button to buy or equip the color */}
									{!item.bought && (
										<span style={{color: coins >= 100 ? '#90EE90' : 'red'}}>- 100¥</span>
									)}
									{item.bought ? (
										<button className="ml-2"
												onClick={() => onColorSelect(item.color)}>Equip</button>
									) : (
										<button className="ml-2" onClick={() => onColorBuy(item.color)}>Buy</button>
									)}
								</li>
								{index < colors.length - 1 && <hr className="my-2 border-black"/>}
							</React.Fragment>
						))}
						<hr className="my-2 border-black"/>

						{/* Adding a default option for colors */}
						<React.Fragment key="default">
							<li className="text-subtext text-sm flex items-center justify-between"
								onMouseEnter={() => setHoveredColor('default')}
								onMouseLeave={() => setHoveredColor(currentColor)}
								style={{textShadow: '2px 2px 0 black'}}>
								<span style={{color: 'white'}}>
									Default
								</span>
								<button className="ml-2" onClick={() => onColorSelect('default')}>Equip</button>
							</li>
						</React.Fragment>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Shop;
