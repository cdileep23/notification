import { useSocket } from "@/lib/Socketcontext";
import { BASE_URL } from "@/url";
import axios from "axios";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { connectAndJoinRoom } = useSocket(); // Get method from context

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/authenticate-user`, {
        username,
      });

      if (res.data.success) {
        const user = res.data.data;
        sessionStorage.setItem("user", JSON.stringify(user));

        connectAndJoinRoom(user.userId);

        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
      setUsername("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Enter Your Username
        </h2>
        <input
          type="text"
          placeholder="Username or Unique ID"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {loading ? <Loader className="animate-pulse" /> : "Continue"}
        </button>
      </form>
    </div>
  );
};

export default Auth;
