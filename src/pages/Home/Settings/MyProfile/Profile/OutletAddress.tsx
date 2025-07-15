import TextComponent from "@/components/Atoms/TextComponent";
import { useTheme } from "@mui/system";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";

const OutletAddress = () => {
  const theme = useTheme();
  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const UserProfileData = apiResponses?.userProfile
    ? decryptData(apiResponses?.userProfile)
    : null;
  return (
    <div className="mt-16 w-full flex flex-wrap items-start justify-start gap-6 ">
      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] gap-2">
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.red.DEFAULT}
        >
          Building / Apartment:
        </TextComponent>
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.gray.DEFAULT}
        >
          {UserProfileData?.outletAddress?.outletBuilding || "-"}
        </TextComponent>
      </div>
      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] gap-2">
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.red.DEFAULT}
        >
          City:
        </TextComponent>
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.gray.DEFAULT}
        >
          {UserProfileData?.outletAddress?.outletCity || "-"}
        </TextComponent>
      </div>
      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] gap-2">
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.red.DEFAULT}
        >
          State:
        </TextComponent>
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.gray.DEFAULT}
        >
          {UserProfileData?.outletAddress?.outletState || "-"}
        </TextComponent>
      </div>
      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] gap-2">
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.red.DEFAULT}
        >
          Pincode:
        </TextComponent>
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.gray.DEFAULT}
        >
          {UserProfileData?.outletAddress?.outletPinCode || "-"}
        </TextComponent>
      </div>
    </div>
  );
};

export default OutletAddress;
