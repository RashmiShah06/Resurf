import { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FaFilePdf, FaYoutube, FaCode } from "react-icons/fa";
import { IoLink } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Toast from "../components/Toast"; 

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toast, setToast] = useState(null); // { type: "success" | "error", message }
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setToast({ type: "error", message: "Passwords do not match" });
      return;
    }

    try {
      const res = await API.post("/users/register", {
        username,
        email,
        password,
      });

      
      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setToast({ type: "success", message: res.data.message });
      
      setTimeout(() => navigate("/resurf"), 900);
    } catch (err) {
      setToast({
        type: "error",
        message: err.response?.data?.message || "Something went wrong",
      });
      // no navigate here — stay on signup so they can fix the error
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F5] flex items-center justify-center p-4">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="w-full max-w-7xl bg-white rounded-[32px] shadow-2xl overflow-hidden grid lg:grid-cols-2">
        
        {/* Left Side */}
        <div className="flex flex-col justify-center px-8 md:px-12 lg:px-16 py-10">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-[#1F2937]"
            style={{ fontFamily: "Playfair Display" }}
          >
            Rediscover your
            <br />
            <span className="text-[#1B4965]">digital knowledge.</span>
          </h1>

          <p className="mt-4 text-gray-500 text-base leading-7 max-w-sm">
            Everything you save.
            <br />
            Exactly when you need it.
          </p>

          <div className="relative mt-8 h-40 w-full">
            <div className="absolute left-8 top-2 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center hover:-translate-y-2 transition-all duration-300">
              <FaFilePdf className="text-red-500 text-3xl" />
            </div>

            <div className="absolute left-28 top-16 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center hover:-translate-y-2 transition-all duration-300">
              <IoLink className="text-[#6D8A6F] text-3xl" />
            </div>

            <div className="absolute left-48 top-2 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center hover:-translate-y-2 transition-all duration-300">
              <FaCode className="text-blue-500 text-3xl" />
            </div>

            <div className="absolute left-[17rem] top-16 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center hover:-translate-y-2 transition-all duration-300">
              <FaYoutube className="text-red-600 text-3xl" />
            </div>
          </div>

          <p className="mt-6 text-gray-400">
            Your knowledge. Always within reach.
          </p>
        </div>
        {/*Right Side*/}
        <div className="bg-[#FCFCFB] flex items-center justify-center p-7">
          <div className="w-full max-w-md">
            <h2
              className="text-4xl font-semibold text-[#1F2937]"
              style={{ fontFamily: "Playfair Display" }}
            >
              Create Account
            </h2>


            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="flex items-center bg-white border border-gray-300 rounded-2xl px-5 py-4 focus-within:border-[#6D8A6F] focus-within:ring-4 focus-within:ring-[#6D8A6F]/10">
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full outline-none bg-transparent placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="flex items-center bg-white border border-gray-300 rounded-2xl px-5 py-4 focus-within:border-[#6D8A6F] focus-within:ring-4 focus-within:ring-[#6D8A6F]/10">
                <FiMail className="text-gray-400 text-xl" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ml-3 w-full outline-none bg-transparent placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                
              </div>
              <div className="flex items-center bg-white border border-gray-300 rounded-2xl px-5 py-4 focus-within:border-[#6D8A6F] focus-within:ring-4 focus-within:ring-[#6D8A6F]/10">
                <FiLock className="text-gray-400 text-xl" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ml-3 w-full outline-none bg-transparent placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-[#6D8A6F]"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="flex items-center bg-white border border-gray-300 rounded-2xl px-5 py-4 focus-within:border-[#6D8A6F] focus-within:ring-4 focus-within:ring-[#6D8A6F]/10">
                <FiLock className="text-gray-400 text-xl" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="ml-3 w-full outline-none bg-transparent placeholder:text-gray-400"
                />
              </div>
            </div>

            <button 
              onClick={handleSignup}
              className="mt-6 w-full bg-[#1B4965] hover:bg-[#123448] transition-all duration-300 rounded-2xl py-4 text-white font-semibold shadow-md hover:shadow-lg">
              Create Account
            </button>

            <div className="mt-4 text-center text-gray-500">
              Already have an account?
              <Link to="/login" className="ml-2 text- [#1B4965] font-semibold hover:underline">
                    Login
            </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
