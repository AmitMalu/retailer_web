import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import OtpInputScreen from "@/pages/Auth/Otp";
import SetPasswordScreen from "@/pages/Auth/SetPassword";
import SignUp from "@/pages/Auth/SignUp.tsx";

const Dashboard = lazy(() => import("@/pages/Home/Dashboard"));
const AddAndViewUser = lazy(
  () => import("@/pages/Home/ManageUser/AddAndViewUser")
);
const DebitAndCreditUser = lazy(
  () => import("@/pages/Home/ManageUser/DebitAndCreditUser")
);
const CreateProfile = lazy(
  () => import("@/pages/Home/ManageUser/CreateProfile")
);
const FeesSettings = lazy(() => import("@/pages/Home/ManageUser/FeesSettings"));
const InternalTransfer = lazy(
  () => import("@/pages/Home/ManageUser/InternalTransfer")
);
const Products = lazy(() => import("@/pages/Home/Products/Products"));
const WalletToBank = lazy(() => import("@/pages/Home/Funding/WalletToBank"));
const WalletToBankFund = lazy(
  () => import("@/pages/Home/Funding/WalletToBankFund")
);
const WalletToWallet = lazy(
  () => import("@/pages/Home/Funding/WalletToWallet")
);
const Transaction = lazy(
  () => import("@/pages/Home/Reports/TransactionHistory")
);
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
const ChangePassword = lazy(
  () => import("@/pages/Home/Settings/ChangePassword")
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

const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({}) => {
  return getToken() ? <Outlet /> : <Navigate to="/login" />;
};

const ProtecteAuthRoute: React.FC<{ children?: React.ReactNode }> = ({}) => {
  return getToken() ? <Navigate to="dashboard" /> : <Outlet />;
};

const RouterOutlet = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Outlet />}>
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
              <ProtectedRoute>
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
            path="/manageUser/addAndViewUser"
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
                  <AddAndViewUser />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="/manageUser/debitAndCreditUser"
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
                  <DebitAndCreditUser />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="/manageUser/createProfile"
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
                  <CreateProfile />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="/manageUser/feesSettings"
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
                  <FeesSettings />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="/manageUser/internalTransfer"
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
                  <InternalTransfer />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/accountSummary"
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
                  <AccountSummary />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/transactionHistory"
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
                  <Transaction />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/searchTransaction"
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
                  <SearchTransaction />
                </MainLayout>
              }
            />
          </Route>

          <Route
            path="reports/downloadReport"
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
                  <DownloadReport />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/fundLoading"
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
                  <FundLoading />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/paymentLoading"
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
                  <PaymentLoading />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/commissionAndCharges"
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
                  <CommissionAndCharges />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/pendingTransaction"
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
                  <PendingTransaction />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/debitHistory"
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
                  <DebitHistory />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/agentPerformance"
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
                  <AgentPerformance />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/bankWithdrawal"
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
                  <BankWithdrawal />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/downLineBalance"
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
                  <DownLineBalance />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="settings/myProfile"
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
                  <MyProfile />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="settings/changePassword"
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
                  <ChangePassword />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="settings/changeTPIN"
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
                  <ChangeTPIN />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="settings/myCertificate"
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
                  <MyCertificate />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="settings/lowBalanceAlert"
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
                  <LowBalanceAlert />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="settings/idCard"
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
                  <IDCard />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="support/bioMetricDevice"
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
                  <BioMetricDevice />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="support/ticketingSystem"
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
                  <Ticketing />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="support/contactUs"
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
                  <ContactUs />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="support/topUpRequest"
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
                  <TopUpRequest />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="support/topUpHistory"
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
                  <TopUpHistory />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="support/addMoney"
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
                  <AddMoney />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="support/paymentRequest"
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
                  <PaymentRequest />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="support/paymentHistory"
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
                  <PaymentHistory />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="support/paymentBanks"
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
                  <PaymentBanks />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="/funding/walletToBank"
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
                  <WalletToBank />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="/funding/walletToBankFund"
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
                  <WalletToBankFund />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="/funding/walletToWallet"
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
                  <WalletToWallet />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="/websiteSettings/websiteData"
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
                  <WebsiteData />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="/websiteSettings/socialMediaLinks"
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
                  <SocialMediaLinks />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="/websiteSettings/webAndAppLogoImage"
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
                  <WebAndAppLogo />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="/websiteSettings/websitePageContent"
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
                  <WebsitePageContent />
                </MainLayout>
              }
            />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default RouterOutlet;
