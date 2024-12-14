import React from 'react';
import MeetingsListItem from './MeetingsListItem';

function MeetingsList({ meetings }) {
	return (
		<div className="space-y-4 mt-8">
			{meetings.map(meeting => (
				<MeetingsListItem key={meeting.id} meeting={meeting} />
			))}
		</div>
	);
}

export default MeetingsList;
