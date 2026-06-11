import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/Store";

// Import layout variants
import StandardLayout from "./variants/StandardLayout";
import HorizontalLayout from "./variants/HorizontalLayout";
import MinimalLayout from "./variants/MinimalLayout";
import FooterLayout from "./variants/FooterLayout";
import { useLogoutHandling } from "@/Utils/CustomLogout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize logout handling for reload detection and navigation protection
  useLogoutHandling();
  
  const { layoutVariant } = useSelector((state: RootState) => state.settings);

  // Render the appropriate layout based on the selected variant
  switch (layoutVariant) {
    case "horizontal":
      return <HorizontalLayout>{children}</HorizontalLayout>;
    case "minimal":
      return <MinimalLayout>{children}</MinimalLayout>;
    case "footer":
      return <FooterLayout>{children}</FooterLayout>;
    case "standard":
    default:
      return <StandardLayout>{children}</StandardLayout>;
  }
}
