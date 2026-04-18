import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { lazy, Suspense, memo } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import OtpInputScreen from "@/pages/Auth/Otp";
import SetPasswordScreen from "@/pages/Auth/SetPassword";
import SignUp from "@/pages/Auth/SignUp.tsx";
import Loader from "@/components/Atoms/Loader";
import ProtectedRoute from "./ProtectedRoutes";
import AepsSubProductsScreen from "@/pages/Home/Products/AEPS/AepsSubproductsScreen";
import WrapperFormPage from "@/pages/Home/Products/BillPayment/WrapperFormPage";
import TransactionReport from "@/pages/Home/Reports/TransactionReport";
import TransactionWalletReport from "@/pages/Home/Reports/TransactionWalletReport";
import RechargeSubProducts from "@/pages/Home/Products/Recharge/RechargeSubProducts";
import Recharge from "@/pages/Home/Products/Recharge/Recharge";
import AepsVendorWrapper from "@/pages/Home/Products/AEPS/AepsVendorWrapper";
import CreditCardScreen from "@/pages/Home/Products/CreditCard/CreditCardScreen";
const Dashboard = lazy(() => import("@/pages/Home/Dashboard"));
const CreateUser = lazy(() => import("@/pages/Home/ManageUser/CreateUser"));
const DebitAndCreditUser = lazy(
  () => import("@/pages/Home/ManageUser/DebitAndCreditUser")
);
const ViewUser = lazy(() => import("@/pages/Home/ManageUser/ViewUser"));
const Products = lazy(() => import("@/pages/Home/Products/Products"));
const WalletToBank = lazy(() => import("@/pages/Home/Funding/WalletToBank"));
const FundTransfer = lazy(() => import("@/pages/Home/Funding/FundTransfer"));
const FundReversal = lazy(() => import("@/pages/Home/Funding/FundReversal"));
const WalletToBankFund = lazy(
  () => import("@/pages/Home/Funding/WalletToBankFund")
);
const WalletToWallet = lazy(
  () => import("@/pages/Home/Funding/WalletToWallet")
);
const NetworkTransaction = lazy(
  () => import("@/pages/Home/Reports/NetworkTransaction")
);
const WalletReport = lazy(() => import("@/pages/Home/Reports/WalletReport"));
const AccountSummary = lazy(
  () => import("@/pages/Home/Reports/AccountSummary")
);
const SearchTransaction = lazy(
  () => import("@/pages/Home/Reports/SearchTransaction")
);
const DownloadReport = lazy(
  () => import("@/pages/Home/Reports/DownloadReport")
);
const FundLoading = lazy(() => import("@/pages/Home/Reports/FundLoading"));
const PaymentLoading = lazy(
  () => import("@/pages/Home/Reports/PaymentLoading")
);
const CommissionAndCharges = lazy(
  () => import("@/pages/Home/Reports/CommissionAndCharges")
);
const PendingTransaction = lazy(
  () => import("@/pages/Home/Reports/PendingTransaction")
);
const DebitHistory = lazy(() => import("@/pages/Home/Reports/DebitHistory"));
const AgentPerformance = lazy(
  () => import("@/pages/Home/Reports/AgentPerformance")
);
const BankWithdrawal = lazy(
  () => import("@/pages/Home/Reports/BankWithdrawal")
);
const DownLineBalance = lazy(
  () => import("@/pages/Home/Reports/DownLineBalance")
);
const MyProfile = lazy(() => import("@/pages/Home/Settings/MyProfile"));
const CreateSubUser = lazy(
  () => import("@/pages/Home/Settings/MyProfile/Subuser")
);
const ViewSubUser = lazy(
  () => import("@/pages/Home/Settings/MyProfile/Subuser/ViewSubUser")
);
const ChangeTPIN = lazy(() => import("@/pages/Home/Settings/ChangeTPin"));
const MyCertificate = lazy(() => import("@/pages/Home/Settings/MyCertificate"));
const LowBalanceAlert = lazy(
  () => import("@/pages/Home/Settings/LowBalanceAlert")
);
const IDCard = lazy(() => import("@/pages/Home/Settings/IdCard"));
const BioMetricDevice = lazy(
  () => import("@/pages/Home/Support/BioMetricDevice")
);
const Ticketing = lazy(() => import("@/pages/Home/Support/TicketingSystem"));
const ContactUs = lazy(() => import("@/pages/Home/Support/ContactUs"));
const TopUpRequest = lazy(() => import("@/pages/Home/Support/TopUpRequest"));
const TopUpHistory = lazy(() => import("@/pages/Home/Support/TopUpHIstory"));
const AddMoney = lazy(() => import("@/pages/Home/Support/AddMoney"));
const PaymentRequest = lazy(
  () => import("@/pages/Home/Support/PaymentRequest")
);
const PaymentHistory = lazy(
  () => import("@/pages/Home/Support/PaymentHistory")
);
const PaymentBanks = lazy(() => import("@/pages/Home/Support/PaymentBanks"));

