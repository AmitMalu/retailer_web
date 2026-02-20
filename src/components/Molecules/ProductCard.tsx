import { ProductCardProps } from "@/Common/interface";
import TextComponent from "../Atoms/TextComponent";
import { useMediaQuery, useTheme } from "@mui/system";

export function ProductCard({
  image,
  title,
  fill = false,
  onClick,
  size = 32, // default fallback,
  disabled = false,
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
        <div className={`relative ${box} rotate-45 ${rounded} border-2 border-red-500`} />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center group">
      <div className={`absolute top-0 h-10 w-px ${disabled ? "bg-transparent" : "bg-black"}`} />

      <div
        onClick={!disabled ? onClick : undefined}
        className={`relative ${box} rotate-45 ${rounded} border-2 cursor-pointer border-red-dark shadow-md z-1 transition-all duration-300 ease-in-out 
        ${disabled
            ? "opacity-50 cursor-not-allowed bg-gray-200"
            : fill
              ? "bg-red-dark"
              : "bg-white hover:bg-red-light group-hover:scale-105 group-hover:shadow-lg"
          }`}
      >
        <div className={`absolute inset-0 -rotate-45 flex flex-col items-center justify-center ${padding} ${gap}`}>
          {image && <div className="transition-transform duration-300 group-hover:scale-110">
            {image}
          </div>}
          {title && <TextComponent
            fontSize={font}
            fontWeight={500}
            color={fill ? "white" : theme.palette.red.dark}
            className="transition-colors duration-300"
          >
            {title}
          </TextComponent>}
        </div>
      </div>
    </div>
  );
}
