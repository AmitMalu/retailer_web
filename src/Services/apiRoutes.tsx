const BASE_URL = import.meta.env.VITE_SERVER_URL;
//|| "https://uat.decipay.in/enterprises"

export const API_ROUTES = {
  TOKEN_GENERATION: `${BASE_URL}/api/aes/generate-token`,
  VERIFY_TOKEN: `${BASE_URL}/api/aes/validate-token`,

  //////////////// Auth /////////////////////
  LOGIN: `${BASE_URL}/auth/login`,
  FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
  VERIFY_OTP: `${BASE_URL}/auth/verify-otp`,
  RESEND_OTP: `${BASE_URL}/auth/resend-otp`,
  SET_PASSWORD: `${BASE_URL}/auth/set-password`,
};
