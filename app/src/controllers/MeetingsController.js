// File: src/controllers/MeetingsController.js
import React, { useEffect, useState } from 'react';
import {GetMeetings} from "../services/MeetingsService";
import Meetings from "../components/animals/Meetings";

function MeetingsController() {
	const [meetings, setMeetings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
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

		getMeetings();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return <Meetings meetings={meetings} />;
}

export default MeetingsController;
