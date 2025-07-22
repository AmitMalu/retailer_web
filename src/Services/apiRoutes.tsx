const BASE_URL = import.meta.env.VITE_SERVER_URL;
//|| "https://uat.decipay.in/enterprises"

export const API_ROUTES = {
  TOKEN_GENERATION: `${BASE_URL}/api/aes/generate-token`,
  VERIFY_TOKEN: `${BASE_URL}/api/aes/validate-token`,

  //////////////// Auth /////////////////////
  LOGIN: `${BASE_URL}/auth/login`,
  FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
  VERIFY_OTP: `${BASE_URL}/auth/verify-otp`,
  VERIFY_FORGET_OTP: `${BASE_URL}/auth/forget-verify-otp`,
  RESEND_OTP: `${BASE_URL}/auth/resend-otp`,
  SET_PASSWORD: `${BASE_URL}/auth/set-password`,

  ///////////////// MAIN /////////////////////////////
  PREFUND_REQUEST: `${BASE_URL}/api/prefund/request`,
  WALLET_TO_WALLET: `${BASE_URL}/api/wallet-to-wallet/transfer`,
  FUND_REVERSAL: `${BASE_URL}/api/fund-reversal`,
  CHILD_MEMBER_LIST: `${BASE_URL}/api/dropdown-manager/child-accounts`,
  FUND_TRANSFER: `${BASE_URL}/api/fund-transfer`,
  WALLET_BALANCE: `${BASE_URL}/api/dashboard/wallet-balance`,
  PROFILE: `${BASE_URL}/api/dashboard/profile`,
};
