import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { Suspense } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";

const RouterOutlet = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route
            path="/"
            element={
              <MainLayout>
                <Outlet />
              </MainLayout>
            }
          >
            <Route index element={<Dashboard />} />
          </Route>
          <Route
            path="/products"
            element={
              <MainLayout>
                <Outlet />
              </MainLayout>
            }
          >
            <Route index element={<Products />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default RouterOutlet;
