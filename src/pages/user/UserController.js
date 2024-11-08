import React, { useEffect, useState } from "react";
import { GetUser, UpdateUser } from "services/UserService";
import { useParams } from 'react-router-dom';
import UserProfile from "pages/user/UserProfile";

const UserProfileController = () => {
	const { id: userId } = useParams();
  	const [user, setUser] = useState(null);
  	const [error, setError] = useState(null);
  	const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const data = await GetUser(userId);
        setUser(data);
      } catch (err) {
        setError("Failed to load user profile.");
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async (updatedData) => {
    try {
      const updatedUser = await UpdateUser(userId, updatedData);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update user profile.");
    }
  };

  return (
    <UserProfile
      user={user}
      isEditing={false}
      error={error}
      onEditToggle={handleEditToggle}
      onSave={handleSave}
    />
  );
};

export default UserProfileController;
