import { saveApiResponse } from "@/Redux/Actions/apiActions";
import { AppDispatch } from "@/Redux/Store";
import { useDispatch } from "react-redux";
import CryptoJS from "crypto-js";
import { showErrorNotification } from "./notifications";
import { handleCustomError } from "./handleCustomError";
import { Sub_Product_Dropdown, Wallet_Balance } from "@/Services/api";
import { useState } from "react";
import * as Yup from 'yup'
import * as Papa from "papaparse";
import moment from "moment";

const KEY = CryptoJS.enc.Hex.parse(
  "a7f3d9c6e8421fb62e7e5c3410b974e2d5c6a8f90fd13b4aa12f658f9a34bc29"
);

const IV = CryptoJS.enc.Hex.parse("d8e2a59f4b1372c3e9a17d684cf1b238");

export function encryptCredentials(username: string, password: string) {
  const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
  if (!SECRET_KEY) {
    throw new Error(
      "SECRET_KEY is undefined! Check your environment variables."
    );
  }
  // Generate random salt
  const salt = CryptoJS.lib.WordArray.random(16);
  // Derive key from secret + salt
  const key = CryptoJS.PBKDF2(SECRET_KEY, salt, {
    keySize: 128 / 32,
    iterations: 65536,
    hasher: CryptoJS.algo.SHA256,
  });
  // Generate random IV
  const iv = CryptoJS.lib.WordArray.random(16);

  // Encrypt username & password using KEY and iv
  const encryptedUsername = CryptoJS.AES.encrypt(username, key, {
    iv,
  }).toString();
  const encryptedPassword = CryptoJS.AES.encrypt(password, key, {
    iv,
  }).toString();

  // Send ciphertext + IV + salt to backend
  return {
    salt: CryptoJS.enc.Base64.stringify(salt),
    iv: CryptoJS.enc.Base64.stringify(iv),
    encryptedUsername,
    encryptedPassword,
  };
}

export const formatDateTime = (dateString: string) => {
  if (!dateString) return "";

  const parsed = moment(dateString); // Automatically parses ISO strings

  if (!parsed.isValid()) return dateString;

  return parsed.format("DD-MM-YYYY HH:mm:ss");
};


// Common text field validation
export const textField = (
  field = "This field",
  max = 100,
  required = false,
  allowSpecialChars = false
) => {
  let schema = Yup.string()
    .transform((value) => (value ? value.trim() : value)) // Trim before validation
    .max(max, `${field} cannot exceed ${max} characters`)
    .nullable()
    .notRequired(); // allow null and undefined by default

  if (!allowSpecialChars) {
    schema = schema.test(
      "no-special-chars",
      `${field} should not contain special characters`,
      (value) => {
        if (!value) return true; // skip if value is null or empty
        return /^[A-Za-z0-9\s._\-()]*$/.test(value);
      }
    );
  }

  if (required) {
    schema = schema.required(`${field} is required`);
  }

  return schema;
};

export const transactionStatusSelectData = [
  { label: "PENDING", value: "PENDING" },
  { label: "APPROVED", value: "APPROVED" },
  { label: "REJECTED", value: "REJECTED" },
];

export const walletTypeSelectData = [
  { value: "PREPAID", label: "PREPAID" },
  { value: "POSTPAID", label: "POSTPAID" },
];

export const booleanSelectData = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

