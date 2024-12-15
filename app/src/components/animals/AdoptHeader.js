//Author: Tobiáš Adamčík (xadamc08)
//File: AdoptHeader.js
//Description: Header for the shelter pages

import React from 'react';
import { Link, useLocation } from "react-router-dom";
import {
	adoption as adopt_icon,
	arrow_back as home_icon,
	adminMode as adminModeIcon,
	meeting as meetingIcon
} from "svg";

function AdoptHeader({ onAdminModeClick, adminMode }) {
	const location = useLocation();
	const isHome = location.pathname === '/' || location.pathname === '/meetings';
	let link_back = null;
	if (location.pathname.startsWith('/animal/')) {
		link_back = "/";
	}

	return (
		<header
			className="
        w-full h-36
        relative z-10
        bg-Main_Header border-2 border-Main_Header_Border
        flex items-center justify-between
        px-4"
		>
			<div className="flex">
				{!isHome && <Link to={link_back} state={{ adminMode }} className="col-start-1 content-center">{home_icon()}</Link>}
				<button className="mr-4" style={{ width: '48px', height: '48px' }} onClick={onAdminModeClick}>
					{adminModeIcon()}
				</button>
			</div>
			<h1 className="text-3xl text-center font-Pet_Title text-border">Adopt & Play</h1>
			<div className="flex">
				<Link to="/" className="content-center mr-4">{adopt_icon()} </Link>
				<Link to="/meetings" className="content-center">{meetingIcon()}</Link>
			</div>
		</header>
	);
}

export default AdoptHeader;
