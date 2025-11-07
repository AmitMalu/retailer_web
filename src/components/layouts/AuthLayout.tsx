import React from "react";
import { AuthLayoutProps } from "@/Common/interface";
import { useNavigate } from "react-router-dom";
import ImShortLogo from "@/assets/svg/ImShortLogo";
import TextComponent from "../Atoms/TextComponent";

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  authImage,
  authText,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen w-full gap-2 bg-cover bg-center bg-authBackground ">
      <div className="flex h-[90%] w-full">
        <div className="flex h-full w-1/2 flex-col items-center justify-center p-3 sm:hidden md:flex">
          <div
            onClick={() => navigate("/login")}
            className="mb-6 -mt-12 flex h-auto w-full items-start justify-start"
            title="v1.0.1 (07/11 5:00 PM)"
          >
            <ImShortLogo />
          </div>

          <div className="flex h-3/4 w-3/4 items-center justify-center">
            {authImage}
          </div>
          {/* <div className="flex w-full items-center justify-end pb-8">
            <MudraSevakSvg />
          </div> */}
        </div>

        <div className="flex h-full items-center justify-center sm:w-screen md:w-1/2">
          {children}
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 ">
        <TextComponent
          fontSize={30}
          fontWeight={400}
          color="black"
          fontFamily='"La Belle Aurore", cursive'
        >
          {authText}
        </TextComponent>
      </div>
    </div>
  );
};

export default AuthLayout;
