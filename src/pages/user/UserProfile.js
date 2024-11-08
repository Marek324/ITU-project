import React from 'react';
import AdoptHeader from "../../components/AdoptHeader";

function UserProfile() {
  return (
    <div>
	  <AdoptHeader isHome={false} />
      <h2>User Page</h2>
      <p>This is the user page content.</p>
    </div>
  );
};

export default UserProfile;
