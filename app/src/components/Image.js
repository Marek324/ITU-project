/**
 * Image.js
 * Author: Marek Hric xhricma00
 */

import React from "react";

const serverPort = 5000;
const pathToImgs = `http://localhost:${serverPort}/public/imgs/`;

function Image({ src, alt, className }) {
	return (
		<img src={`${pathToImgs}${src}.jpg`} alt={alt} className={className} />
	);
}

export default Image;
