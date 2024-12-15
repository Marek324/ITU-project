import React, {forwardRef} from 'react';
import {arrow_back as home_icon, Return} from '../../svg';
import {Link, useLocation} from "react-router-dom";

const DownBar = forwardRef(({
								onFirstClick,
								onSecondClick,
								onThirdClick,
								firstIcon,
								secondIcon,
								thirdIcon,
								linkBack
							}, ref) => {
	const location = useLocation();
	// Extract the animalid from the URL
	const pathParts = location.pathname.split('/');
	const animalid = pathParts[2];
	let link_back = `/animal/${animalid}`;

	return (
		<div ref={ref}
			 className="bg-[#5994CE] h-16 w-full flex items-center justify-between text-white border-t-2 border-[#B957CE] absolute bottom-0">
			<Link to={linkBack ? linkBack : link_back} className="col-start-1 content-center">{Return()}</Link>
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
