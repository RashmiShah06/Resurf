import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import API from "./api/axios";

import Login from "./pages/login";
import Signup from "./pages/signup";
import ForgotPassword from "./pages/forgotpassword";
import ResetPassword from "./pages/resetpassword";
import Landing from "./pages/landing";
import Resurf from "./pages/resurf";


function App() {
  useEffect(() => {
    API.get("/health").catch(() => {});
  }, []);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/" element={<Landing />} />
      <Route path="/resurf" element={<Resurf />} />
    </Routes>
  );
}

export default App;