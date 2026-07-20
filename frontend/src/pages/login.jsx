import { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FaFilePdf, FaYoutube, FaCode } from "react-icons/fa";
import { IoLink } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Toast from "../components/Toast"; 

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState(null); // { type: "success" | "error", message }
  const navigate = useNavigate();
  const handleLogin = async () => {
  try {
    const res = await API.post("/login", {
      email,
      password,
    });

    localStorage.setItem("token", res.data.accessToken);
    localStorage.setItem("user", JSON.stringify(res.data.user));


    navigate("/resurf");
  }
  catch(err){
    setToast({ type: "error", message: err.response?.data?.message || err.message });
  }
};

  return (
    <div className="min-h-screen bg-[#F7F8F5] flex items-center justify-center p-4">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="w-full max-w-7xl bg-white rounded-[32px] shadow-2xl overflow-hidden grid lg:grid-cols-2">

        {/* Left side */}

        <div className="flex flex-col justify-center px-8 md:px-12 lg:px-16 py-10">

          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-[#1F2937]"
            style={{ fontFamily: "Playfair Display" }}
          >
            Rediscover your
            <br />
            <span className="text-[#1B4965]">
              digital knowledge.
            </span>
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

<div className="absolute left-68 top-16 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center hover:-translate-y-2 transition-all duration-300">
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
              Login
            </h2>

            <p className="mt-2 text-gray-500">
              Sign in to continue to Resurf.
            </p>

            <div className="mt-8">

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


<div className="mt-6">

  <label className="block text-sm font-medium text-gray-700 mb-2">
    Password
  </label>

  <div className="flex items-center bg-white border border-gray-300 rounded-2xl px-5 py-4 transition-all duration-300 focus-within:border-[#6D8A6F] focus-within:ring-4 focus-within:ring-[#6D8A6F]/10">

    <FiLock className="text-gray-400 text-xl" />

    <input
      type={showPassword ? "text" : "password"}
      placeholder="Enter your password"
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

<div className="mt-4 flex justify-end">

  <Link to="/forgotpassword" className="ml-2 text-[#1B4965] font-semibold hover:underline">
    Forgot Password?
  </Link>

</div>

<button
 onClick={handleLogin}
  className="mt-8 w-full bg-[#1B4965] hover:bg-[#123448] transition-all duration-300 rounded-2xl py-4 text-white font-semibold shadow-md hover:shadow-lg"
>

  Login
</button>

<div className="mt-8 text-center text-gray-500">

  Don't have an account?

  <Link to="/signup" className="ml-2 text-[#1B4965] font-semibold hover:underline">
    Sign Up
  </Link>

</div>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Login;
