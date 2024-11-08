import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

export async function GetUser(id) {
	try {
		const response = await axios.get(`${API_URL}/${id}`);
		const user = response.data;
		console.log('User:', user);
		return {
			id: user.id,
			name: user.name,
			age: user.age,
			email: user.email,
			phone: user.phone,
			image: user.image,
		}
	} catch (error) {
		console.error('Error fetching user:', error);
		return null;
	}
}

export async function UpdateUser(id, data) {
	try {
		const response = await axios.put(`${API_URL}/${id}`, data);
		const user = response.data;
		return {
			id: user.id,
			name: user.name,
			age: user.age,
			email: user.email,
			phone: user.phone,
			image: user.image,
		}
	} catch (error) {
		console.error('Error updating user:', error);
		return null;
	}
}

