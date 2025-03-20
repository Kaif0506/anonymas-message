import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PasswordReset = ({ email }) => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReset, setReset] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/password-reset`, {
        email,
        newPassword,
      });
      toast.success("Password reset successfully! You can now log in.");
      setNewPassword(""); // Clear input after success
      setReset(true);
    } catch (error) {
      toast.error("Failed to reset password. Try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full text-center"
      >
        {isReset ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Password Reset Successful! 🎉</h2>
            <p className="text-gray-600 mt-2">You can now log in with your new password.</p>
            <button
              onClick={handleNavigate}
              className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-gray-800">Reset Your Password</h2>
            <p className="text-sm text-gray-500 mt-2">Enter a new password for {email}</p>
            <form onSubmit={handleSubmit} className="mt-5">
              <div className="mb-5">
                <label className="block text-gray-700 font-medium text-left">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className={`w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 ${
                  loading && "opacity-50 cursor-not-allowed"
                }`}
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PasswordReset;
