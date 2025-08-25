import { ProductCardProps } from "@/Common/interface";
import TextComponent from "../Atoms/TextComponent";
import { useTheme } from "@mui/system";

export function ProductCard({
  image,
  title,
  fill = false,
  onClick,
}: ProductCardProps) {
  const theme = useTheme();
  return (
    <div className="relative flex flex-col items-center min-h-[100px] group">
      <div className="absolute top-0 h-10 w-px bg-black" />

      <div
        onClick={onClick}
        className={`relative w-32 h-32 transform rotate-45 rounded-3xl border-2 cursor-pointer border-red-dark shadow-md z-1 transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-lg ${
          fill ? "bg-red-dark" : "bg-white hover:bg-red-light"
        }`}
      >
        <div className="absolute inset-0 transform -rotate-45 flex flex-col items-center justify-center p-1 gap-2">
          <div className="transition-transform duration-300 group-hover:scale-110">
            {image}
          </div>
          <TextComponent
            fontSize={12}
            fontWeight={500}
            color={fill ? "white" : theme.palette.red.dark}
            className="transition-colors duration-300 "
          >
            {title}
          </TextComponent>
        </div>
      </div>
    </div>
  );
}
