import React from "react";
import { AuthLayoutProps } from "@/Common/interface";
// import { useNavigate } from "react-router-dom";
// import ImShortLogo from "@/assets/svg/ImShortLogo";
import TextComponent from "../Atoms/TextComponent";
import { BUILD_INFO } from '@/buildInfo';
import { useBranding } from "@/Config/branding";

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  authImage,
  authText,
}) => {
  // const navigate = useNavigate();
  const branding = useBranding();

  return (
    <div className="flex flex-col h-screen w-full gap-2 bg-cover bg-center bg-authBackground ">
      <div className="flex h-[90%] w-full">
        <div className="flex h-full w-1/2 flex-col items-center justify-center p-3 hidden md:flex">
          {/* <div
            onClick={() => navigate("/login")}
            className="mb-6 -mt-22 flex h-auto w-full items-start justify-start"
            title={`${BUILD_INFO.version} (${BUILD_INFO.builtAt})`}
          >
            <ImShortLogo />
          </div> */}

          {/* Logo */}
          <div className="absolute top-4 left-8"
            title={`${BUILD_INFO.version} (${BUILD_INFO.builtAt})`}
          >
            <img
              src={branding?.logo}
              // alt={branding?.companyName ?? "Logo"}
              className="h-16 w-auto max-w-[180px]"
            />
          </div>

          <div className="flex h-full w-full items-center justify-center">
            {authImage}
          </div>
          {/* <div className="flex w-full items-center justify-end pb-8">
            <MudraSevakSvg />
          </div> */}
        </div>

        <div className="flex h-full items-center justify-center w-screen md:w-1/2">
          {children}
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 ">
        <TextComponent
          fontSize={30}
          fontWeight={400}
          color="black"
          fontFamily="cursive, sans-serif"
        >
          {authText}
        </TextComponent>
      </div>
    </div>
  );
};

export default AuthLayout;
