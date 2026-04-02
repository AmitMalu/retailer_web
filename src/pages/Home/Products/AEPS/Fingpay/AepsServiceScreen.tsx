import TextComponent from "@/components/Atoms/TextComponent";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/system";
import { UnstyledButton } from "@mantine/core";
import {
  BackSvgIcon,
  BalanceEnquirySvgIcon,
  CashWithdrawalSvgIcon,
  MiniStatementSvgIcon,
} from "@/assets/svg";
import AepsCard from "@/components/Molecules/AepsCard";
import { callAepsApi } from "@/Services/api";
import { decryptData } from "@/Utils/helper";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import { AepsScreenProps } from "../AepsVendorConfig";

const AepsServiceScreen = ({ vendorKey }: AepsScreenProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { subProductId } = useParams()
  const { state } = useLocation();
  const profile = state?.profile;

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const handleServiceClick = async (service: string) => {
    try {
      const res = await callAepsApi(
        vendorKey,
        "checkAeps2FaStatus",
        {
          retailerId: loginData?.hierarchyId
        }
      );

      console.log("2FA Status Response:", res);

      if (res?.data?.statusCode == 200) {
        const twoFaStatus = res?.data?.data?.twoFaStatus;
        console.log("Onboard Status:", twoFaStatus);
        if (twoFaStatus === 5) {
          // Status 5 → go to transaction
          navigate(`/products/aeps/transaction/${subProductId}?service=${service}`, {
            state: { profile },
          });
        } else if (twoFaStatus === 3 || twoFaStatus === 4) {
          // Status 3, 4 → go to 2FA page
          navigate(`/products/aeps/2fa/${subProductId}?iinno=&service=${service}`, {
            state: { profile },
          });
        } else {
          // Other statuses → default to 2FA
          navigate(`/products/aeps/2fa/${subProductId}?iinno=&service=${service}`, {
            state: { profile },
          });
        }
      } else {
        // API error → treat as invalid 2FA
        navigate(`/products/aeps/2fa/${subProductId}?iinno=&service=${service}`, {
          state: { profile },
        });
      }
    } catch (e) {
      // on error → treat as invalid 2FA
      navigate(`/products/aeps/2fa/${subProductId}?iinno=&service=${service}`, {
        state: { profile },
      });
    }
  };

  const row1 = [
    {
      id: 1,
      image: <CashWithdrawalSvgIcon color={theme.palette.primary.main} />,
      title: "Cash Withdrawal",
      onClick: () => handleServiceClick('cashWithdrawal'),
    },
    {
      id: 2,
      image: <BalanceEnquirySvgIcon color={theme.palette.primary.main} />,
      title: "Balance Enquiry",
      onClick: () => handleServiceClick('balanceInquiry'),
    },
    {
      id: 3,
      image: <MiniStatementSvgIcon color={theme.palette.primary.main} />,
      title: "Mini Statement",
      onClick: () => handleServiceClick('miniStatement'),
    },
  ];


  return (
    <>
      <UnstyledButton
        onClick={() => {
          navigate(`/products/aeps`);
        }}
      >
        <BackSvgIcon color={theme.palette.primary.main} />
      </UnstyledButton>
      <div className="mx-auto py-10 px-4 text-center relative">
        <TextComponent
          fontSize={28}
          fontWeight={600}
          color={"background.default"}
        >
          AEPS Services
        </TextComponent>

        <div className="flex justify-center gap-28 my-12">
          {row1.map((product) => (
            <AepsCard
              key={product.id}
              image={product.image}
              title={product.title}
              onClick={product.onClick}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default AepsServiceScreen;
