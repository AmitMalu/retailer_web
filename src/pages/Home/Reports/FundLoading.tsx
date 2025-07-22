import TextComponent from "@/components/Atoms/TextComponent";

const FundLoading = () => {
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

export default FundLoading;
