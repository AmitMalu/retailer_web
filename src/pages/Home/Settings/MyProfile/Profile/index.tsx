import TextComponent from "@/components/Atoms/TextComponent";
import { Tabs } from "@mantine/core";
import { useTheme } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import Info from "./Info";
import Address from "./Address";
import OutletAddress from "./OutletAddress";
import MyBanks from "./MyBanks";
import KycDoc from "./KycDoc";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";
import { showErrorNotification } from "@/Utils/notifications";
import { handleCustomError } from "@/Utils/handleCustomError";
import { User_Profile } from "@/Services/api";
import { useDispatch } from "react-redux";
import { saveApiResponse } from "@/Redux/Actions/apiActions";

const Profile = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [value, setValue] = useState<string | null>("1");
  const isFetchingRef = useRef<boolean>(false);

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  useEffect(() => {
    if (!isFetchingRef.current) {
      isFetchingRef.current = true;
      FetchUserList();
    }
  }, []);

  const FetchUserList = async () => {
    try {
      const response = await User_Profile(loginData?.hierarchyId);
      if (response?.status === 200) {
        dispatch(saveApiResponse("userProfile", response?.data?.data));
      } else {
        showErrorNotification(response?.data?.message);
      }
    } catch (error) {
      await handleCustomError(error);
    }
  };

  return (
    <Tabs variant="none" value={value} onChange={setValue} className="mt-16">
      <Tabs.List>
        <Tabs.Tab value="1">
          <div
            className={`py-2 px-4 bg-background-paper border-2 rounded-full ${value === "1" ? "border-red-dark" : "border-gray"}`}
          >
            <TextComponent
              fontSize={value === "1" ? 18 : 16}
              fontWeight={value === "1" ? 600 : 400}
              color={
                value === "1"
                  ? theme.palette.red.DEFAULT
                  : theme.palette.gray.DEFAULT
              }
            >
              INFO
            </TextComponent>
          </div>
        </Tabs.Tab>
        <Tabs.Tab value="2">
          <div
            className={`py-2 px-4 bg-background-paper border-2 rounded-full ${value === "2" ? "border-red-dark" : "border-gray"}`}
          >
            <TextComponent
              fontSize={value === "2" ? 18 : 16}
              fontWeight={value === "2" ? 600 : 400}
              color={
                value === "2"
                  ? theme.palette.red.DEFAULT
                  : theme.palette.gray.DEFAULT
              }
            >
              ADDRESS
            </TextComponent>
          </div>
        </Tabs.Tab>
        <Tabs.Tab value="3">
          <div
            className={`py-2 px-4 bg-background-paper border-2 rounded-full ${value === "3" ? "border-red-dark" : "border-gray"}`}
          >
            <TextComponent
              fontSize={value === "3" ? 18 : 16}
              fontWeight={value === "3" ? 600 : 400}
              color={
                value === "3"
                  ? theme.palette.red.DEFAULT
                  : theme.palette.gray.DEFAULT
              }
            >
              OUTLET ADDRESS
            </TextComponent>
          </div>
        </Tabs.Tab>
        <Tabs.Tab value="4">
          <div
            className={`py-2 px-4 bg-background-paper border-2 rounded-full ${value === "4" ? "border-red-dark" : "border-gray"}`}
          >
            <TextComponent
              fontSize={value === "4" ? 18 : 16}
              fontWeight={value === "4" ? 600 : 400}
              color={
                value === "4"
                  ? theme.palette.red.DEFAULT
                  : theme.palette.gray.DEFAULT
              }
            >
              MY BANKS
            </TextComponent>
          </div>
        </Tabs.Tab>
        <Tabs.Tab value="5">
          <div
            className={`py-2 px-4 bg-background-paper border-2 rounded-full ${value === "5" ? "border-red-dark" : "border-gray"}`}
          >
            <TextComponent
              fontSize={value === "5" ? 18 : 16}
              fontWeight={value === "5" ? 600 : 400}
              color={
                value === "5"
                  ? theme.palette.red.DEFAULT
                  : theme.palette.gray.DEFAULT
              }
            >
              KYC DOCS
            </TextComponent>
          </div>
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="1">
        <Info />
      </Tabs.Panel>
      <Tabs.Panel value="2">
        <Address />
      </Tabs.Panel>
      <Tabs.Panel value="3">
        <OutletAddress />
      </Tabs.Panel>
      <Tabs.Panel value="4">
        <MyBanks />
      </Tabs.Panel>
      <Tabs.Panel value="5">
        <KycDoc />
      </Tabs.Panel>
    </Tabs>
  );
};

export default Profile;
