import type { UserRole } from "@/Common/interface";

export interface BotOption {
  label: string;
  path: string;
  allowedRoles?: UserRole[];
  isAuthRoute?: boolean;
}

export interface BotConfigItem {
  keywords: string[];
  reply: string;
  options: BotOption[];
}

const ROLES_ALL: UserRole[] = ["WL", "SD", "PT", "DT", "RT", "RU"];
const ROLES_RT_RU: UserRole[] = ["RT", "RU"];
const ROLES_WL_SD_PT_DT: UserRole[] = ["WL", "SD", "PT", "DT"];
const ROLES_WL_SD_RT_RU: UserRole[] = ["WL", "SD", "RT", "RU"];

export const BOT_ROUTE_OPTIONS: BotOption[] = [
  { label: "Dashboard", path: "/dashboard", allowedRoles: ROLES_ALL },

  { label: "Products", path: "/products", allowedRoles: ROLES_RT_RU },
  { label: "PG", path: "/products/pgScreen", allowedRoles: ROLES_RT_RU },
  { label: "Payout", path: "/products/payoutScreen", allowedRoles: ROLES_RT_RU },
  { label: "AEPS", path: "/products/aeps", allowedRoles: ROLES_RT_RU },
  { label: "DMT", path: "/products/dmt", allowedRoles: ROLES_RT_RU },
  { label: "MPOS", path: "/products/mpos", allowedRoles: ROLES_RT_RU },
  { label: "Bill Pay", path: "/products/billPay", allowedRoles: ROLES_RT_RU },
  {
    label: "Create User",
    path: "/manageUser/createUser",
    allowedRoles: ROLES_WL_SD_PT_DT,
  },
  {
    label: "Debit and Credit User",
    path: "/manageUser/debitAndCreditUser",
    allowedRoles: ROLES_WL_SD_PT_DT,
  },
  {
    label: "View User",
    path: "/manageUser/ViewUser",
    allowedRoles: ROLES_WL_SD_PT_DT,
  },

  {
    label: "Network Transaction",
    path: "/reports/networkTransaction",
    allowedRoles: ROLES_WL_SD_PT_DT,
  },
  {
    label: "Transaction Report",
    path: "/reports/transaction-report",
    allowedRoles: ROLES_RT_RU,
  },
  {
    label: "TXN Wallet Report",
    path: "/reports/txn-wallet-report",
    allowedRoles: ROLES_RT_RU,
  },
  { label: "Account Summary", path: "/reports/accountSummary", allowedRoles: ROLES_ALL },
  { label: "Wallet Report", path: "/reports/WalletReport", allowedRoles: ROLES_ALL },
  {
    label: "Search Transaction",
    path: "/reports/searchTransaction",
    allowedRoles: ROLES_ALL,
  },
  {
    label: "Download Report",
    path: "/reports/downloadReport",
    allowedRoles: ROLES_ALL,
  },
  { label: "Fund Loading", path: "/reports/fundLoading", allowedRoles: ROLES_ALL },
  {
    label: "Payment Loading",
    path: "/reports/paymentLoading",
    allowedRoles: ROLES_WL_SD_PT_DT,
  },
  {
    label: "Commission and Charges",
    path: "/reports/commissionAndCharges",
    allowedRoles: ROLES_ALL,
  },
  {
    label: "Pending Transaction",
    path: "/reports/pendingTransaction",
    allowedRoles: ROLES_RT_RU,
  },
  {
    label: "Debit History",
    path: "/reports/debitHistory",
    allowedRoles: ROLES_WL_SD_PT_DT,
  },
  {
    label: "Agent Performance",
    path: "/reports/agentPerformance",
    allowedRoles: ROLES_WL_SD_PT_DT,
  },
  {
    label: "Bank Withdrawal",
    path: "/reports/bankWithdrawal",
    allowedRoles: ROLES_WL_SD_PT_DT,
  },
  {
    label: "Down Line Balance",
    path: "/reports/downLineBalance",
    allowedRoles: ROLES_WL_SD_PT_DT,
  },

  { label: "My Profile", path: "/settings/myProfile", allowedRoles: ROLES_ALL },
  { label: "Create Sub User", path: "/settings/subUser", allowedRoles: ["RT"] },
  { label: "View Sub User", path: "/settings/ViewSubUser", allowedRoles: ["RT"] },
  { label: "Change TPIN", path: "/settings/changeTPIN", allowedRoles: ROLES_ALL },
  { label: "My Certificate", path: "/settings/myCertificate", allowedRoles: ROLES_ALL },
  {
    label: "Low Balance Alert",
    path: "/settings/lowBalanceAlert",
    allowedRoles: ROLES_RT_RU,
  },
  { label: "ID Card", path: "/settings/idCard", allowedRoles: ROLES_WL_SD_PT_DT },
  {
    label: "Bio Metric Device",
    path: "/support/bioMetricDevice",
    allowedRoles: ROLES_RT_RU,
  },
  {
    label: "Ticketing System",
    path: "/support/ticketingSystem",
    allowedRoles: ROLES_ALL,
  },
  {
    label: "Contact Us",
    path: "/support/contactUs",
    allowedRoles: ROLES_WL_SD_RT_RU,
  },
  {
    label: "Top Up Request",
    path: "/support/topUpRequest",
    allowedRoles: ROLES_WL_SD_PT_DT,
  },
  {
    label: "Top Up History",
    path: "/support/topUpHistory",
    allowedRoles: ROLES_WL_SD_PT_DT,
  },
  { label: "Add Money", path: "/support/addMoney", allowedRoles: ROLES_WL_SD_PT_DT },
  {
    label: "Payment Request",
    path: "/support/paymentRequest",
    allowedRoles: ROLES_WL_SD_PT_DT,
  },
  {
    label: "Payment History",
    path: "/support/paymentHistory",
    allowedRoles: ROLES_WL_SD_PT_DT,
  },
  {
    label: "Payment Banks",
    path: "/support/paymentBanks",
    allowedRoles: ROLES_WL_SD_PT_DT,
  },

  { label: "Wallet to Bank", path: "/funding/walletToBank", allowedRoles: ROLES_ALL },
  {
    label: "Fund Request",
    path: "/funding/walletToBankFund",
    allowedRoles: ROLES_ALL,
  },
  {
    label: "Wallet to Wallet",
    path: "/funding/walletToWallet",
    allowedRoles: ROLES_ALL,
  },
  { label: "Fund Transfer", path: "/funding/fundTransfer", allowedRoles: ROLES_ALL },
  {
    label: "Fund Reversal",
    path: "/funding/fundReversal",
    allowedRoles: ROLES_WL_SD_PT_DT,
  },

  { label: "Website Data", path: "/websiteSettings/websiteData", allowedRoles: ["WL"] },
  {
    label: "Social Media Links",
    path: "/websiteSettings/socialMediaLinks",
    allowedRoles: ["WL"],
  },
  {
    label: "Web and App Logo",
    path: "/websiteSettings/webAndAppLogoImage",
    allowedRoles: ["WL"],
  },
  {
    label: "Website Page Content",
    path: "/websiteSettings/websitePageContent",
    allowedRoles: ["WL"],
  },

  { label: "Login", path: "/login", isAuthRoute: true },
  { label: "Sign Up", path: "/signUp", isAuthRoute: true },
  { label: "Forgot Password", path: "/forgotPassword", isAuthRoute: true },
  { label: "Set Password", path: "/setPassword", isAuthRoute: true },
];

