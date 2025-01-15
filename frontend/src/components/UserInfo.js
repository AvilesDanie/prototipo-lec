// src/UserInfo.js
import React from 'react';

const UserInfo = ({ user }) => {
  return (
    <div>
      <h2>User Information</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Level:</strong> {user.level}</p>
      <p><strong>Experience Points:</strong> {user.experiencePoints}</p>
      <p><strong>Completed Challenges:</strong> {user.completedChallenges.length}</p>
      <p><strong>Progress:</strong> {user.progress}%</p>
      <p><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default UserInfo;
