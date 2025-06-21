import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import OtpInputScreen from "@/pages/Auth/Otp";
import SetPasswordScreen from "@/pages/Auth/SetPassword";
import SignUp from "@/pages/Auth/SignUp.tsx";

const Dashboard = lazy(() => import("@/pages/Home/RT/Dashboard"));
const Products = lazy(() => import("@/pages/Home/RT/Products"));
const AccountSummary = lazy(
  () => import("@/pages/Home/RT/Reports/AccountSummary")
);
const Transaction = lazy(() => import("@/pages/Home/RT/Reports/Transaction"));
const MyProfile = lazy(() => import("@/pages/Home/RT/Settings/MyProfile"));
const ChangePassword = lazy(
  () => import("@/pages/Home/RT/Settings/ChangePassword")
);
const BioMetricDevice = lazy(
  () => import("@/pages/Home/RT/Support/BioMetricDevice")
);
const Ticketing = lazy(() => import("@/pages/Home/RT/Support/Ticketing"));
const WalletToBank = lazy(() => import("@/pages/Home/RT/WalletToBank"));
const WalletToBankFund = lazy(() => import("@/pages/Home/RT/WalletToBankFund"));
const WalletToWallet = lazy(() => import("@/pages/Home/RT/WalletToWallet"));
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
            path="reports/transaction"
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
            path="support/ticketing"
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
            path="walletToBank"
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
            path="walletToBankFund"
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
            path="walletToWallet"
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
        </Route>
      </Routes>
    </Suspense>
  );
};

export default RouterOutlet;
