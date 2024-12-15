//Author: Tobiáš Adamčík (xadamc08)
//File: Meetings.js
//Description: View for displaying a list of meetings with animals

import React from 'react';
import MeetingsList from './MeetingsList';
import AdoptHeader from './AdoptHeader';

function Meetings({ meetings, deleteMeeting }) {
	return (
		<div className="bg-Main_BG min-h-screen">
			<AdoptHeader />
			<MeetingsList meetings={meetings} deleteMeeting={deleteMeeting}/>
		</div>
	);
}

export default Meetings;
