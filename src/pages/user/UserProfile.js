import React, { useState } from "react";
import AdoptHeader from "components/AdoptHeader";

const UserProfile = ({ user, isEditing, error, onEditToggle, onSave }) => {
	const [editedData, setEditedData] = useState({
		name: user?.name || "",
		email: user?.email || "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setEditedData((prevData) => ({
		...prevData,
		[name]: value,
		}));
	};

	const handleSave = () => {
		onSave(editedData);
	};

	if (error) {
		return <p>{error}</p>;
	}

	if (!user) {
		return <p>Loading...</p>;
	}

	return (
    <div>
		<AdoptHeader isHome={false}/>
      	<div>
		<img src={`data:image/jpeg;base64,${user.image}`} alt={user.name} className="h-main-img w-main-img object-cover mt-10" />
		</div>
		<div>
			<label>Name:</label>
			{isEditing ? (
			<input
				type="text"
				name="name"
				value={editedData.name}
				onChange={handleChange}
			/>
			) : (
			<p>{user.name}</p>
			)}
		</div>
		<div>
			<label>Age:</label>
			{isEditing ? (
			<input
				type="number"
				name="age"
				value={editedData.age}
				onChange={handleChange}
			/>
			) : (
			<p>{user.age}</p>
			)}
		</div>
		<div>
			<label>Email:</label>
			{isEditing ? (
			<input
				type="email"
				name="email"
				value={editedData.email}
				onChange={handleChange}
			/>
			) : (
			<p>{user.email}</p>
			)}
		</div>
		<div>
			<label>Phone:</label>
			{isEditing ? (
			<input
				type="text"
				name="phone"
				value={editedData.email}
				onChange={handleChange}
			/>
			) : (
			<p>{user.phone}</p>
			)}
		</div>
		<button onClick={onEditToggle}>
			{isEditing ? "Cancel" : "Edit"}
		</button>
		{isEditing && <button onClick={handleSave}>Save</button>}
    </div>
  );
};

export default UserProfile;
