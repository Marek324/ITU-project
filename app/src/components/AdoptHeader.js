import { Link } from "react-router-dom";
import { shopping_cart as shop_icon, account as account_icon, arrow_back as home_icon, adminMode } from "../svg";

function AdoptHeader({ isHome, onAdminModeClick }) {
	return (
		<header
			className="
        w-full h-36
        relative z-10
        bg-Main_Header border-2 border-Main_Header_Border
        flex items-center justify-center
        px-4
      "
		>
			<div className="w-10 absolute left-4">
				{!isHome && <Link to="/" className="col-start-1 content-center">{home_icon()}</Link>}
			</div>
			<h1 className="text-3xl text-center font-Pet_Title text-border">Adopt & Play</h1>
			<div className="absolute right-4">
				<button className="mr-4" style={{ width: '48px', height: '48px' }} onClick={onAdminModeClick}>
					{adminMode()}
				</button>
			</div>
		</header>
	);
}

export default AdoptHeader;
