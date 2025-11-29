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

const AepsScreen = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { subProductId } = useParams()
  const { state } = useLocation();
  const profile = state?.profile;

  const row1 = [
    {
      id: 1,
      image: <CashWithdrawalSvgIcon color={theme.palette.red.DEFAULT} />,
      title: "Cash Withdrawal",
      onClick: () => {
        navigate(`/products/aeps/transaction/${subProductId}?service=cashWithdrawal`, {
          state: { profile },
        });
      },
    },
    {
      id: 2,
      image: <BalanceEnquirySvgIcon color={theme.palette.red.DEFAULT} />,
      title: "Balance Enquiry",
      onClick: () => {
        navigate(`/products/aeps/transaction/${subProductId}?service=balanceInquiry`, {
          state: { profile },
        });
      },
    },
    {
      id: 3,
      image: <MiniStatementSvgIcon color={theme.palette.red.DEFAULT} />,
      title: "Mini Statement",
      onClick: () => {
        navigate(`/products/aeps/transaction/${subProductId}?service=miniStatement`, {
          state: { profile },
        });
      },
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
