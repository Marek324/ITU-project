//Author: Tobiáš Adamčík (xadamc08)
//File: MeetingsController.js
//Description: Controller for displaying meetings and managing them

import React, { useEffect, useState } from 'react';
import {GetMeetings, RemoveMeeting} from "../services/MeetingsService";
import Meetings from "../components/animals/Meetings";

function MeetingsController() {
	const [meetings, setMeetings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const getMeetings = async () => {
		try {
			const data = await GetMeetings();
			setMeetings(data);
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		getMeetings();
	}, []);

	const deleteMeeting = async (id) => {
		try {
			await RemoveMeeting(id);
			// Refetch the meetings after deletion
			await getMeetings();
		} catch (error) {
			setError(error.message);
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return <Meetings meetings={meetings} deleteMeeting={deleteMeeting}/>;
}

export default MeetingsController;
