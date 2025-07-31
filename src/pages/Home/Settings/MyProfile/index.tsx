import { Tabs } from "@mantine/core";
import { useState } from "react";
import { useTheme } from "@mui/material";
import TextComponent from "@/components/Atoms/TextComponent";
import { AddUserSvgIcon, PasswordSvgIcon, ProfileSvgIcon } from "@/assets/svg";
import Profile from "./Profile";
import ChangePassowrd from "./Password";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";
import SubuserCreation from "./Subuser";

const MyProfile = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<string | null>("profile");

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  return (
    <Tabs
      value={activeTab}
      onChange={setActiveTab}
      color={theme.palette.red.DEFAULT}
    >
      <Tabs.List>
        <Tabs.Tab value="profile">
          <div className="flex items-center justify-center gap-2 ">
            <div
              className={` p-1 rounded-full ${
                activeTab === "profile" ? "bg-red-dark" : "bg-white"
              }`}
            >
              <ProfileSvgIcon
                color={
                  activeTab === "profile"
                    ? theme.palette.red.light
                    : theme.palette.gray.DEFAULT
                }
              />
            </div>
            <TextComponent
              fontSize={18}
              fontWeight={500}
              color={
                activeTab === "profile"
                  ? theme.palette.red.DEFAULT
                  : theme.palette.gray.DEFAULT
              }
            >
              My Profile
            </TextComponent>
          </div>
        </Tabs.Tab>
        {loginData?.role === "RT" && (
          <Tabs.Tab value="subUser">
            <div className="flex items-center justify-center gap-2 ">
              <AddUserSvgIcon
                color={
                  activeTab === "subUser"
                    ? theme.palette.red.DEFAULT
                    : theme.palette.gray.DEFAULT
                }
              />
              <TextComponent
                fontSize={18}
                fontWeight={500}
                color={
                  activeTab === "subUser"
                    ? theme.palette.red.DEFAULT
                    : theme.palette.gray.DEFAULT
                }
              >
                Create Sub-User
              </TextComponent>
            </div>
          </Tabs.Tab>
        )}
        <Tabs.Tab value="password">
          <div className="flex items-center justify-center gap-2 ">
            <PasswordSvgIcon
              color={
                activeTab === "password"
                  ? theme.palette.red.DEFAULT
                  : theme.palette.gray.DEFAULT
              }
            />
            <TextComponent
              fontSize={18}
              fontWeight={500}
              color={
                activeTab === "password"
                  ? theme.palette.red.DEFAULT
                  : theme.palette.gray.DEFAULT
              }
            >
              Password
            </TextComponent>
          </div>
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="profile">
        <Profile />
      </Tabs.Panel>
      <Tabs.Panel value="subUser">
        <SubuserCreation />
      </Tabs.Panel>
      <Tabs.Panel value="password">
        <ChangePassowrd />
      </Tabs.Panel>
    </Tabs>
  );
};

export default MyProfile;
