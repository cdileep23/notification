import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/url";

const SuggestedUsers = ({ user }) => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        console.log("fectg")
        const response = await axios.get(`${BASE_URL}/get-unfollowing/${user.userId}`);
        console.log(response)
        setSuggestedUsers(response.data.users);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching suggested users:", error);
        setLoading(false);
      }
    };

    if (user) {
      fetchSuggestedUsers();
      setLoading(false)
    }
  }, [user]);

  const handleFollow = async (userIdToFollow) => {
    try {
      await axios.post(`${BASE_URL}/add-follower/${user.userId}`, {
        userIdToFollow,
      });
     
      setSuggestedUsers((prev) =>
        prev.filter((user) => user._id !== userIdToFollow)
      );
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  if (loading) return <div>Loading suggestions...</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Suggested Users</h2>
      {suggestedUsers.length === 0 ? (
        <p>No suggestions available</p>
      ) : (
        <ul className="space-y-3">
          {suggestedUsers.map((user) => (
            <li key={user._id} className="flex justify-between items-center">
              <span className="font-medium">{user.username}</span>
              <button
                onClick={() => handleFollow(user._id)}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                Follow
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SuggestedUsers;
