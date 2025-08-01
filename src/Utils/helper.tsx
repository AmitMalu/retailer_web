import { saveApiResponse } from "@/Redux/Actions/apiActions";
import { AppDispatch } from "@/Redux/Store";
import { useDispatch } from "react-redux";
import CryptoJS from "crypto-js";
import { showErrorNotification } from "./notifications";
import { handleCustomError } from "./handleCustomError";
import { Sub_Product_Dropdown, Wallet_Balance } from "@/Services/api";
import { useState } from "react";

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

export const PanRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export const PinCodeRegex = /^[0-9]{6}$/;

export const useIpAddress = () => {
  const dispatch = useDispatch<AppDispatch>();

  const fetchIpAddress = async () => {
    const cachedIp = localStorage.getItem("ipAddress");
    if (cachedIp) {
      dispatch(saveApiResponse("ipAddress", cachedIp));
      return;
    }

    const apis = [
      async () => {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        return data.ip;
      },
      async () => {
        const res = await fetch("https://api.myip.com/");
        const data = await res.json();
        return data.ip;
      },
      async () => {
        const res = await fetch("https://ipv4.icanhazip.com/");
        const text = await res.text();
        return text.trim();
      },
    ];

    for (const api of apis) {
      try {
        const ip = await api();
        if (ip) {
          localStorage.setItem("ipAddress", ip);
          dispatch(saveApiResponse("ipAddress", ip));
          break;
        }
      } catch (err) {
        showErrorNotification("Unable to fetch IP Address");
      }
    }
  };

  return { fetchIpAddress };
};

export const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
};

export const formatYMDdate = (date: string | Date) => {
  const d = new Date(date);
  return `${String(d.getFullYear())}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const useWalletBalance = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const WalletBalanceReq = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await Wallet_Balance(id);
      if (response?.status === 200 || response?.status === 201) {
        dispatch(saveApiResponse("walletBalance", response?.data?.data));
      } else {
        showErrorNotification(response?.data?.message);
      }
    } catch (error) {
      await handleCustomError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { WalletBalanceReq, isLoading };
};

export const isSameOrBefore = (input: Date | null, compareTo: Date | null) => {
  if (!input || !compareTo) return true;
  return (
    input.getFullYear() < compareTo.getFullYear() ||
    (input.getFullYear() === compareTo.getFullYear() &&
      (input.getMonth() < compareTo.getMonth() ||
        (input.getMonth() === compareTo.getMonth() &&
          input.getDate() <= compareTo.getDate())))
  );
};

export const isSameOrAfter = (input: Date | null, compareTo: Date | null) => {
  if (!input || !compareTo) return true;
  return (
    input.getFullYear() > compareTo.getFullYear() ||
    (input.getFullYear() === compareTo.getFullYear() &&
      (input.getMonth() > compareTo.getMonth() ||
        (input.getMonth() === compareTo.getMonth() &&
          input.getDate() >= compareTo.getDate())))
  );
};

export const useSubProductDropdown = () => {
  const dispatch = useDispatch<AppDispatch>();
  const SubProductDropdownReq = async () => {
    try {
      const response = await Sub_Product_Dropdown();
      if (response?.status === 200 || response?.status === 201) {
        dispatch(saveApiResponse("subProductDropdown", response?.data?.data));
      } else {
        showErrorNotification(response?.data?.message);
      }
    } catch (error) {
      await handleCustomError(error);
    } finally {
    }
  };

  return { SubProductDropdownReq };
};

export const createTriangularLayout = (items: any[]) => {
  if (items.length === 0) return [];
  if (items.length <= 3) return [items];

  const result = [];
  let remaining = [...items];

  let rowSize = Math.min(Math.ceil(items.length / 2) + 1, 6);

  const minRows = 2;
  if (items.length - rowSize < minRows - 1) {
    rowSize = items.length - (minRows - 1);
  }

  while (remaining.length > 0) {
    const currentRowSize = Math.min(rowSize, remaining.length);
    if (currentRowSize <= 0) break;

    const rowItems = remaining.slice(0, currentRowSize);
    result.push(rowItems);
    remaining = remaining.slice(currentRowSize);

    if (rowSize > 1) {
      rowSize--;
    }
  }

  return result;
};
