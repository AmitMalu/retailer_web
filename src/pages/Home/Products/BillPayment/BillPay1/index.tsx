import { BackSvgIcon, BillPaymentSvgIcon } from "@/assets/svg";
import TextComponent from "@/components/Atoms/TextComponent";
import BbpsCard from "@/components/Molecules/BBPSCard";
import { Get_Provider_List } from "@/Services/api";
import { handleCustomError } from "@/Utils/handleCustomError";
import { decryptData } from "@/Utils/helper";
import { showErrorNotification } from "@/Utils/notifications";
import { Skeleton, UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Loader from "@/components/Atoms/Loader";
import { saveApiResponse } from "@/Redux/Actions/apiActions";
import { RootState } from "@/Redux/Store";

const BillPayOneScreen = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { subProductId } = location.state || {};
  const [isLoading, setIsLoading] = useState(false);
  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const bbpsServicesData = apiResponses?.bbpsServices
    ? decryptData(apiResponses?.bbpsServices)
    : null;
  const dispatch = useDispatch();
  const isMounted = useRef(true);

  // Fetch Provider List
  const fetchData = useCallback(async () => {
    if (!subProductId) return;

    if (isMounted.current) {
      try {
        setIsLoading(true);
        const response = await Get_Provider_List({ subProductId });
        if (response?.status === 200) {
          dispatch(saveApiResponse("bbpsServices", response?.data?.data));
        } else {
          showErrorNotification(response?.data?.message);
        }
      } catch (error) {
        await handleCustomError(error);
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    }
  }, [dispatch, subProductId]);

  useEffect(() => {
    isMounted.current = true;

    if (!bbpsServicesData || bbpsServicesData.length === 0) {
      fetchData();
    }

    return () => {
      isMounted.current = false;
    };
  }, [bbpsServicesData]);

  const cardsData = Array.from(
    new Map(
      (bbpsServicesData || []).map((services: any) => [
        services.service_name,
        {
          id: services.provider_id,
          title: services.service_name,
          providerName: services.provider_name,
        },
      ])
    ).values()
  );

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
      {isLoading && <Loader />}
      <UnstyledButton
        onClick={() => {
          navigate(`/products/billPay`);
        }}
      >
        <BackSvgIcon color={theme.palette.red.DEFAULT} />
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
                image={<BillPaymentSvgIcon color={theme.palette.red.DEFAULT} />}
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
