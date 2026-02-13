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
  DASHBOARD_API: `${BASE_URL}/api/dashboard/data`,


  ///////////////// FUNDING //////////////////////////
  PREFUND_REQUEST: `${BASE_URL}/api/prefund/request`,
  WALLET_TO_WALLET: `${BASE_URL}/api/wallet-to-wallet/transfer`,
  FUND_REVERSAL: `${BASE_URL}/api/fund-reversal`,
  FUND_REVERSAL_RESEND_OTP: `${BASE_URL}/api/fund-reversal/resend-otp`,
  CHILD_MEMBER_LIST: `${BASE_URL}/api/dropdown-manager/child-accounts`,
  SINGLE_HIERARCHY_CHILD_LIST: `${BASE_URL}/api/dropdown-manager/child`,
  FUND_TRANSFER: `${BASE_URL}/api/fund-transfer`,
  WALLET_BALANCE: `${BASE_URL}/api/dashboard/wallet-balance`,
  WALLET_TO_BANK: `${BASE_URL}/api/move-to-bank/send-payout-request`,
  FETCH_HIERARCHY_BANKS: `${BASE_URL}/api/bank-details/verified`,

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
  SEARCH_TRANSACTION_REPORT: `${BASE_URL}/api/search-transaction/view`,
  DEBIT_HISTORY_REPORT: `${BASE_URL}/api/debit-credit/report`,
  DOWNLINE_BALANCE_REPORT: `${BASE_URL}/api/downline-balance/report`,
  PENDING_TRANSACTION_REPORT: `${BASE_URL}/api/funding/settlement`,
  FUND_LOADING_REPORT: `${BASE_URL}/api/prefund/all`,
  TRANSACTION_REPORT: `${BASE_URL}/api/funding/transaction-report`,
  TXN_AND_WALLET_REPORT: `${BASE_URL}/api/funding/detailed-txn-report`,

  /////////////// TICKETING SYSTEM //////////////////////////
  TRANSACTION_DETAILS: `${BASE_URL}/api/ticket/transaction-details`,
  TICKET_RAISE: `${BASE_URL}/api/ticket/raise-ticket`,
  FETCH_RAISED_TICKET: `${BASE_URL}/api/ticket`,
  ISSUE_TYPE_DROPDOWN: `${BASE_URL}/api/ticket/issue-type-dropdown`,

  ///////////////////// PG /////////////////////////////////
  FETCH_CARD_TYPE: `${BASE_URL}/api/transaction/fetch-card-bin-details`,
  VALIDATE_TRANSACTION: `${BASE_URL}/api/pg/validate`,
  CREATE_ORDER: `${BASE_URL}/api/pg/create-order`,

  ///////////////// CREATE SUB USER //////////////////////////
  CREATE_SUB_USER: `${BASE_URL}/api/retailer/create-user`,
  FETCH_SUB_USER: `${BASE_URL}/api/retailer/users`,

  /////////////// PAYOUT ////////////////////////////////////////////
  SAVE_BENEFICIARY: `${BASE_URL}/api/payout/save-beneficiary`,
  // SEND_PAYOUT: `${BASE_URL}/api/send-payout`,
  // PAYOUT_SUCCESS_CALLBACK: `${BASE_URL}/api/update-callback-url`,
  SEND_PAYOUT: `${BASE_URL}/api/send-payout-vo`,
  PAYOUT_SUCCESS_CALLBACK: `${BASE_URL}/api/update-callback-url`,
  GET_BANK_DETAILS: `${BASE_URL}/api/network-banks/details-by-ifsc`,
  GET_PAYOUT_ALL_DETAILS: `${BASE_URL}/api/payout/all`,
  DELETE_PAYOUT_BENEFICIARY: `${BASE_URL}/api/payout/delete-beneficiaries`,
  EDIT_BENEFICIARY_BANK_DETAILS: `${BASE_URL}/api/payout/update-beneficiaries`,

  /////////////////// BBPS ///////////////////////////////////////
  GET_PROVIDER_LIST: `${BASE_URL}/api/bbps/provider-list`,
  FETCH_BILL_DETAILS: `${BASE_URL}/api/bbps/fetch-bill-details`,
  TRANSACTION: `${BASE_URL}/api/bbps/transaction`,
  FETCH_TRANSACTION_RECEIPT: `${BASE_URL}/api/bbps/receipt`,

  GET_SERVICES_LIST: `${BASE_URL}/billpay/config/services`,
  GET_PROVIDERS: `${BASE_URL}/billpay/config/providers`,
  GET_PROVIDER_CONFIG: `${BASE_URL}/billpay/config/raw-config`,

  //////////////////////////// DMT /////////////////////////////////
  FIND_REMITTER: `${BASE_URL}/api/remitter/check`,
  REGISTER_REMITTER: `${BASE_URL}/api/remitter/register`,
  REMITTER_SEND_OTP: `${BASE_URL}/api/remitter/send-otp`,
  REMITTER_RESEND_OTP: `${BASE_URL}/api/remitter/resend-otp`,
  UPDATE_REMITTER: `${BASE_URL}/api/remitter/update`,
  REMITTER_KYC: `${BASE_URL}/api/remitter/ekyc`,
  FETCH_REMITTER_DETAILS: `${BASE_URL}/api/remitter/fetch-details`,
  REGISTER_BENEFICIARY: `${BASE_URL}/api/beneficiary/register`,
  FETCH_BENEFICIARY: `${BASE_URL}/api/beneficiary/fetchBeneficiary`,
  EDIT_BENEFICIARY: `${BASE_URL}/api/beneficiary/update`,
  FETCH_BENEFICIARY_BY_ID: `${BASE_URL}/api/beneficiary/fetchBeneficiaryByBeneId`,
  DELETE_BENEFICIARY: `${BASE_URL}/api/beneficiary/delete`,
  DMT_TRANX_SEND_OTP: `${BASE_URL}/api/dmt/send-otp`,
  DMT_TRANSACTION: `${BASE_URL}/api/dmt/transaction`,
  DMT_BANK_LIST: `${BASE_URL}/api/dmt/bank-list`,

  ///////////////////////////// AEPS ////////////////////////////////
  AEPS_CHECK_STATUS: `${BASE_URL}/api/merchant/check-status`,
  VERIFY_LOCATION: `${BASE_URL}/api/geo/check`,
  AEPS_MERCHANT_ONBOARD: `${BASE_URL}/api/merchant/onboarding`,
  AEPS_SEND_OTP: `${BASE_URL}/aeps/ekyc/send-otp`,
  AEPS_RESEND_OTP: `${BASE_URL}/aeps/ekyc/resend-otp`,
  AEPS_VALIDATE_EKYC: `${BASE_URL}/aeps/ekyc/validate-otp-biometric`,
  AEPS_TWO_FA: `${BASE_URL}/aeps/2fa/validate-aadhar`,
  AEPS_BANK_LIST: `${BASE_URL}/api/aeps/bank-list`,
  AEPS_2FA_CHECK_STATUS: `${BASE_URL}/aeps/2fa/check-status`,

  /////////////////// VERIFICATION //////////////////////////////////
  ADHAAR_VERIFICATION: `${BASE_URL}/verification/aadhaar-validate`,
  PAN_VERIFICATION: `${BASE_URL}/verification/pan-validate`,
  EMAIL_VERIFICATION: `${BASE_URL}/verification/email-validate`,
  ADHAAR_PAN_LINK: `${BASE_URL}/verification/aadhaar-pan-link`,
  VOTER_ID_VERIFICATION: `${BASE_URL}/verification/voterId-validate`,
  BANK_VERIFICATION: `${BASE_URL}/verification/bank-validate`,
  CASH_WITHDRAWAL: `${BASE_URL}/api/aeps/cash-withdrawal`,
  BALANCE_INQUIRY: `${BASE_URL}/api/aeps/balance-inquiry`,
  MINI_STATEMENT: `${BASE_URL}/api/aeps/mini-statement`,

  /////////////////////////// bANKS ////////////////////////////////////
  ADD_BANK: `${BASE_URL}/api/bank-details`,
  EDIT_BANK: `${BASE_URL}/api/bank-details`,
  DELETE_BANK: `${BASE_URL}/api/bank-details`,

  /////////////////////////// COMMON ////////////////////////////////////
  HIERARCHY_TYPE_LIST: `${BASE_URL}/api/hierarchy/name-code`,
  HIERARCHY_LIST: `${BASE_URL}/api/hierarchy/hierarchy-details`,
  PRODUCT_LIST: `${BASE_URL}/api/products/dropdown/active`,
  SUB_PRODUCT_DROPDOWN: `${BASE_URL}/api/sub-products/dropdown`,

  /////////////////////////// BILL AVENUE ////////////////////////////////////
  BILLAVENUE_BILLER_INFO: `${BASE_URL}/api/billavenue/biller-info`,
  BILLAVENUE_BILL_FETCH: `${BASE_URL}/api/billavenue/bill-fetch`,
  BILLAVENUE_BILL_PAYMENT: `${BASE_URL}/api/billavenue/bill-payment`,

};
