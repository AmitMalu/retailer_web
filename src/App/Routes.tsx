import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { Suspense } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import Login from "@/pages/Auth/Login";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import OtpInputScreen from "@/pages/Auth/Otp";
import SetPasswordScreen from "@/pages/Auth/SetPassword";
import SignUp from "@/pages/Auth/SignUp.tsx";
import Dashboard from "@/pages/Home/Dashboard";
import Products from "@/pages/Home/Products";

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
            path="/"
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
        </Route>
      </Routes>
    </Suspense>
  );
};

export default RouterOutlet;
