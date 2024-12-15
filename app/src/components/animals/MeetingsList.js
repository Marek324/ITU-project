import React from 'react';
import MeetingsListItem from './MeetingsListItem';

function MeetingsList({ meetings, deleteMeeting }) {
	return (
		<div className="space-y-4 p-8">
			{meetings.map(meeting => (
				<MeetingsListItem key={meeting.id} meeting={meeting} handleDelete={deleteMeeting}/>
			))}
		</div>
	);
}

export default MeetingsList;
