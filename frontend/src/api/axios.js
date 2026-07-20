import axios from "axios";

const API = axios.create({
  baseURL: "https://resurf.onrender.com/api/v1/users",
});

export default API;