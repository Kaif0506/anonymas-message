import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import{Link} from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`https://anonymas-message.onrender.com/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log(data);
      
  
      if (!response.ok) {
        // Show error message if login fails
        toast.error(data.error || "Login failed. Please try again.");
        return;
      }
  
      // Show success message
      localStorage.setItem("success",data.message);
      

  
      // Store token and redirect
      localStorage.setItem("token", data.token);
      if (data.link) {
        localStorage.setItem("messageLink", data.link);
      window.location.href = "/dashboard";  



      }
      
  
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-600 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition duration-300 hover:scale-105">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6">Login</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
            <div className="text-end underline"><Link to={"/forget-password"}>Forget Password</Link></div>
          </div>
          
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md transition-transform transform hover:scale-105 cursor-pointer"
            onClick={handleLogin}
          >
            Login
          </button>
          <div className="text-center text-gray-600">
            Don't have an account? <Link to={"/"}>Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}