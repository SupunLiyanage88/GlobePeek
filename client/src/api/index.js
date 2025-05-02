import axios from "axios";

// Set base URL from environment variable
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

axios.interceptors.request.use(
  function (config) {
    if (!config.headers) {
      config.headers = {};
    }

    // Retrieve token from localStorage if needed
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  function (error) {
    // You can handle specific error statuses here
    if (error.response?.status === 401) {
      // Handle unauthorized access
    }
    return Promise.reject(error.response ?? error);
  }
);

export default axios;