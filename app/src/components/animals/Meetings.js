import React from 'react';
import MeetingsList from './MeetingsList';
import AdoptHeader from './AdoptHeader';

function Meetings({ meetings }) {
	return (
		<div className="bg-Main_BG min-h-screen">
			<AdoptHeader />
			<MeetingsList meetings={meetings} />
		</div>
	);
}

export default Meetings;
