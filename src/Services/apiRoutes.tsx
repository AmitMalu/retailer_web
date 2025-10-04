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
  USER_PROFILE: `${BASE_URL}/api/dashboard/profile`,
  CHANGE_PASSWORD: `${BASE_URL}/auth/change-password`,

  ///////////////// FUNDING //////////////////////////
  PREFUND_REQUEST: `${BASE_URL}/api/prefund/request`,
  WALLET_TO_WALLET: `${BASE_URL}/api/wallet-to-wallet/transfer`,
  FUND_REVERSAL: `${BASE_URL}/api/fund-reversal`,
  CHILD_MEMBER_LIST: `${BASE_URL}/api/dropdown-manager/child-accounts`,
  FUND_TRANSFER: `${BASE_URL}/api/fund-transfer`,
  WALLET_BALANCE: `${BASE_URL}/api/dashboard/wallet-balance`,
  WALLET_TO_BANK: `${BASE_URL}/api/wallet-to-bank/transfer`,

  ///////////////// CREATE USER //////////////////////////
  CREATE_WHITE_LABEL: `${BASE_URL}/api/white-labels`,
  CREATE_SUPER_DISTRIBUTOR: `${BASE_URL}/api/super-distributors`,
  CREATE_PARTNER: `${BASE_URL}/api/partners`,
  CREATE_DISTRIBUTOR: `${BASE_URL}/api/distributors`,
  CREATE_RETAILER: `${BASE_URL}/api/retailers`,

  //////////////// REPORTS //////////////////////////
  COMMISSION_AND_CHARGES: `${BASE_URL}/api/commission-charge/view`,
  WALLET_REPORT: `${BASE_URL}/api/my-transaction/view`,
  NETWORK_TRANSACTION_REPORT: `${BASE_URL}/api/network-transaction/view`,

  /////////////// TICKETING SYSTEM //////////////////////////
  TRANSACTION_DETAILS: `${BASE_URL}/api/ticket/transaction-details`,
  TICKET_RAISE: `${BASE_URL}/api/ticket/raise-ticket`,
  FETCH_RAISED_TICKET: `${BASE_URL}/api/ticket`,
  ISSUE_TYPE_DROPDOWN: `${BASE_URL}/api/ticket/issue-type-dropdown`,
  SUB_PRODUCT_DROPDOWN: `${BASE_URL}/api/sub-products/dropdown`,

  ///////////////////// PG /////////////////////////////////
  FETCH_CARD_TYPE: `${BASE_URL}/api/transaction/fetch-card-bin-details`,
  VALIDATE_TRANSACTION: `${BASE_URL}/api/pg/validate`,
  CREATE_ORDER: `${BASE_URL}/api/pg/create-order`,

  ///////////////// CREATE SUB USER //////////////////////////
  CREATE_SUB_USER: `${BASE_URL}/api/retailer/create-user`,

  /////////////// PAYOUT ////////////////////////////////////////////
  SAVE_BENEFICIARY: `${BASE_URL}/api/payout/save-beneficiary`,
  SEND_PAYOUT: `${BASE_URL}/api/payout/send-payout-request`,
  GET_BANK_DETAILS: `${BASE_URL}/api/network-banks/details-by-ifsc`,
  GET_PAYOUT_ALL_DETAILS: `${BASE_URL}/api/payout/all`,
  DELETE_PAYOUT_BENEFICIARY: `${BASE_URL}/api/payout/delete-beneficiaries`,
  EDIT_BENEFICIARY_BANK_DETAILS: `${BASE_URL}/api/payout/update-beneficiaries`,

  /////////////////// BBPS ///////////////////////////////////////
  GET_PROVIDER_LIST: `${BASE_URL}/api/bbps/provider-list`,
  FETCH_BILL_DETAILS: `${BASE_URL}/api/bbps/fetch-bill-details`,

  /////////////////// VERIFICATION //////////////////////////////////
  ADHAAR_VERIFICATION: `${BASE_URL}/verification/aadhaar-validate`,
  PAN_VERIFICATION: `${BASE_URL}/verification/pan-validate`,
  EMAIL_VERIFICATION: `${BASE_URL}/verification/email-validate`,
  ADHAAR_PAN_LINK: `${BASE_URL}/verification/aadhaar-pan-link`,
  VOTER_ID_VERIFICATION: `${BASE_URL}/verification/voterId-validate`,
  BANK_VERIFICATION: `${BASE_URL}/verification/bank-validate`,

  /////////////////////////// bANKS ////////////////////////////////////
  ADD_BANK: `${BASE_URL}/api/bank-details`,
};
