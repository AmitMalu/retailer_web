import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import OtpInputScreen from "@/pages/Auth/Otp";
import SetPasswordScreen from "@/pages/Auth/SetPassword";
import SignUp from "@/pages/Auth/SignUp.tsx";
import Loader from "@/components/Atoms/Loader";

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

const PGScreen = lazy(() => import("@/pages/Home/Products/PG"));
const PayoutScreen = lazy(() => import("@/pages/Home/Products/Payout"));
const PayoutInfoTable = lazy(
  () => import("@/pages/Home/Products/Payout/InfoTable")
);
const AepsScreen = lazy(() => import("@/pages/Home/Products/AEPS"));
const CashWithdrawal = lazy(
  () => import("@/pages/Home/Products/AEPS/CashWithdrawal")
);
const SelectCashWithdrawalBank = lazy(
  () => import("@/pages/Home/Products/AEPS/CashWithdrawal/SelectBank")
);
const TwoFactorCashWithdrawal = lazy(
  () => import("@/pages/Home/Products/AEPS/CashWithdrawal/TwoFA")
);
const BalanceEnquiry = lazy(
  () => import("@/pages/Home/Products/AEPS/BalanceEnquiry")
);
const SelectBankBalanceEnquiry = lazy(
  () =>
    import("@/pages/Home/Products/AEPS/BalanceEnquiry/SelectBankBalanceEnquiry")
);
const TwoFactorBalanceEnquiry = lazy(
  () => import("@/pages/Home/Products/AEPS/BalanceEnquiry/TwoFABalanceEnquiry")
);
const MiniStatement = lazy(
  () => import("@/pages/Home/Products/AEPS/MiniStatement")
);
const SelectBankMiniStatement = lazy(
  () =>
    import("@/pages/Home/Products/AEPS/MiniStatement/SelectBankMinistatement")
);
const TwoFactorMiniStatement = lazy(
  () => import("@/pages/Home/Products/AEPS/MiniStatement/TwoFAMinistatement")
);

const DMTScreen = lazy(() => import("@/pages/Home/Products/DMT"));

const RemitterInfo = lazy(
  () => import("@/pages/Home/Products/DMT/RemitterInfo")
);

const RemitterRegister = lazy(
  () => import("@/pages/Home/Products/DMT/RemitterRegister")
);

const RemitterEkyc = lazy(
  () => import("@/pages/Home/Products/DMT/RemitterEkyc")
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

const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({}) => {
  return getToken() ? <Outlet /> : <Navigate to="/login" />;
};

const ProtecteAuthRoute: React.FC<{ children?: React.ReactNode }> = ({}) => {
  return getToken() ? <Navigate to="dashboard" /> : <Outlet />;
};

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
            path="products/pgScreen"
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
                  <PGScreen />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="products/payoutScreen"
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
                  <PayoutScreen />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="products/payoutScreen/Info"
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
                  <PayoutInfoTable />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="products/aepsScreen"
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
                  <AepsScreen />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="products/aepsScreen/cashWithdrawal/aepsForm"
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
                  <TwoFactorCashWithdrawal />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="products/aepsScreen/cashWithdrawal/TwoFactorCashWithdrawal"
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
                  <SelectCashWithdrawalBank />
                </MainLayout>
              }
            />
          </Route>

          <Route
            path="products/aepsScreen/vendors/cashWithdrawal"
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
                  <CashWithdrawal />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="products/aepsScreen/vendors/balanceEnquiry"
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
                  <BalanceEnquiry />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="products/aepsScreen/balanceEnquiry/TwoFactorBalanceEnquiry"
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
                  <TwoFactorBalanceEnquiry />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="products/aepsScreen/balanceEnquiry/TwoFactorBalanceEnquiry"
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
                  <SelectBankBalanceEnquiry />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="products/aepsScreen/vendors/miniStatement"
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
                  <MiniStatement />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="products/aepsScreen/miniStatement/twoFAMinistatement"
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
                  <TwoFactorMiniStatement />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="products/aepsScreen/miniStatement/SelectBankMiniStatement"
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
                  <SelectBankMiniStatement />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="products/dmt"
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
                  <DMTScreen />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="products/dmt/RemitterInfo"
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
                  <RemitterInfo />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="products/dmt/remitterRegister"
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
                  <RemitterRegister />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="products/dmt/remitterRegister/ekyc"
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
                  <RemitterEkyc />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="/manageUser/createUser"
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
                  <CreateUser />
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
            path="/manageUser/ViewUser"
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
                  <ViewUser />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="reports/networkTransaction"
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
                  <NetworkTransaction />
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
            path="reports/WalletReport"
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
                  <WalletReport />
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
            path="/funding/fundTransfer"
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
                  <FundTransfer />
                </MainLayout>
              }
            />
          </Route>
          <Route
            path="/funding/fundReversal"
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
                  <FundReversal />
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
