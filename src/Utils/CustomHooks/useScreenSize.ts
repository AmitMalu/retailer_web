import { useMediaQuery } from "usehooks-ts";

export const useScreenSize = (): "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" => {
  // Media queries for responsive design
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 768px)");
  const isLg = useMediaQuery("(min-width: 768px) and (max-width: 1024px)");
  const isXl = useMediaQuery("(min-width: 1024px) and (max-width: 1280px)");
  const is2xl = useMediaQuery("(min-width: 1280px) and (max-width: 1536px)");
  const is3xl = useMediaQuery("(min-width: 1536px)");

  if (isMobile) return "sm";
  if (isTablet) return "md";
  if (isLg) return "lg";
  if (isXl) return "xl";
  if (is2xl) return "2xl";
  if (is3xl) return "3xl";
  return "md"; // Default fallback
};
