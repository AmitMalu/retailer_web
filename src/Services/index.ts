import axios from "axios";

const API_CONFIG = {
  timeout: 30000, // 30 seconds
  //   withCredentials: true,
};

// Create an Axios instance
const api = axios.create(API_CONFIG);

// Request interceptor to add Authorization token dynamically
api.interceptors.request.use(
  async (config) => {
    // console.log("Request:", {
    //   url: config.url,
    //   method: config.method,
    //   headers: config.headers,
    //   data: config.data,
    // });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token expiration
api.interceptors.response.use(
  (response) => {
    // console.log("Response:", {
    //   url: response.config.url,
    //   status: response.status,
    //   data: response.data,
    // });
    return response;
  },
  async (error) => {
    console.error("Response error:", error?.response || error);
    // console.error("Response error:", {
    //   url: error.config?.url,
    //   status: error.response?.data?.statusCode,
    //   message: error.message,
    // });

    if (error?.response?.data?.statusCode === 401) {
      // handleCustomError(error);
    } else {
      // showErrorNotification(
      //   error?.response?.data?.message || t('AnUnknownErrorOccurred'),
      // );
    }
    // return error;
    return Promise.reject(error);
  }
);

export default api;
