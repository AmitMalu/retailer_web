import React from "react";
import Lottie from "lottie-react";
import loaderAnimation from "../../assets/animation/Loader.json";

const Loader: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-30 flex h-full w-full items-center justify-center bg-transparent">
      <style>{`
        .loader-lottie svg path,
        .loader-lottie svg [stroke] {
          stroke: var(--primary-main) !important;
        }
      `}</style>
      <div className="loader-lottie flex h-[15%] w-[30%] items-center justify-center">
        <Lottie animationData={loaderAnimation} loop={true} />
      </div>
    </div>
  );
};

export default Loader;
