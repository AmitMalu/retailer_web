import React from "react";
import { AuthLayoutProps } from "@/Common/interface";
import TextComponent from "../Atoms/TextComponent";
import { BUILD_INFO } from '@/buildInfo';
import { useBranding } from "@/Config/branding";

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  authText,
}) => {
  const branding = useBranding();

  return (
    <div
      className="flex flex-col h-screen w-full gap-2 bg-cover bg-center bg-authBackground"
      style={{ backgroundImage: `url(${branding?.loginBgImg})` }}
    >
      <div className="flex h-[90%] w-full">
        <div className="flex h-full w-1/2 flex-col items-center justify-center p-3 hidden md:flex">
          {/* Logo */}
          <div className="absolute top-4 left-8"
            title={`${BUILD_INFO.version} (${BUILD_INFO.builtAt})`}
          >
            <img
              src={branding?.logo}
              className="h-16 w-auto max-w-[180px]"
            />
          </div>

          {branding?.loginArtwork &&
            <div className="flex h-full w-full items-center justify-center">
              <img src={branding?.loginArtwork} className="h-full w-full object-cover" />
            </div>
          }
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
          {authText ? authText : branding?.welcomeText}
        </TextComponent>
      </div>
    </div>
  );
};

export default AuthLayout;
