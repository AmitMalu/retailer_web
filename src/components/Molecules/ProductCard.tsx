import { ProductCardProps } from "@/Common/interface";
import TextComponent from "../Atoms/TextComponent";

export function ProductCard({
  image,
  title,
  fill = false,
  onClick,
}: ProductCardProps) {
  return (
    <div className="relative flex flex-col items-center min-h-[120px] group">
      <div className="absolute top-0 h-10 w-px bg-black" />

      <div
        onClick={onClick}
        className={`relative w-36 h-36 transform rotate-45 rounded-3xl border-2 cursor-pointer border-red-500 shadow-md z-10 transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-lg ${
          fill ? "bg-red-500" : "bg-white hover:bg-gray-50"
        }`}
      >
        <div className="absolute inset-0 transform -rotate-45 flex flex-col items-center justify-center p-2 gap-2">
          <div className="transition-transform duration-300 group-hover:scale-110">
            {image}
          </div>
          <TextComponent
            fontSize={14}
            fontWeight={500}
            color={fill ? "white" : "primary"}
            className="transition-colors duration-300 "
          >
            {title}
          </TextComponent>
        </div>
      </div>
    </div>
  );
}
