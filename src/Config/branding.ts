import { useAppSelector } from "@/Redux/hooks";
import { decryptData } from "@/Utils/helper";

export const getBranding = () => {
  const basePath = import.meta.env.BASE_URL || "/";
  const normalizedBasePath = basePath.endsWith("/") ? basePath : `${basePath}/`;

  return {
    tenantCode: "nfttech",
    domain: window.location.hostname,
    title: "NFT Enterprise Portal",
    companyName: "NFT Tech",

    logo: `${normalizedBasePath}branding/nfttech/logo.png`,
    favicon: `${normalizedBasePath}branding/nfttech/favicon.ico`,
    loginBgImg: `${normalizedBasePath}branding/nfttech/loginBgImage.png`,

    welcomeText: "Welcome to your financial hub.",

    terms: `${normalizedBasePath}branding/nfttech/terms.pdf`,
    privacy: `${normalizedBasePath}branding/nfttech/privacy.pdf`,
    refund: `${normalizedBasePath}branding/nfttech/refund.pdf`,
    primaryColor: "#2563EB",
    secondaryColor: "#0F172A",
  };
};

export const useBranding = () => {
  const apiResponses = useAppSelector(
    (state: any) => state.apiResponse.responses,
  );

  const brandingData = apiResponses?.brandingData;

  const fallback = getBranding();

  if (!brandingData) {
    return fallback;
  }

  try {
    const decrypted = decryptData(brandingData);

    if (!decrypted) {
      return fallback;
    }

    return {
      tenantCode: decrypted.tenantCode || fallback.tenantCode,

      domain: decrypted.domain || fallback.domain,

      companyName: decrypted.companyName || fallback.companyName,

      title: decrypted.portalTitle || fallback.title,

      logo: decrypted.logoUrl || fallback.logo,

      favicon: decrypted.faviconUrl || decrypted.favicon || fallback.favicon,

      loginBgImg: decrypted.backgroundUrl || fallback.loginBgImg,

      welcomeText: decrypted.welcomeText || fallback.welcomeText,

      terms: decrypted.termsUrl || fallback.terms,

      privacy: decrypted.privacyUrl || fallback.privacy,

      refund: decrypted.refundUrl || fallback.refund,

      primaryColor: decrypted.primaryColor || fallback.primaryColor,

      secondaryColor: decrypted.secondaryColor || fallback.secondaryColor,
    };
  } catch (error) {
    console.error("Error decrypting branding data:", error);

    return fallback;
  }
};
