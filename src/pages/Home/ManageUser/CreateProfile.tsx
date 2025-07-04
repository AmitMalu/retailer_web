import { Box, Text } from "@mantine/core";
import CentralIconSvg from "@/assets/svg/UserCreation/centralIcon";
import { useTheme } from "@mui/system";
import SDSvgIcon from "@/assets/svg/UserCreation/SDIcon";
import WhiteLabelSvgIcon from "@/assets/svg/UserCreation/WhiteLabelIcon";
import PartnerSvgIcon from "@/assets/svg/UserCreation/PartnerIcon";
import DistributoeSVgIcon from "@/assets/svg/UserCreation/Distributor";
import TextComponent from "@/components/Atoms/TextComponent";

const labels = [
  {
    label: "Super Distributor",
    style: "left-[7%] top-[14%]",
  },
  {
    label: "White Label",
    style: "left-[5%] top-[40%]",
  },
  {
    label: "Partner",
    style: "right-[17%] top-[13%]",
  },
  {
    label: "Distributor",
    style: "right-[7%] top-[40%]",
  },
];

const CreateProfile = () => {
  const theme = useTheme();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
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
          {labels.map((item, index) => (
            <Box
              key={index}
              className={`absolute flex flex-col items-center ${item.style}`}
            >
              <Text size="sm" className="text-red-600 font-medium">
                {item.label}
              </Text>
            </Box>
          ))}

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
            <g>
              <circle
                cx="110"
                cy="100"
                r="30"
                fill={theme.palette.red.DEFAULT}
                stroke={theme.palette.red.DEFAULT}
                strokeWidth="2"
              />
              <foreignObject x="90" y="80" width="40" height="40">
                <div className="flex items-center justify-center h-full">
                  <SDSvgIcon color={theme.palette.background.navBackground} />
                </div>
              </foreignObject>
            </g>
            <g>
              <circle
                cx="50"
                cy="215"
                r="30"
                fill={theme.palette.red.DEFAULT}
                stroke={theme.palette.red.DEFAULT}
                strokeWidth="2"
              />
              <foreignObject x="30" y="195" width="40" height="40">
                <div className="flex items-center justify-center h-full">
                  <WhiteLabelSvgIcon
                    color={theme.palette.background.navBackground}
                  />
                </div>
              </foreignObject>
            </g>

            {/* Right arc */}
            <path
              d="M355,60 C460,150 460,250 450,300"
              fill="none"
              stroke="#e11d48"
              strokeWidth="3"
              strokeDasharray="6,6"
            />
            <g>
              <circle
                cx="390"
                cy="98"
                r="30"
                fill={theme.palette.red.DEFAULT}
                stroke={theme.palette.red.DEFAULT}
                strokeWidth="2"
              />
              <foreignObject x="370" y="80" width="40" height="40">
                <div className="flex items-center justify-center h-full">
                  <PartnerSvgIcon
                    color={theme.palette.background.navBackground}
                  />
                </div>
              </foreignObject>
            </g>

            <g>
              <circle
                cx="450"
                cy="216"
                r="30"
                fill={theme.palette.red.DEFAULT}
                stroke={theme.palette.red.DEFAULT}
                strokeWidth="2"
              />
              <foreignObject x="430" y="195" width="40" height="40">
                <div className="flex items-center justify-center h-full">
                  <DistributoeSVgIcon
                    color={theme.palette.background.navBackground}
                  />
                </div>
              </foreignObject>
            </g>
          </svg>
        </Box>
      </div>
    </div>
  );
};

export default CreateProfile;
