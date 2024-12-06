import React from "react";

const MergeTile = ({ value }) => {
	return <div className="size-32 text-3xl text-white bg-Animal_Card_BG text-center border border-sky-500 flex items-center justify-center">{value === 0 ? "" : value}</div>;
}

export default MergeTile;
