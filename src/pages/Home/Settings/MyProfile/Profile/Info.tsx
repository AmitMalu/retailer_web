import TextComponent from "@/components/Atoms/TextComponent";
import { useTheme } from "@mui/system";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";

const Info = () => {
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
          Name:
        </TextComponent>
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.gray.DEFAULT}
        >
          {UserProfileData?.info?.name || "-"}
        </TextComponent>
      </div>
      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] gap-2">
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.red.DEFAULT}
        >
          Member No:
        </TextComponent>
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.gray.DEFAULT}
        >
          {UserProfileData?.info?.memberId || "-"}
        </TextComponent>
      </div>
      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] gap-2">
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.red.DEFAULT}
        >
          Mobile Number:
        </TextComponent>
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.gray.DEFAULT}
        >
          {UserProfileData?.info?.mobileNumber || "-"}
        </TextComponent>
      </div>
      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] gap-2">
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.red.DEFAULT}
        >
          Email:
        </TextComponent>
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.gray.DEFAULT}
        >
          {UserProfileData?.info?.email || "-"}
        </TextComponent>
      </div>
      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] gap-2">
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.red.DEFAULT}
        >
          DOB:
        </TextComponent>
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.gray.DEFAULT}
        >
          {UserProfileData?.info?.dob || "-"}
        </TextComponent>
      </div>
      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] gap-2">
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.red.DEFAULT}
        >
          Outlet Name:
        </TextComponent>
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.gray.DEFAULT}
        >
          {UserProfileData?.info?.outletName || "-"}
        </TextComponent>
      </div>
      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] gap-2">
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.red.DEFAULT}
        >
          Is Blacklisted:
        </TextComponent>
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.gray.DEFAULT}
        >
          {UserProfileData?.info?.isBlacklisted === true ? "True" : "False"}
        </TextComponent>
      </div>
      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] gap-2">
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.red.DEFAULT}
        >
          Is Blocked:
        </TextComponent>
        <TextComponent
          fontSize={18}
          fontWeight={600}
          color={theme.palette.gray.DEFAULT}
        >
          {UserProfileData?.info?.isBlocked === true ? "True" : "False"}
        </TextComponent>
      </div>
    </div>
  );
};

export default Info;
