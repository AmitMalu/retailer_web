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
