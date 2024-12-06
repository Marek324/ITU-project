import React from "react";
import MergeTile from "components/merge-a-pet/MergeTile";

const MergeRow = ({ row }) => {
	return (
		<div className="flex">
			{row.map((col, index) => (
				<MergeTile key={index} value={col} />
			))}
		</div>
	);
}

export default MergeRow;
