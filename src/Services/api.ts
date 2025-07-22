import {
  ForgotPasswordRequestProps,
  LoginRequest,
  OtpRequestProps,
  ResendOtpRequestProps,
  SetPasswordRequestProps,
  TokenGenerationRequest,
  VerifyTokenRequest,
} from "@/Common/interface";
import api from ".";
import { API_ROUTES } from "./apiRoutes";

export const isAuthenticated = () => {
  const authToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
  return {
    isAuthenticated: !!authToken,
  };
};

const createHeaders = async () => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="));
  return {
    headers: {
      Authorization: `Bearer ${
        token ? decodeURIComponent(token.split("=")[1]) : ""
      }`,
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      // Accept: 'application/json, text/plain, */*',
    },
  };
};

const createMultipartHeaders = async () => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="));
  return {
    headers: {
      Authorization: `Bearer ${
        token ? decodeURIComponent(token.split("=")[1]) : ""
      }`,
      "Content-Type": "multipart/form-data",
      // 'Access-Control-Allow-Origin': '*',
      Accept: "application/json, text/plain, */*",
    },
  };
};

export const Token_generation = async (body: TokenGenerationRequest) =>
  await api.post(`${API_ROUTES.TOKEN_GENERATION}?username=${body.userName}`);

export const Verify_Token = async (body: VerifyTokenRequest) =>
  await api.post(API_ROUTES.VERIFY_TOKEN, body);

export const login = async (data: LoginRequest) =>
  await api.post(API_ROUTES.LOGIN, data);

export const Forgot_Password = async (data: ForgotPasswordRequestProps) =>
  await api.post(API_ROUTES.FORGOT_PASSWORD, data);

export const Verify_Otp = async (data: OtpRequestProps) =>
  await api.post(API_ROUTES.VERIFY_OTP, data);

export const Verify_Forget_Otp = async (data: OtpRequestProps) =>
  await api.post(API_ROUTES.VERIFY_FORGET_OTP, data);

export const Resend_Otp = async (data: ResendOtpRequestProps) =>
  await api.post(API_ROUTES.RESEND_OTP, data);

export const Set_Password = async (data: SetPasswordRequestProps) =>
  await api.post(API_ROUTES.SET_PASSWORD, data);