const getOptionsByPrefix = (prefix: string) =>
  BOT_ROUTE_OPTIONS.filter((option) => option.path.startsWith(prefix));

export const BOT_CONFIG: BotConfigItem[] = [
  {
    keywords: ["dashboard", "home"],
    reply: "Open dashboard:",
    options: BOT_ROUTE_OPTIONS.filter((option) => option.path === "/dashboard"),
  },
  {
    keywords: [
      "product",
      "products",
      "pg",
      "payout",
      "aeps",
      "dmt",
      "mpos",
      "billpay",
      "bill payment",
    ],
    reply: "Here are product",
    options: getOptionsByPrefix("/products"),
  },
  {
    keywords: [
      "report",
      "reports",
      "transaction",
      "wallet report",
      "commission",
      "fund loading",
    ],
    reply: "Here are report",
    options: getOptionsByPrefix("/reports"),
  },
  {
    keywords: [
      "funding",
      "fund",
      "wallet to bank",
      "wallet to wallet",
      "fund transfer",
      "fund reversal",
    ],
    reply: "Here are funding",
    options: getOptionsByPrefix("/funding"),
  },
  {
    keywords: [
      "setting",
      "settings",
      "profile",
      "tpin",
      "certificate",
      "id card",
      "sub user",
    ],
    reply: "Here are settings",
    options: getOptionsByPrefix("/settings"),
  },
  {
    keywords: [
      "support",
      "ticket",
      "contact",
      "payment request",
      "top up",
      "add money",
    ],
    reply: "Here are support",
    options: getOptionsByPrefix("/support"),
  },
  {
    keywords: ["manage user", "create user", "debit user", "credit user", "view user"],
    reply: "Here are manage user",
    options: getOptionsByPrefix("/manageUser"),
  },
  {
    keywords: ["website settings", "website", "social media", "logo"],
    reply: "Here are website settings",
    options: getOptionsByPrefix("/websiteSettings"),
  },
  {
    keywords: ["login", "signup", "sign up", "forgot password", "otp", "set password"],
    reply: "Here are auth",
    options: BOT_ROUTE_OPTIONS.filter((option) =>
      ["/login", "/signUp", "/forgotPassword", "/setPassword"].includes(
        option.path,
      ),
    ),
  },
];
