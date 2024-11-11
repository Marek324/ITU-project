import { Link } from "react-router-dom";
import {shopping_cart as shop_icon, account as account_icon, arrow_back as home_icon} from "../svg";

function AdoptHeader({isHome}) {
    return (
        <header
            className="
			w-full h-36
			relative z-10
			bg-Main_Header border-2 border-Main_Header_Border
			flex items-center justify-between
			px-4
			">

			<div className="w-10">
				{!isHome &&	<Link to="/" className="col-start-1 content-center">{home_icon()}</Link>}
			</div>
            <h1 className="text-3xl text-center font-Pet_Title text-border col-span-6 col-start-3">Adopt & Play</h1>
			<div className="flex space-x-4">
			</div>

        </header>
    );
}

export default AdoptHeader;
