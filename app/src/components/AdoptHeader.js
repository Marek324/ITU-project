import { Link, useLocation } from "react-router-dom";
import { arrow_back as home_icon, edit as edit_icon, adoption as adopt_icon, blog as blog_icon } from "svg";

function AdoptHeader() {

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
			px-4
			">

			<div className="flex space-x-4">
				{!isHome &&	<Link to={link_back} className="content-center">{home_icon()}</Link>}
				<button className="content-center">{edit_icon()}</button>
			</div>
            <h1 className="text-3xl text-center font-Pet_Title text-border">Adopt & Play</h1>
			<div className="flex space-x-4">
				<Link to="/" className="content-center">{adopt_icon()}</Link>
				<Link to="/blog" className="content-center">{blog_icon()}</Link>
			</div>

        </header>
    );
}

export default AdoptHeader;
