import TextComponent from "@/components/Atoms/TextComponent";
import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";
import { useTheme } from "@mui/system";
import { useSelector } from "react-redux";

const Address = () => {
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
          color={theme.palette.primary.main}
        >
          Building / Apartment:
        </TextComponent>
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.gray.DEFAULT}
        >
          {UserProfileData?.address?.building || "-"}
        </TextComponent>
      </div>
      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] gap-2">
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.primary.main}
        >
          City:
        </TextComponent>
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.gray.DEFAULT}
        >
          {UserProfileData?.address?.city || "-"}
        </TextComponent>
      </div>
      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] gap-2">
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.primary.main}
        >
          State:
        </TextComponent>
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.gray.DEFAULT}
        >
          {UserProfileData?.address?.state || "-"}
        </TextComponent>
      </div>
      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] gap-2">
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.primary.main}
        >
          Pincode:
        </TextComponent>
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.gray.DEFAULT}
        >
          {UserProfileData?.address?.pinCode || "-"}
        </TextComponent>
      </div>
    </div>
  );
};

export default Address;