export const booleanSelectData2 = [
  { label: "true", value: "true" },
  { label: "false", value: "false" },
];

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
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*()_+!])[A-Za-z\d@#$%^&*()_+!]{8,}$/;

export const MobileNoRegex = /^[6-9]\d{9}$/;

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


export function exportToCsv<T extends Record<string, any>>(
  data: T[],
  filename: string
) {
  if (!data || data.length === 0) {
    console.warn("No data available to export.");
    return;
  }

  const csv = Papa.unparse(data);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const formatDate = (date: string | Date | null): string | null => {
  if (!date) return null;

  const d = typeof date === "string" ? new Date(date) : date;

  // handle invalid date case (avoid 'NaN-NaN-NaN')
  if (isNaN(d.getTime())) return null;

  // return formatted as DD-MM-YYYY
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};


export const formatYMDdate = (date: string | Date | null): string | null => {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  return `${String(d.getFullYear())}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const singleDateValidationSchema = Yup.date()
  .nullable()
  .required("Date is required");

export const dateRangeValidationSchema = Yup.array()
  .of(Yup.date().nullable())
  .test("date-range-validation", function (value) {
    const [start, end] = value || [];
    const { path, createError } = this;

    if (!start && !end) {
      return createError({ path, message: "Date range is required" });
    }

    if (start && !end) {
      return createError({ path, message: "End date is required" });
    }

    if (!start && end) {
      return createError({ path, message: "Start date is required" });
    }

    if (start && end && new Date(start) > new Date(end)) {
      return createError({
        path,
        message: "Start date must be before or equal to end date",
      });
    }

    return true;
  });

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

export const ellipsisCellStyle = {
  maxWidth: 160,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export const YesNoSelectData = [
  { label: "true", value: "true" },
  { label: "false", value: "false" },
];

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

  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1024;

  const getItemsPerRow = (width: number): number => {
    if (width < 440) return 1; // Mobile
    if (width < 640) return 2; // Mobile
    if (width < 768) return 3; // Small tablets
    if (width < 1024) return 4; // Tablets
    if (width < 1280) return 5; // Small desktops
    if (width < 1536) return 6; // Standard desktops (1440p)
    return 8; // Large screens
  };

  const maxItemsPerRow = getItemsPerRow(screenWidth);
  const result = [];
  let remaining = [...items];

  let rowSize = Math.min(Math.ceil(items.length / 2) + 1, maxItemsPerRow);

  if (items.length - rowSize < 1 && items.length > 1) {
    rowSize = items.length - 1;
  }

  while (remaining.length > 0) {
    const currentRowSize = Math.min(rowSize, remaining.length);
    if (currentRowSize <= 0) break;

    const rowItems = remaining.slice(0, currentRowSize);
    result.push(rowItems);
    remaining = remaining.slice(currentRowSize);

    if (rowSize > 1) {
      rowSize = Math.max(1, rowSize - 1);
    }
  }

  return result;
};

export const MENU_PATH_TO_ROLE_PATTERN: Record<string, number> = {
  "/products": 0,
  "/funding": 1,
  "/settings": 2,
  "/support": 3,
  "/reports": 4,
};

export const subRouteMapping: Record<string, string[]> = {
  "/products": [],
  "/funding": [
    "walletToBankFund",
    "walletToWallet",
    "fundTransfer",
    "walletToBank",
  ],
  "/settings": ["changeTPIN", "myCertificate", "lowBalanceAlert"],
  "/support": ["bioMetricDevice", "ticketingSystem", "contactUs"],
  "/reports": [
    "commissionAndCharges",
    "WalletReport",
    "networkTransaction",
    "accountSummary",
    "searchTransaction",
    "downloadReport",
    "fundLoading",
    "pendingTransaction",
  ],
};

export const hasRouteAccess = (
  path: string,
  role: string,
  loginData: any
): boolean => {
  if (path === "/dashboard") return true;

  if (role !== "RA") {
    return true;
  }

  if (!loginData?.role_id || !loginData?.sub_role_id) {
    return false;
  }

  const menuPath = `/${path.split("/")[1]}`;
  if (menuPath in MENU_PATH_TO_ROLE_PATTERN) {
    const roleIndex = MENU_PATH_TO_ROLE_PATTERN[menuPath];
    if (loginData.role_id[roleIndex] !== "1") {
      return false;
    }

    const subPath = path.split("/").slice(2).join("/");
    if (subPath && menuPath in subRouteMapping) {
      const subRoutes = subRouteMapping[menuPath];
      const routeIndex = subRoutes.findIndex((route) =>
        subPath.startsWith(route)
      );

      if (routeIndex !== -1) {
        const subRole = `${MENU_PATH_TO_ROLE_PATTERN[menuPath] + 1}.${routeIndex + 1}`;
        const subRoles = loginData.sub_role_id
          .split(",")
          .map((s: string) => s.trim())
          .filter((s: string) => s !== "0" && s !== "");

        return subRoles.includes(subRole);
      }
    }
    return true;
  }

  return false;
};

export const getCurrentLocation = (): Promise<{
  latitude: number;
  longitude: number;
  accuracy: number;
  capturedAt: string;
}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({ code: "NOT_SUPPORTED" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        if (accuracy > 1000) {
          reject({ code: "LOW_ACCURACY" });
          return;
        }

        resolve({
          latitude,
          longitude,
          accuracy,
          capturedAt: new Date().toISOString(),
        });
      },
      (error) => {
        switch (error.code) {
          case 1:
            reject({ code: "PERMISSION_DENIED" });
            break;
          case 2:
            reject({ code: "POSITION_UNAVAILABLE" });
            break;
          case 3:
            reject({ code: "TIMEOUT" }); // ignored or slow GPS
            break;
          default:
            reject({ code: "UNKNOWN_ERROR" });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  });
};


