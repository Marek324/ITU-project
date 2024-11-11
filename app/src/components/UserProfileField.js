import React from "react";

function UserProfileField({ label, value }) {
  return (
	<div className="flex flex-col">
	  <label className="text-sm font-semibold">{label}</label>
	  <p className="text-lg">{value}</p>
	</div>
  );
}

export default UserProfileField;
