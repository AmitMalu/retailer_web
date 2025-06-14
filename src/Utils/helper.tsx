import { saveApiResponse } from "@/Redux/Actions/apiActions";
import { AppDispatch } from "@/Redux/Store";
import { useDispatch } from "react-redux";
import CryptoJS from "crypto-js";

const KEY = CryptoJS.enc.Hex.parse(
  "a7f3d9c6e8421fb62e7e5c3410b974e2d5c6a8f90fd13b4aa12f658f9a34bc29"
);

const IV = CryptoJS.enc.Hex.parse("d8e2a59f4b1372c3e9a17d684cf1b238");

export const encryptData = (data: object | string): string => {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })?.toString();

  // console.log('🔒 Encrypted Output:', encrypted);
  return encrypted;
};

export const decryptData = (ciphertext: string): any => {
  if (!ciphertext) return null;

  const decryptedBytes = CryptoJS.AES.decrypt(ciphertext, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const decryptedString = decryptedBytes?.toString(CryptoJS.enc.Utf8);

  // console.log('🔓 Decrypted String:', decryptedString);
  return decryptedString ? JSON.parse(decryptedString) : null;
};

export const PasswordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&*()_+!])[A-Za-z\d@#$%^&*()_+!]{6,}$/;

export const MobileNoRegex = /^[0-9]{10}$/;

export const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const useIpAddress = () => {
  const dispatch = useDispatch<AppDispatch>();
  const fetchIpAddress = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      dispatch(saveApiResponse("ipAddress", data.ip));
    } catch (error) {
      console.error("Error fetching IP address:", error);
    }
  };

  return { fetchIpAddress };
};

export const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
};
