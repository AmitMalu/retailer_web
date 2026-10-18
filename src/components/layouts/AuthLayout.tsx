import React from "react";
import { AuthLayoutProps } from "@/Common/interface";
import { BUILD_INFO } from '@/buildInfo';
import { useBranding } from "@/Config/branding";

const highlights = [
  { title: "AEPS, DMT & Bill Payments", text: "Every money service your customers need, in one counter." },
  { title: "Instant settlements", text: "Track your wallet and commissions live." },
  { title: "Secure by design", text: "OTP sign-in and encrypted sessions on every login." },
];

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  authText,
}) => {
  const branding = useBranding();
  const primary = branding?.primaryColor || "#059669";

  return (
    <div className="flex h-screen w-full bg-white">
      {/* Left brand panel (hidden on small screens) */}
      <div className="relative hidden md:flex md:w-[48%] lg:w-[52%] flex-col justify-between overflow-hidden bg-[#0f172a] p-10 lg:p-12 text-white">
        <div
          className="pointer-events-none absolute -top-40 -right-32 h-[520px] w-[520px] rounded-full opacity-30 blur-3xl"
          style={{ backgroundColor: primary }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <div className="relative flex items-center gap-3" title={`${BUILD_INFO.version} (${BUILD_INFO.builtAt})`}>
          {branding?.logo && (
            <div className="flex h-12 items-center rounded-xl bg-white px-3">
              <img src={branding.logo} alt={branding?.companyName} className="max-h-9 w-auto max-w-[150px] object-contain" />
            </div>
          )}
          <div className="text-[15px] font-bold">{branding?.companyName}</div>
        </div>

        <div className="relative max-w-[500px]">
          <h2 className="text-[38px] leading-[1.12] font-extrabold tracking-tight">
            {authText || branding?.welcomeText || "Welcome to your financial hub."}
          </h2>
          <div className="mt-6 h-1 w-16 rounded-full" style={{ backgroundColor: primary }} />

          {branding?.loginArtwork ? (
            <img
              src={branding.loginArtwork}
              alt=""
              className="mt-8 max-h-[260px] w-auto rounded-2xl object-contain"
            />
          ) : (
            <div className="mt-8 flex flex-col gap-4">
              {highlights.map((h) => (
                <div key={h.title} className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: primary }} />
                  <div>
                    <div className="text-sm font-semibold">{h.title}</div>
                    <div className="text-[13px] text-slate-400">{h.text}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative text-xs text-slate-500">
          © {new Date().getFullYear()} {branding?.companyName}. All rights reserved.
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-auto px-6">
        {branding?.logo && (
          <img src={branding.logo} alt={branding?.companyName} className="mb-6 h-12 w-auto md:hidden" />
        )}
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
