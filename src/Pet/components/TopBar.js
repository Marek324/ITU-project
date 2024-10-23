import React, { forwardRef } from 'react';

const TopBar = forwardRef(({ title }, ref) => {
	return (
		<div ref={ref} className="bg-[#5994CE] h-16 w-full flex items-center justify-center border-b-2 border-[#B957CE]">
			<span className="text-[#B957CE] text-pet text-3xl">{title}</span>
		</div>
	);
});

export default TopBar;
