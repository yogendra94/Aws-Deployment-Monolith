import axios from "axios";

// GET requests → CloudFront (for caching)
const API = axios.create({
  baseURL: "https://dx477fyqoy1pm.cloudfront.net/api",
  headers: {
    Accept: "application/json",
  },
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default API;
