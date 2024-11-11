import React, { forwardRef } from 'react';
import { Return } from '../../svg';

const DownBar = forwardRef(({ onFirstClick, onSecondClick, onThirdClick, firstIcon, secondIcon, thirdIcon }, ref) => {
	return (
		<div ref={ref} className="bg-[#5994CE] h-16 w-full flex items-center justify-between text-white border-t-2 border-[#B957CE] absolute bottom-0">
			{Return()}
			<div className="flex flex-row justify-center items-center space-x-36 flex-1 mr-16">
				<div onClick={onFirstClick} className="cursor-pointer">
					{firstIcon}
				</div>
				<div onClick={onSecondClick} className="cursor-pointer">
					{secondIcon}
				</div>
				<div onClick={onThirdClick} className="cursor-pointer">
					{thirdIcon}
				</div>
			</div>
		</div>
	);
});

export default DownBar;
