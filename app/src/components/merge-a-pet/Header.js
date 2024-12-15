/**
 * Header.js
 * Author: Marek Hric xhricma00
 */

import React from "react";
import { Link } from "react-router-dom";
import { Return as return_icon } from "svg";
import { useParams } from "react-router-dom";

const Header = () => {
	const { id } = useParams();
	const link_back = `/animal/${id}/tamagotchi`;
	return (
		<div className="grid grid-cols-7 w-full bg-Main_Header border-b-2 p-4 border-Main_Header_Border mb-16">
			<Link to={link_back} className="col-span-1" >{return_icon()}</Link>
			<h1 className="text-4xl col-span-5 flex justify-center items-center font-Header_Text text-border text-white">Merge-a-Pet</h1>
		</div>
	);
};

export default Header;
