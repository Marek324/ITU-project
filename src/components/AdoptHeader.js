import { Link, Route, Routes} from "react-router-dom";
import {shop as shop_icon, user as user_icon} from "../svg";

function AdoptHeader() {
    return (
        <header
            // className="w-full h-48 bg-Main_Header flex items-center justify-center border-2 border-Main_Header_Border relative">
			className="
			w-full h-36
			relative z-10
			bg-Main_Header border-2 border-Main_Header_Border
			grid grid-cols-12 items-center
			">
            {/* <h1 className="text-3xl font-Pet_Title text-border absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-Main_Header">Adopt & Play</h1> */}
			<h1 className="text-3xl font-Pet_Title text-border col-span-7 col-start-5">Adopt & Play</h1>
            {/* <button className="absolute right-24 top-1/2 transform -translate-y-1/2">
                {shop_icon()}
            </button>
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
                {user_icon()}
            </button> */}
			<Link to="/user" className="">{user_icon()}</Link>


        </header>
    );
}

export default AdoptHeader;
