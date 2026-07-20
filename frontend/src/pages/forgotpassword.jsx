import { useState } from "react";
import { FiMail } from "react-icons/fi";
import { FaFilePdf, FaYoutube, FaCode } from "react-icons/fa";
import { IoLink } from "react-icons/io5";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Toast from "../components/Toast"; 

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [toast, setToast] = useState(null); // { type: "success" | "error", message }
    const handleForgotPassword = async () => {
  try {
    const res = await API.post("/users/forgot-password", {email,});

    setToast({ type: "success", message: res.data.message });
  } 
  catch(err){
    setToast({ type: "error", message: err.response?.data?.message || err.message });
  }
};
  return (
    <div className="min-h-screen bg-[#F7F8F5] flex items-center justify-center p-4">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="w-full max-w-7xl bg-white rounded-[32px] shadow-2xl overflow-hidden grid lg:grid-cols-2">
        
        {/*Left side*/}
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

        {/* Right side */}
        <div className="bg-[#FCFCFB] flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h2
              className="text-4xl font-semibold text-[#1F2937]"
              style={{ fontFamily: "Playfair Display" }}
            >
              Forgot Password
            </h2>

            <p className="mt-3 text-gray-500 leading-7">
              Enter the email associated with your account and we'll send you a password reset link.
            </p>

            <div className="mt-10">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="flex items-center bg-white border border-gray-300 rounded-2xl px-5 py-4 transition-all duration-300 focus-within:border-[#6D8A6F] focus-within:ring-4 focus-within:ring-[#6D8A6F]/10">
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

            <button
             onClick={handleForgotPassword}
              className="mt-8 w-full bg-[#1B4965] hover:bg-[#123448] transition-all duration-300 rounded-2xl py-4 text-white font-semibold shadow-md hover:shadow-lg">
              Send Reset Link
            </button>

            <div className="mt-8 text-center text-gray-500">
              Remember your password?
              <Link to="/login" className="ml-2 text-[#1B4965] font-semibold hover:underline">
                Login
             </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;
