import { Link, useLocation } from "react-router-dom";
import { adoption as adopt_icon, blog as blog_icon, arrow_back as home_icon, adminMode } from "svg";

function AdoptHeader({ onAdminModeClick }) {

	const location = useLocation();
	const isHome = location.pathname === '/' || location.pathname === '/blog';
	let link_back = null;
	if (location.pathname.startsWith('/animal/')) {
		link_back = "/";
	} else if (location.pathname.startsWith('/blog/')) {
		link_back = "/blog";
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
				{!isHome && <Link to={link_back} className="col-start-1 content-center">{home_icon()}</Link>}
				<button className="mr-4" style={{ width: '48px', height: '48px' }} onClick={onAdminModeClick}>
					{adminMode()}
				</button>
			</div>
			<h1 className="text-3xl text-center font-Pet_Title text-border">Adopt & Play</h1>
			<div className="flex">
				<Link to="/" className="content-center">{adopt_icon()}</Link>
				<Link to="/blog" className="content-center">{blog_icon()}</Link>
			</div>
		</header>
	);
}

export default AdoptHeader;
