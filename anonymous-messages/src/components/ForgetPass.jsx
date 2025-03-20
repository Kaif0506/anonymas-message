import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PasswordReset from "./PasswordReset";
import "react-toastify/dist/ReactToastify.css";

const ForgetPass = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/forgot-password`,
        { email }
      );
      
      if(response.status === 404) {
        toast.error("User not found");
        return;
      }
      toast.success(response.data.message);
      setIsOtpSent(true);
    } catch (error) {
      toast.error("User ");
      
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/api/verify-otp`, { email, otp });
      toast.success(response.data.message);
      setIsOtpVerified(true);
    } catch (error) {
      toast.error("Failed to verify OTP. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-lg max-w-md w-full border border-gray-700">
        <h2 className="text-2xl font-semibold text-white text-center mb-6">
          {isOtpSent ? "Verify OTP" : "Forgot Password?"}
        </h2>
        {!isOtpVerified ? (
          <>
            {!isOtpSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className={`w-full py-3 rounded-lg text-white font-semibold transition duration-300 ${
                    loading
                      ? "bg-blue-500/50 cursor-not-allowed opacity-50"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
                >
                  Verify OTP
                </button>
              </form>
            )}
          </>
        ) : (
          <PasswordReset email={email} />
        )}
      </div>
    </div>
  );
};

export default ForgetPass;
