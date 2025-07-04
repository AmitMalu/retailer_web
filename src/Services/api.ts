import {
  ForgotPasswordRequestProps,
  FundReversalProps,
  FundTransferProps,
  LoginRequest,
  OtpRequestProps,
  ResendOtpRequestProps,
  SetPasswordRequestProps,
  TokenGenerationRequest,
  VerifyTokenRequest,
  WalletToWalletProps,
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

export const Prefund_Request = async (data: FormData) =>
  await api.post(
    `${API_ROUTES.PREFUND_REQUEST}`,
    data,
    await createMultipartHeaders()
  );

export const Fund_Transfer = async (data: FundTransferProps) =>
  await api.post(`${API_ROUTES.FUND_TRANSFER}`, data, await createHeaders());

export const Fund_Reversal = async (data: FundReversalProps) =>
  await api.post(`${API_ROUTES.FUND_REVERSAL}`, data, await createHeaders());

export const Wallet_To_Wallet = async (data: WalletToWalletProps) =>
  await api.post(`${API_ROUTES.WALLET_TO_WALLET}`, data, await createHeaders());

export const Wallet_Balance = async (id: string) =>
  await api.get(`${API_ROUTES.WALLET_BALANCE}/${id}`, await createHeaders());

export const Profile = async (id: string) =>
  await api.get(`${API_ROUTES.PROFILE}/${id}`, await createHeaders());

export const Child_Member_List = async (id: string) =>
  await api.get(`${API_ROUTES.CHILD_MEMBER_LIST}/${id}`, await createHeaders());
