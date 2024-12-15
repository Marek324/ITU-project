//Author: Tobiáš Adamčík (xadamc08)
//File: FileService.js
//Description: Service for interacting with files on the server

import axios from 'axios';
const port = 5000;

export async function GetImageNames() {
	try {
		const response = await axios.get(`http://localhost:${port}/api/images`);
		return response.data;
	} catch (error) {
		console.error('Error fetching images:', error);
		return [];
	}
}
