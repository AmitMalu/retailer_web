import { ProductCardProps } from "@/Common/interface";
import TextComponent from "../Atoms/TextComponent";

export function ProductCard({ image, title, fill = false }: ProductCardProps) {
  return (
    <div className="relative flex flex-col items-center min-h-[120px]">
      <div className="absolute top-0 h-10 w-px bg-black" />

      <div
        className={`relative w-36 h-36 transform rotate-45 rounded-3xl  border-2 border-red-500 shadow-md z-10 ${fill ? "bg-red" : "bg-white"}`}
      >
        <div className="absolute inset-0 transform -rotate-45 flex flex-col items-center justify-center p-2 gap-2">
          {image}
          <TextComponent
            fontSize={14}
            fontWeight={500}
            color={fill ? "white" : "primary"}
          >
            {title}
          </TextComponent>
        </div>
      </div>
    </div>
  );
}
