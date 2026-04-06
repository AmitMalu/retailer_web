import { ProductCardProps } from "@/Common/interface";
import TextComponent from "../Atoms/TextComponent";
import { useMediaQuery, useTheme } from "@mui/material";
import React from "react";

export function ProductCard({
  image,
  title,
  fill = false,
  onClick,
  size = 32, // default fallback,
  disabled = true,
  placeholder = false,
}: ProductCardProps) {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"));
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));

  let resolvedSize: number;
  if (typeof size === "number") {
    resolvedSize = size;
  } else {
    resolvedSize = size.base;
    if (isMd && size.md) resolvedSize = size.md;
    if (isLg && size.lg) resolvedSize = size.lg;
  }

  // Map size → Tailwind classes for consistency
  const sizeConfig: Record<
    number,
    { box: string; font: number; padding: string; gap: string; rounded: string }
  > = {
    22: { box: "w-20 h-20", font: 8, padding: "p-0.5", gap: "gap-0.5", rounded: "rounded-xl" },
    24: { box: "w-24 h-24", font: 8, padding: "p-1", gap: "gap-1", rounded: "rounded-xl" },
    28: { box: "w-28 h-28", font: 9, padding: "p-1", gap: "gap-1", rounded: "rounded-2xl" },
    32: { box: "w-32 h-32", font: 10, padding: "p-1", gap: "gap-1", rounded: "rounded-3xl" },
  };

  const { box, font, padding, gap, rounded } = sizeConfig[resolvedSize] || sizeConfig[32];

  if (placeholder) {
    return (
      <div className="relative flex flex-col items-center scale-90 pointer-events-none">
        <div style={{ border: `2px solid ${theme.palette.primary.main}` }} className={`relative ${box} rotate-45 ${rounded}`} />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center group">
      <div style={{ backgroundColor: disabled ? "transparent" : theme.palette.primary.main }} className={`absolute top-0 h-10 w-px`} />

      <div
        onClick={!disabled ? onClick : undefined}
        className={`relative ${box} rotate-45 ${rounded} border-2 cursor-pointer shadow-md z-1 transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-lg`}
        style={{
          backgroundColor: disabled
            ? theme.palette.divider
            : fill
              ? theme.palette.primary.main
              : theme.palette.background.paper,
          borderColor: disabled
            ? theme.palette.divider
            : theme.palette.primary.main,
        }}
      >
        <div className={`absolute inset-0 -rotate-45 flex flex-col items-center justify-center ${padding} ${gap}`}>
          {image && <div className="transition-transform duration-300 group-hover:scale-110">
            {React.isValidElement(image)
              ? React.cloneElement(image as React.ReactElement<any>, {
                color: fill
                  ? "#ffffff"
                  : (theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main)
              })
              : image}
          </div>}
          {title && <TextComponent
            fontSize={font}
            fontWeight={600}
            color={fill
              ? "white"
              : (theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main)}
            className="transition-colors duration-300 text-center"
          >
            {title}
          </TextComponent>}
        </div>
      </div>
    </div>
  );
}