const WebsiteData = lazy(
  () => import("@/pages/Home/WebsiteSettings/WebsiteData")
);
const SocialMediaLinks = lazy(
  () => import("@/pages/Home/WebsiteSettings/SocialMediaLinks")
);
const WebAndAppLogo = lazy(
  () => import("@/pages/Home/WebsiteSettings/WebAndAppLogo")
);
const WebsitePageContent = lazy(
  () => import("@/pages/Home/WebsiteSettings/WebsitePageContent")
);
const Login = lazy(() => import("@/pages/Auth/Login"));
const TransactionCompleted = lazy(() => import("@/pages/Home/Products/TransactionCompleted"));
const PGScreen = lazy(() => import("@/pages/Home/Products/PG"));
const PayoutScreen = lazy(() => import("@/pages/Home/Products/Payout"));
const PayoutInfoTable = lazy(
  () => import("@/pages/Home/Products/Payout/InfoTable")
);
const DmtSubProductsScreen = lazy(() => import("@/pages/Home/Products/DMT/DmtSubProductsScreen"));
const SearchRemitterScreen = lazy(() => import("@/pages/Home/Products/DMT/SearchRemitterScreen"))

const RemitterInfo = lazy(
  () => import("@/pages/Home/Products/DMT/RemitterInfo")
);

const RemitterRegister = lazy(
  () => import("@/pages/Home/Products/DMT/RemitterRegister")
);

const RemitterEkyc = lazy(
  () => import("@/pages/Home/Products/DMT/RemitterEkyc")
);

const MposScreen = lazy(() => import("@/pages/Home/Products/MPOS"));
const SubProductScreen = lazy(
  () => import("@/pages/Home/Products/BillPayment/SubProductScreen")
);
const ServicesScreen = lazy(
  () => import("@/pages/Home/Products/BillPayment/ServicesScreen")
);

const getToken = () => {
  const token = document.cookie
    .split("; ")
    .reduce(
      (acc, row) =>
        row.startsWith("authToken=")
          ? decodeURIComponent(row.split("=")[1])
          : acc,
      ""
    );

  return token ? true : false;
};

