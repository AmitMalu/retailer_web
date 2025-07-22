import TextComponent from "@/components/Atoms/TextComponent";
import React from "react";

const WebsiteData = () => {
  return (
    <div>
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <TextComponent fontSize={30} fontWeight={500} color="error.main">
          Coming Soon!
        </TextComponent>
      </div>
    </div>
  );
};

export default WebsiteData;
