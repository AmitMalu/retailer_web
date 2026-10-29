import { useAppSelector } from "@/Redux/hooks";
import { decryptData } from "@/Utils/helper";

export const getBranding = () => {
  const basePath = import.meta.env.BASE_URL || "/";
  const normalizedBasePath = basePath.endsWith("/") ? basePath : `${basePath}/`;

  return {
    tenantCode: "smartcredit",
    domain: window.location.hostname,
    title: "Smart Credit Solution",
    companyName: "Smart Credit Solution",

    logo: `${normalizedBasePath}branding/smartcredit/logo.png`,
    favicon: `${normalizedBasePath}branding/smartcredit/favicon.ico`,
    loginBgImg: `${normalizedBasePath}branding/smartcredit/loginBgImage.png`,

    welcomeText: "Welcome to your financial hub.",

    terms: `${normalizedBasePath}branding/smartcredit/terms.pdf`,
    privacy: `${normalizedBasePath}branding/smartcredit/privacy.pdf`,
    refund: `${normalizedBasePath}branding/smartcredit/refund.pdf`,
    primaryColor: "#059669",
    secondaryColor: "#0F172A",
  };
};

export const useBranding = () => {
  const apiResponses = useAppSelector(
    (state: any) => state.apiResponse.responses,
  );

  const brandingData = apiResponses?.brandingData;

  if (!brandingData) {
    return null;
  }

  try {
    const decrypted = decryptData(brandingData);

    if (!decrypted) {
      return null;
    }

    return {
      tenantCode: decrypted.tenantCode,

      domain: decrypted.domain,

      companyName: decrypted.companyName,

      title: decrypted.portalTitle,

      logo: decrypted.logoUrl,

      favicon: decrypted.faviconUrl || decrypted.favicon,

      loginBgImg: decrypted.backgroundUrl,

      loginArtwork : decrypted?.loginArtwork,

      welcomeText: decrypted.welcomeText,

      terms: decrypted.termsUrl,

      privacy: decrypted.privacyUrl,

      refund: decrypted.refundUrl,

      primaryColor: decrypted.primaryColor,

      secondaryColor: decrypted.secondaryColor,
    };
  } catch (error) {
    console.error("Error decrypting branding data:", error);

    return null;
  }
};