const CatchAllRedirect = () => {
  const token = getToken();
  return token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

// const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({}) => {
//   return getToken() ? <Outlet /> : <Navigate to="/login" />;
// };

const ProtecteAuthRoute: React.FC<{ children?: React.ReactNode }> = memo(({ }) => {
  const hasToken = getToken();
  const currentPath = window.location.pathname;
  const isLoggingOut = sessionStorage.getItem("isLoggingOut");
  const preventNavigation = sessionStorage.getItem("preventNavigation");
  
  // Prevent navigation during logout process
  if (isLoggingOut === "true" || preventNavigation === "true") {
    return <Outlet />;
  }
  
  // Only navigate if not already at target
  if (hasToken && currentPath !== "/dashboard") {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
});

const RouterOutlet = () => {
  return (
    <Suspense
      fallback={
        <div>
          <Loader />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Outlet />}>
          {/* Redirect root (/) to login or dashboard */}
          <Route index element={<CatchAllRedirect />} />

          {/* ----------- Public Auth Routes ----------- */}
          <Route
            path="/login"
            element={
              <ProtecteAuthRoute>
                <Outlet />
              </ProtecteAuthRoute>
            }
          >
            <Route index element={<Login />} />
          </Route>
          <Route
            path="/signUp"
            element={
              <ProtecteAuthRoute>
                <Outlet />
              </ProtecteAuthRoute>
            }
          >
            <Route index element={<SignUp />} />
          </Route>
          <Route
            path="/forgotPassword"
            element={
              <ProtecteAuthRoute>
                <Outlet />
              </ProtecteAuthRoute>
            }
          >
            <Route index element={<ForgotPassword />} />
          </Route>
          <Route
            path="/otpInput"
            element={
              <ProtecteAuthRoute>
                <Outlet />
              </ProtecteAuthRoute>
            }
          >
            <Route index element={<OtpInputScreen />} />
          </Route>
          <Route
            path="/setPassword"
            element={
              <ProtecteAuthRoute>
                <Outlet />
              </ProtecteAuthRoute>
            }
          >
            <Route index element={<SetPasswordScreen />} />
          </Route>

          {/* ----------- Public Transaction Routes ----------- */}
          <Route
            path="/transaction-completed"
            element={
              <Suspense fallback={<Loader />}>
                <TransactionCompleted />
              </Suspense>
            }
          />

          {/* ----------- Protected Routes ----------- */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              }
            />
          </Route>

          <Route
            path="products"
            element={
              <ProtectedRoute allowedRoles={["RT", "RU"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <Products />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="products/pgScreen"
            element={
              <ProtectedRoute allowedRoles={["RT", "RU"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <PGScreen />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="products/payoutScreen"
            element={
              <ProtectedRoute allowedRoles={["RT", "RU"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <PayoutScreen />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="products/payoutScreen/Info"
            element={
              <ProtectedRoute allowedRoles={["RT", "RU"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <PayoutInfoTable />
                </MainLayout>
              }
            />
          </Route>

          {/* AEPS */}
          <Route
            path="products/aeps"
            element={
              <ProtectedRoute allowedRoles={["RT", "RU"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            {/* Sub Product  */}
            <Route
              index
              element={
                <MainLayout>
                  <AepsSubProductsScreen />
                </MainLayout>
              }
            />

            {/* Status Check Screen */}
            <Route
              path="status/:subProductId"
              element={
                <MainLayout>
                  <AepsVendorWrapper type="status" />
                </MainLayout>
              }
            />

            {/* AEPS Services */}
            <Route
              path="service/:subProductId"
              element={
                <MainLayout>
                  <AepsVendorWrapper type="service" />
                </MainLayout>
              }
            />

            {/* Ekyc Screen */}
            <Route
              path="ekyc/:subProductId"
              element={
                <MainLayout>
                  <AepsVendorWrapper type="ekyc" />
                </MainLayout>
              }
            />

            {/* AEPS 2FA */}
            <Route
              path="2fa/:subProductId"
              element={
                <MainLayout>
                  <AepsVendorWrapper type="twoFactor" />
                </MainLayout>
              }
            />

            {/* AEPS Transaction Screen */}
            <Route
              path="transaction/:subProductId"
              element={
                <MainLayout>
                  <AepsVendorWrapper type="transaction" />
                </MainLayout>
              }
            />
          </Route>

          {/* DMT */}
          <Route
            path="products/dmt"
            element={
              <ProtectedRoute allowedRoles={["RT", "RU"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <DmtSubProductsScreen />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="products/dmt/:subProductId"
            element={
              <ProtectedRoute allowedRoles={["RT", "RU"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <SearchRemitterScreen />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="products/dmt/RemitterInfo/:subProductId"
            element={
              <ProtectedRoute allowedRoles={["RT", "RU"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <RemitterInfo />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="products/dmt/remitterRegister"
            element={
              <ProtectedRoute allowedRoles={["RT", "RU"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <RemitterRegister />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="products/dmt/remitterRegister/ekyc"
            element={
              <ProtectedRoute allowedRoles={["RT", "RU"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <RemitterEkyc />
                </MainLayout>
              }
            />
          </Route>

          {/* MPOS */}
          <Route
            path="products/mpos"
            element={
              <ProtectedRoute allowedRoles={["RT", "RU"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <MposScreen />
                </MainLayout>
              }
            />
          </Route>

          {/* BBPS */}
          <Route
            path="products/billPay"
            element={
              <ProtectedRoute allowedRoles={["RT", "RU"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <SubProductScreen />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="products/billPay/service"
            element={
              <ProtectedRoute allowedRoles={["RT", "RU"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <ServicesScreen />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="products/billPay/form"
            element={
              <ProtectedRoute allowedRoles={["RT", "RU"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <WrapperFormPage />
                </MainLayout>
              }
            />
          </Route>

          {/* CREDIT CARD */}
          <Route
            path="products/credit-card"
            element={
              <ProtectedRoute allowedRoles={["RT", "RU"]}>
                <MainLayout>
                  <Outlet />
                </MainLayout>
              </ProtectedRoute>
            }
          >
            <Route index element={<CreditCardScreen />} />
          </Route>

          {/* RECHARGE */}
          <Route
            path="products/recharge"
            element={
              <ProtectedRoute allowedRoles={["RT", "RU"]}>
                <MainLayout>
                  <Outlet />
                </MainLayout>
              </ProtectedRoute>
            }
          >
            <Route index element={<RechargeSubProducts />} />
            <Route path=":subProductId" element={<Recharge />} />
          </Route>

          <Route
            path="/manageUser/createUser"
            element={
              <ProtectedRoute allowedRoles={["WL", "SD", "PT", "DT"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <CreateUser />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="/manageUser/debitAndCreditUser"
            element={
              <ProtectedRoute allowedRoles={["WL", "SD", "PT", "DT"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <DebitAndCreditUser />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="/manageUser/ViewUser"
            element={
              <ProtectedRoute allowedRoles={["WL", "SD", "PT", "DT"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <ViewUser />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/networkTransaction"
            element={
              <ProtectedRoute
                allowedRoles={["WL", "SD", "PT", "DT"]}
              >
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <NetworkTransaction />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/transaction-report"
            element={
              <ProtectedRoute
                allowedRoles={["RT", "RU"]}
              >
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <TransactionReport />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/txn-wallet-report"
            element={
              <ProtectedRoute
                allowedRoles={["RT", "RU"]}
              >
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <TransactionWalletReport />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/accountSummary"
            element={
              <ProtectedRoute
                allowedRoles={["WL", "SD", "PT", "DT", "RT", "RU"]}
              >
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <AccountSummary />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/WalletReport"
            element={
              <ProtectedRoute
                allowedRoles={["WL", "SD", "PT", "DT", "RT", "RU"]}
              >
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <WalletReport />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/searchTransaction"
            element={
              <ProtectedRoute
                allowedRoles={["WL", "SD", "PT", "DT", "RT", "RU"]}
              >
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <SearchTransaction />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/downloadReport"
            element={
              <ProtectedRoute
                allowedRoles={["WL", "SD", "PT", "DT", "RT", "RU"]}
              >
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <DownloadReport />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/fundLoading"
            element={
              <ProtectedRoute
                allowedRoles={["WL", "SD", "PT", "DT", "RT", "RU"]}
              >
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <FundLoading />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/paymentLoading"
            element={
              <ProtectedRoute allowedRoles={["WL", "SD", "PT", "DT"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <PaymentLoading />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/commissionAndCharges"
            element={
              <ProtectedRoute
                allowedRoles={["WL", "SD", "PT", "DT", "RT", "RU"]}
              >
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <CommissionAndCharges />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/pendingTransaction"
            element={
              <ProtectedRoute allowedRoles={["RT", "RU"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <PendingTransaction />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/debitHistory"
            element={
              <ProtectedRoute allowedRoles={["WL", "SD", "PT", "DT"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <DebitHistory />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/agentPerformance"
            element={
              <ProtectedRoute allowedRoles={["WL", "SD", "PT", "DT"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <AgentPerformance />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/bankWithdrawal"
            element={
              <ProtectedRoute allowedRoles={["WL", "SD", "PT", "DT"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <BankWithdrawal />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/downLineBalance"
            element={
              <ProtectedRoute allowedRoles={["WL", "SD", "PT", "DT"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <DownLineBalance />
                </MainLayout>
              }
            />
          </Route>

          <Route
            path="settings/myProfile"
            element={
              <ProtectedRoute
                allowedRoles={["WL", "SD", "PT", "DT", "RT", "RU"]}
              >
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <MyProfile />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="settings/subUser"
            element={
              <ProtectedRoute allowedRoles={["RT"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <CreateSubUser />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="settings/ViewSubUser"
            element={
              <ProtectedRoute allowedRoles={["RT"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <ViewSubUser />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="settings/changeTPIN"
            element={
              <ProtectedRoute
                allowedRoles={["WL", "SD", "PT", "DT", "RT", "RU"]}
              >
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <ChangeTPIN />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="settings/myCertificate"
            element={
              <ProtectedRoute
                allowedRoles={["WL", "SD", "PT", "DT", "RT", "RU"]}
              >
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <MyCertificate />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="settings/lowBalanceAlert"
            element={
              <ProtectedRoute allowedRoles={["RT", "RU"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <LowBalanceAlert />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="settings/idCard"
            element={
              <ProtectedRoute allowedRoles={["WL", "SD", "PT", "DT"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <IDCard />
                </MainLayout>
              }
            />
          </Route>

          <Route
            path="support/bioMetricDevice"
            element={
              <ProtectedRoute allowedRoles={["RT", "RU"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <BioMetricDevice />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="support/ticketingSystem"
            element={
              <ProtectedRoute
                allowedRoles={["WL", "SD", "PT", "DT", "RT", "RU"]}
              >
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <Ticketing />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="support/contactUs"
            element={
              <ProtectedRoute allowedRoles={["WL", "SD", "RT", "RU"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <ContactUs />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="support/topUpRequest"
            element={
              <ProtectedRoute allowedRoles={["WL", "SD", "PT", "DT"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <TopUpRequest />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="support/topUpHistory"
            element={
              <ProtectedRoute allowedRoles={["WL", "SD", "PT", "DT"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <TopUpHistory />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="support/addMoney"
            element={
              <ProtectedRoute allowedRoles={["WL", "SD", "PT", "DT"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <AddMoney />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="support/paymentRequest"
            element={
              <ProtectedRoute allowedRoles={["WL", "SD", "PT", "DT"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <PaymentRequest />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="support/paymentHistory"
            element={
              <ProtectedRoute allowedRoles={["WL", "SD", "PT", "DT"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <PaymentHistory />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="support/paymentBanks"
            element={
              <ProtectedRoute allowedRoles={["WL", "SD", "PT", "DT"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <PaymentBanks />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="/funding/walletToBank"
            element={
              <ProtectedRoute
                allowedRoles={["WL", "SD", "PT", "DT", "RT", "RU"]}
              >
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <WalletToBank />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="/funding/walletToBankFund"
            element={
              <ProtectedRoute
                allowedRoles={["WL", "SD", "PT", "DT", "RT", "RU"]}
              >
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <WalletToBankFund />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="/funding/walletToWallet"
            element={
              <ProtectedRoute
                allowedRoles={["WL", "SD", "PT", "DT", "RT", "RU"]}
              >
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <WalletToWallet />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="/funding/fundTransfer"
            element={
              <ProtectedRoute
                allowedRoles={["WL", "SD", "PT", "DT"]}
              >
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <FundTransfer />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="/funding/fundReversal"
            element={
              <ProtectedRoute allowedRoles={["WL", "SD", "PT", "DT"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <FundReversal />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="/websiteSettings/websiteData"
            element={
              <ProtectedRoute allowedRoles={["WL"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <WebsiteData />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="/websiteSettings/socialMediaLinks"
            element={
              <ProtectedRoute allowedRoles={["WL"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <SocialMediaLinks />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="/websiteSettings/webAndAppLogoImage"
            element={
              <ProtectedRoute allowedRoles={["WL"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <WebAndAppLogo />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="/websiteSettings/websitePageContent"
            element={
              <ProtectedRoute allowedRoles={["WL"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <MainLayout>
                  <WebsitePageContent />
                </MainLayout>
              }
            />
          </Route>

          {/* ----------- Catch-all Route ----------- */}
          <Route path="*" element={<CatchAllRedirect />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default RouterOutlet;
