import axios from "axios";
import { InternalAxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  isMultipart?: boolean;
}

const API_CONFIG = {
  timeout: 30000, // 30 seconds
  //   withCredentials: true,
};

// Create an Axios instance
const api = axios.create(API_CONFIG);

// Request interceptor to add Authorization token dynamically
api.interceptors.request.use(
  async (config: CustomAxiosRequestConfig) => {
    let token = "";

    try {
      const authCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="));

      if (authCookie) {
        token = decodeURIComponent(authCookie.split("=")[1]);
      }
    } catch (err) {
      console.error("ERROR reading authToken cookie:", err);
    }

    let lat = "";
    let lng = "";
    let ipAddress = "";

    try {
      const persistRoot = localStorage.getItem("persist:root");
      if (persistRoot) {
        const parsedRoot = JSON.parse(persistRoot);
        const locationData = JSON.parse(parsedRoot.location || "{}");
        lat = locationData.lat || "";
        lng = locationData.lng || "";
        ipAddress = locationData.ipAddress || "";
      }
    } catch (err) {
      console.error("ERROR reading location from persist storage:", err);
    }

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    if (lat && lng) {
      config.headers.set("Latitude", lat);
      config.headers.set("Longitude", lng);
    }

    if (ipAddress) {
      config.headers.set("IpAddress", ipAddress);
    }

    if (config.isMultipart) {
      config.headers.set("Content-Type", "multipart/form-data");
      config.headers.set("Accept", "application/json, text/plain, */*");
    } else {
      config.headers.set("Content-Type", "application/json");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.error("Response error:", error?.response || error);
    if (error?.response?.data?.statusCode === 401) {
    } else {
    }
    return Promise.reject(error);
  }
);

export default api;
