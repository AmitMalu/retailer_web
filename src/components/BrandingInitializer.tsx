
import { useBranding } from "@/Config/branding";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/Redux/Store";
import { saveApiResponse } from "@/Redux/Actions/apiActions";
import { Get_Brand_Info } from "@/Services/api";

const BrandingInitializer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const branding = useBranding();

  useEffect(() => {
    const fetchBranding = async () => {
      // Reset branding state before fetching tenant config.
      // Prevents previously loaded branding from rendering
      // while the new tenant configuration is being fetched.
      dispatch(saveApiResponse("brandingLoaded", false));
      dispatch(saveApiResponse("brandingFailed", false));

      try {
        const response = await Get_Brand_Info();
        if (response && (response.status === 200 || response.status === 201)) {
          // If response.data is formatted as { statusCode, data, message }
          const data = response.data?.data || response.data;
          if (data) {
            dispatch(saveApiResponse("brandingData", data));
          } else {
            // API responded but returned no usable data — treat as failure
            dispatch(saveApiResponse("brandingFailed", true));
          }
        } else {
          // Non-2xx response
          dispatch(saveApiResponse("brandingFailed", true));
        }
      } catch (error) {
        console.error("Failed to fetch brand info:", error);
        dispatch(saveApiResponse("brandingFailed", true));
      }
      finally {
        // Config API finished, Failed or Pass Stop the Loader and White Screen
        dispatch(saveApiResponse("brandingLoaded", true));
      }
    };

    fetchBranding();
  }, [dispatch]);

  useEffect(() => {
    if (!branding) return;

    if (branding.title) {
      document.title = branding.title;
    }

    const oldIcon = document.querySelector(
      "link[rel*='icon']"
    );

    if (oldIcon) {
      oldIcon.remove();
    }

    const newIcon = document.createElement("link");
    newIcon.rel = "icon";
    newIcon.type = "image/x-icon";
    newIcon.href =
      `${branding.favicon}?v=${Date.now()}`;

    document.head.appendChild(newIcon);

    console.log("Favicon URL:", newIcon.href);

    if (branding.primaryColor) {
      document.documentElement.style.setProperty("--primary-main", branding.primaryColor);
    }

    if (branding.secondaryColor) {
      document.documentElement.style.setProperty(
        "--secondary-main",
        branding.secondaryColor
      );
    }

  }, [branding]);

  return null;
};

export default BrandingInitializer;