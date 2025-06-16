import React from "react";
import { AuthLayoutProps } from "@/Common/interface";
import { useNavigate } from "react-router-dom";
import ImFullLogo from "@/assets/svg/ImFullLogo";

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, authImage }) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full bg-cover bg-center">
      <div className="flex h-full w-full">
        <div className="flex h-full w-1/2 flex-col items-center justify-center p-4 sm:hidden md:flex">
          <div
            onClick={() => navigate("/login")}
            className="mb-6 flex h-auto w-full items-start justify-start"
          >
            <ImFullLogo />
          </div>

          <div className="flex h-3/4 w-3/4 items-center justify-center">
            {authImage}
          </div>
          {/* <div className="flex w-full items-center justify-end pb-8">
            <MudraSevakSvg />
          </div> */}
        </div>

        <div className="flex h-full items-center justify-center bg-lightPink sm:w-screen md:w-1/2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
