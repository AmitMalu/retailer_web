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
import { Check_Aeps_2FA_Status } from "@/Services/api";
import { decryptData } from "@/Utils/helper";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";

const AepsScreen = () => {
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

    // navigate(`/products/aeps/transaction/${subProductId}?service=${service}`, {
    //   state: { profile },
    // });

    // return

    try {
      const res = await Check_Aeps_2FA_Status({ retailerId: loginData?.hierarchyId });

      if (res?.data?.statusCode === 200) {
        const onboardStatus = res?.data?.data?.onboardStatus;

        if (onboardStatus === 3) {
          // Status 3 → go to transaction
          navigate(`/products/aeps/transaction/${subProductId}?service=${service}`, {
            state: { profile },
          });
        } else if (onboardStatus === 2) {
          // Status 2 → go to 2FA page
          navigate(`/products/aeps/2fa/${subProductId}?iinno=`, {
            state: { profile },
          });
        } else {
          // Other statuses → default to 2FA
          navigate(`/products/aeps/2fa/${subProductId}?iinno=`, {
            state: { profile },
          });
        }
      } else {
        // API error → treat as invalid 2FA
        navigate(`/products/aeps/2fa/${subProductId}?iinno=`, {
          state: { profile },
        });
      }
    } catch (e) {
      // on error → treat as invalid 2FA
      navigate(`/products/aeps/2fa/${subProductId}?iinno=`, {
        state: { profile },
      });
    }
  };

  const row1 = [
    {
      id: 1,
      image: <CashWithdrawalSvgIcon color={theme.palette.red.DEFAULT} />,
      title: "Cash Withdrawal",
      onClick: () => handleServiceClick('cashWithdrawal'),
    },
    {
      id: 2,
      image: <BalanceEnquirySvgIcon color={theme.palette.red.DEFAULT} />,
      title: "Balance Enquiry",
      onClick: () => handleServiceClick('balanceInquiry'),
    },
    {
      id: 3,
      image: <MiniStatementSvgIcon color={theme.palette.red.DEFAULT} />,
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
        <BackSvgIcon color={theme.palette.red.DEFAULT} />
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

export default AepsScreen;
