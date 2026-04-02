import { BackSvgIcon, BillPaymentSvgIcon } from "@/assets/svg";
import TextComponent from "@/components/Atoms/TextComponent";
import BbpsCard from "@/components/Molecules/BBPSCard";
import { Skeleton, UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BillPayOneScreen = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { subProductId } = location.state || {};
  const [isLoading, setIsLoading] = useState(false);
  const [cardsData, setCardsData] = useState<any[]>([]);

  const loadServiceProviders = () =>
    import("./Config").then((module) => module.AtoZServiceProviders);

  useEffect(() => {
    setIsLoading(true);

    loadServiceProviders().then((providers) => {
      const uniqueCards = Array.from(
        new Map(
          providers.map((services: any) => [
            services.service_name,
            {
              id: services.provider_id,
              title: services.service_name,
              providerName: services.provider_name,
            },
          ])
        ).values()
      );

      setCardsData(uniqueCards);
      setIsLoading(false);
    });
  }, []);

  const handleIconClick = ({ serviceName }: { serviceName: string }) => {
    navigate(`/products/billPay/service/billDetails`, {
      state: {
        serviceName: serviceName,
        subProductId: subProductId,
      },
    });
  };

  useEffect(() => {
    if (subProductId === undefined) {
      navigate(`/products/billPay`);
    }
  }, [subProductId, navigate]);

  // --- Skeleton Shimmer Cards ---
  const shimmerCards = Array.from({ length: 6 }).map((_, index) => (
    <div
      key={index}
      className="relative flex flex-col items-center min-h-[120px]"
    >
      <div
        className="relative w-36 h-36 rounded-3xl border-2 border-red-dark bg-white shadow-md flex flex-col items-center justify-center gap-3"
      >
        <Skeleton height={45} width="30%" mb="sm" />
        <Skeleton height={14} width="70%" radius="xl" />
      </div>
    </div>
  ));

  return (
    <>
      <UnstyledButton
        onClick={() => {
          navigate(`/products/billPay`);
        }}
      >
        <BackSvgIcon color={theme.palette.primary.main} />
      </UnstyledButton>
      <div className="mx-auto px-4 text-center relative">
        <TextComponent
          fontSize={28}
          fontWeight={600}
          color={"background.default"}
        >
          Bharat Bill Payment System
        </TextComponent>
      </div>

      <div className="flex flex-col items-center gap-6 mt-8">
        <div className="flex justify-center gap-6 flex-wrap">
          {isLoading
            ? shimmerCards // show shimmering skeletons while loading
            : cardsData.map((card: any) => (
              <BbpsCard
                key={card.id}
                image={<BillPaymentSvgIcon color={theme.palette.primary.dark} />}
                title={card.title}
                onClick={() => handleIconClick({ serviceName: card.title })}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default BillPayOneScreen;
