
import FingpayStatusScreen from "./Fingpay/AepsStatusScreen";
import FingpayServiceScreen from "./Fingpay/AepsServiceScreen";
import FingpayEkycScreen from "./Fingpay/AepsEkycScreen";
import FingpayTransaction from "./Fingpay/AepsTransaction";
import FingpayTwoFactor from "./Fingpay/AepsTwoFactor";

import InstantpayStatusScreen from "./Instantpay/AepsStatusScreen";
import InstantpayServiceScreen from "./Instantpay/AepsServiceScreen";
import InstantpayEkycScreen from "./Instantpay/AepsEkycScreen";
import InstantpayTransaction from "./Instantpay/AepsTransaction";
import InstantpayTwoFactor from "./Instantpay/AepsTwoFactor";
import { API_ROUTES } from "@/Services/apiRoutes";

export type VendorKey = keyof typeof AEPS_API_CONFIG;
export type AepsApiType =
    keyof (typeof AEPS_API_CONFIG)[VendorKey];

export type AepsScreenProps = {
    vendorKey: VendorKey;
};

const VENDOR_MATCHERS: Record<VendorKey, (name: string) => boolean> = {
    fingpay: (name) => name.includes("fingpay"),
    instantpay: (name) => name.includes("instantpay"),
};

export function resolveVendor(vendorName?: string): VendorKey | null {
    if (!vendorName) return null;

    const name = vendorName.toLowerCase();

    const match = Object.entries(VENDOR_MATCHERS).find(([_, fn]) =>
        fn(name)
    );

    return (match?.[0] as VendorKey) || null;
}

//COMPONENTS CONFIGURATION
export const AEPS_VENDOR_CONFIG: Record<VendorKey, any> = {
    fingpay: {
        status: FingpayStatusScreen,
        service: FingpayServiceScreen,
        ekyc: FingpayEkycScreen,
        transaction: FingpayTransaction,
        twoFactor: FingpayTwoFactor,
    },
    instantpay: {
        status: InstantpayStatusScreen,
        service: InstantpayServiceScreen,
        ekyc: InstantpayEkycScreen,
        transaction: InstantpayTransaction,
        twoFactor: InstantpayTwoFactor,
    },
} as const;


//API CONFIGURATION
export const AEPS_API_CONFIG = {
    fingpay: {
        verifyLocation: { url: API_ROUTES.VERIFY_LOCATION, method: "POST" },
        checkStatus: { url: API_ROUTES.AEPS_CHECK_STATUS, method: "POST" },
        onboard: { url: API_ROUTES.AEPS_MERCHANT_ONBOARD, method: "POST" },
        sendOtp: { url: API_ROUTES.AEPS_SEND_OTP, method: "POST" },
        resendOtp: { url: API_ROUTES.AEPS_RESEND_OTP, method: "POST" },
        verifyOtp: { url: API_ROUTES.AEPS_VALIDATE_EKYC, method: "POST" },
        checkKycStatus: null,
        kyc: null,
        bankList: { url: API_ROUTES.AEPS_BANK_LIST, method: "GET" },
        checkAeps2FaStatus: { url: API_ROUTES.AEPS_2FA_CHECK_STATUS, method: "POST" },
        twoFactor: { url: API_ROUTES.AEPS_TWO_FA, method: "POST" },
        cashWithdrawal: { url: API_ROUTES.CASH_WITHDRAWAL, method: "POST" },
        balanceInquiry: { url: API_ROUTES.BALANCE_INQUIRY, method: "POST" },
        miniStatement: { url: API_ROUTES.MINI_STATEMENT, method: "POST" },
    },

    instantpay: {
        verifyLocation: { url: API_ROUTES.VERIFY_LOCATION, method: "POST" },
        checkStatus: { url: API_ROUTES.AEPS_CHECK_STATUS_INSTANTPAY, method: "POST" },
        onboard: { url: API_ROUTES.AEPS_MERCHANT_ONBOARD_INSTANTPAY, method: "POST" },
        sendOtp: null,
        resendOtp: null,
        verifyOtp: null,
        checkKycStatus: { url: API_ROUTES.AEPS_KYC_CHECK_STATUS_INSTANTPAY, method: "POST" },
        kyc: { url: API_ROUTES.AEPS_KYC_INSTANTPAY, method: "POST" },
        bankList: { url: API_ROUTES.AEPS_BANK_LIST_INSTANTPAY, method: "POST" },
        checkAeps2FaStatus: { url: API_ROUTES.AEPS_2FA_CHECK_STATUS_INSTANTPAY, method: "POST" },
        twoFactor: { url: API_ROUTES.AEPS_VALIDATE_2FA_INSTANTPAY, method: "POST" },
        cashWithdrawal: { url: API_ROUTES.CASH_WITHDRAWAL_INSTANTPAY, method: "POST" },
        balanceInquiry: { url: API_ROUTES.BALANCE_INQUIRY_INSTANTPAY, method: "POST" },
        miniStatement: { url: API_ROUTES.MINI_STATEMENT_INSTANTPAY, method: "POST" },
    },
};
