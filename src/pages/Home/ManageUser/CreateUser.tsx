import { Box } from "@mantine/core";
import CentralIconSvg from "@/assets/svg/UserCreation/centralIcon";
import { useTheme } from "@mui/system";
import SDSvgIcon from "@/assets/svg/UserCreation/SDIcon";
import PartnerSvgIcon from "@/assets/svg/UserCreation/PartnerIcon";
import DistributoeSVgIcon from "@/assets/svg/UserCreation/Distributor";
import TextComponent from "@/components/Atoms/TextComponent";
import { useState } from "react";
import ProfileRegistrationForm from "@/components/Organism/ProfileCreationModal";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";

const labels = [
  {
    label: "Partner",
    style: "left-[18%] top-[14%]",
  },
  {
    label: "Super Distributor",
    style: "left-[5%] top-[40%]",
  },
  {
    label: "Distributor",
    style: "right-[17%] top-[13%]",
  },
  {
    label: "Retailer",
    style: "right-[7%] top-[40%]",
  },
];

const CreateUser = () => {
  const theme = useTheme();
  const [showDrawerForm, setShowDrawerForm] = useState(false);
  const [openedAs, setOpenedAs] = useState<"SD" | "RT" | "PT" | "DT">("SD");

  const handleIconClick = (type: "SD" | "RT" | "PT" | "DT") => {
    setOpenedAs(type);
    setShowDrawerForm(true);
  };

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const roleLabelVisibility = {
    "Super Distributor": ["WL"],
    Partner: ["WL", "SD"],
    Distributor: ["WL", "SD", "PT"],
    Retailer: ["WL", "SD", "PT", "DT"],
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <TextComponent fontSize={30} fontWeight={500} color={"primary"}>
        User Creation
      </TextComponent>
      <div className="relative w-full max-w-3xl h-auto">
        <Box className="relative w-full h-[500px] flex items-center justify-center">
          {/* Center Red Circle */}
          <Box className="w-[300px] h-[300px] bg-red-600 rounded-full flex items-center justify-center shadow-lg relative">
            <div className=" w-[70%] h-[70%] ">
              <CentralIconSvg color="white" />
            </div>
          </Box>

          {/* Outer Labels */}
          {labels.map((item, index) => {
            const isVisible = roleLabelVisibility[
              item.label as keyof typeof roleLabelVisibility
            ]?.includes(loginData?.role);

            if (!isVisible) return null;

            return (
              <Box
                key={index}
                className={`absolute flex flex-col items-center ${item.style}`}
              >
                <TextComponent fontSize={14} fontWeight={500} color={"primary"}>
                  {item.label}
                </TextComponent>
              </Box>
            );
          })}

          {/* Dashed Curved Lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 500 500"
          >
            {/* Left arc */}
            <path
              d="M145,60 C40,150 40,250 50,300"
              fill="none"
              stroke="#e11d48"
              strokeWidth="3"
              strokeDasharray="6,6"
            />
            {(loginData?.role == "WL" || loginData?.role == "SD") && (
              <g
                className="pointer-events-auto"
                onClick={() => handleIconClick("PT")}
              >
                <circle
                  cx="110"
                  cy="100"
                  r="30"
                  fill={theme.palette.red.DEFAULT}
                  stroke={theme.palette.red.DEFAULT}
                  strokeWidth="2"
                  className="cursor-pointer"
                />
                <foreignObject
                  x="90"
                  y="80"
                  width="40"
                  height="40"
                  className="pointer-events-none"
                >
                  <div className="flex items-center justify-center h-full cursor-pointer">
                    <PartnerSvgIcon
                      color={theme.palette.background.navBackground}
                    />
                  </div>
                </foreignObject>
              </g>
            )}
            {loginData?.role == "WL" && (
              <g
                className="pointer-events-auto"
                onClick={() => handleIconClick("SD")}
              >
                <circle
                  cx="50"
                  cy="215"
                  r="30"
                  fill={theme.palette.red.DEFAULT}
                  stroke={theme.palette.red.DEFAULT}
                  strokeWidth="2"
                  className="cursor-pointer"
                />
                <foreignObject
                  x="30"
                  y="195"
                  width="40"
                  height="40"
                  className="pointer-events-none"
                >
                  <div className="flex items-center justify-center h-full cursor-pointer">
                    <SDSvgIcon color={theme.palette.background.navBackground} />
                  </div>
                </foreignObject>
              </g>
            )}
            {/* Right arc */}
            <path
              d="M355,60 C460,150 460,250 450,300"
              fill="none"
              stroke="#e11d48"
              strokeWidth="3"
              strokeDasharray="6,6"
            />
            {(loginData?.role == "WL" ||
              loginData?.role == "SD" ||
              loginData?.role == "PT") && (
              <g
                className="pointer-events-auto"
                onClick={() => handleIconClick("DT")}
              >
                <circle
                  cx="390"
                  cy="98"
                  r="30"
                  fill={theme.palette.red.DEFAULT}
                  stroke={theme.palette.red.DEFAULT}
                  strokeWidth="2"
                  className="cursor-pointer"
                />
                <foreignObject
                  x="370"
                  y="80"
                  width="40"
                  height="40"
                  className="pointer-events-none"
                >
                  <div className="flex items-center justify-center h-full cursor-pointer">
                    <DistributoeSVgIcon
                      color={theme.palette.background.navBackground}
                    />
                  </div>
                </foreignObject>
              </g>
            )}
            {(loginData?.role == "WL" ||
              loginData?.role == "SD" ||
              loginData?.role == "PT" ||
              loginData?.role == "DT") && (
              <g
                className="pointer-events-auto"
                onClick={() => handleIconClick("RT")}
              >
                <circle
                  cx="450"
                  cy="216"
                  r="30"
                  fill={theme.palette.red.DEFAULT}
                  stroke={theme.palette.red.DEFAULT}
                  strokeWidth="2"
                  className="cursor-pointer"
                />
                <foreignObject
                  x="430"
                  y="195"
                  width="40"
                  height="40"
                  className="pointer-events-none"
                >
                  <div className="flex items-center justify-center h-full cursor-pointer">
                    <DistributoeSVgIcon
                      color={theme.palette.background.navBackground}
                    />
                  </div>
                </foreignObject>
              </g>
            )}
          </svg>
        </Box>
      </div>

      {/* Modal */}
      <ProfileRegistrationForm
        opened={showDrawerForm}
        onClose={() => setShowDrawerForm(false)}
        openedAs={openedAs}
      />
    </div>
  );
};

export default CreateUser;
