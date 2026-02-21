import MudraSevakAsset from "./MudraSevak.svg";

type MudraSevakSvgProps = {
  width?: number | string;
  height?: number | string;
};

const MudraSevakSvg = ({ width = 86, height = 82 }: MudraSevakSvgProps) => {
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
      <img
        src={MudraSevakAsset}
        alt="Mudra Sevak"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
};

export default MudraSevakSvg;
