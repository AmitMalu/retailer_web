import { BrandMark } from "@/components/Brand/BrandLogo";

type ScsAssistantSvgProps = {
  width?: number | string;
  height?: number | string;
};

// Chat assistant avatar: the Smart Credit brand mark
const ScsAssistantSvg = ({ width = 86, height = 82 }: ScsAssistantSvgProps) => {
  const size = Math.min(Number(width) || 86, Number(height) || 82);
  return (
    <div
      style={{
        width,
        height,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <BrandMark size={size} />
    </div>
  );
};

export default ScsAssistantSvg;
