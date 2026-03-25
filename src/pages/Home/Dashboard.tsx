import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import {
  decryptData,
  useWalletBalance,
  useSubProductDropdown,
} from "@/Utils/helper";
import RetailerDashboard from "@/components/Organism/Dashboard/RetailerDashboard";
import CommonDashboard from "@/components/Organism/Dashboard/CommonDashboard";
import { Dashboard_Api } from "@/Services/api";
import { showErrorNotification } from "@/Utils/notifications";
import { handleCustomError } from "@/Utils/handleCustomError";
import { DateRangeLabel, getLabelFromRange, getRangeFromLabel } from "@/Utils/dateRangeUtils";
import { DatesRangeValue } from "@mantine/dates";
import moment from "moment";
import Loader from "@/components/Atoms/Loader";

export default function Dashboard() {
  const { WalletBalanceReq } = useWalletBalance();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { SubProductDropdownReq } = useSubProductDropdown();

  const isFetchingRef = useRef(false); // wallet + dropdown

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const subproductData = apiResponses?.subProductDropdown
    ? decryptData(apiResponses?.subProductDropdown)
    : null;

  const [selectedDate, setSelectedDate] = useState<DatesRangeValue>(() =>
    getRangeFromLabel("Last 7 Days")
  );

  const [selectedLabel, setSelectedLabel] =
    useState<DateRangeLabel>("Last 7 Days");

  // 📡 API call
  const dashboardDataReq = async () => {
    if (!loginData?.hierarchyId || !selectedDate) return;
    const [fromDate, toDate] = selectedDate;
    if (!fromDate || !toDate) return;
    try {
      setIsLoading(true);
      // Format dates as YYYY-MM-DD (or your API format)
      const payload = {
        hierarchyId: loginData.hierarchyId,
        fromDate: moment(fromDate).format("YYYY-MM-DD"),
        toDate: moment(toDate).format("YYYY-MM-DD"),
      };
      const response = await Dashboard_Api(payload);
      if (response?.status === 200 || response?.status === 201) {
        setDashboardData(response.data?.data);
      } else {
        showErrorNotification(response?.data?.message || "Failed to fetch Dashboard Data");
      }
    } catch (error) {
      await handleCustomError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update label when date changes
  useEffect(() => {
    setSelectedLabel(getLabelFromRange(selectedDate));
  }, [selectedDate]);

  // Initial one-time calls (wallet + dropdown)
  useEffect(() => {
    if (loginData?.hierarchyId && !isFetchingRef.current) {
      isFetchingRef.current = true;
      WalletBalanceReq(loginData?.hierarchyId);
    }
  }, [loginData?.hierarchyId]);

  useEffect(() => {
    if (!subproductData) {
      SubProductDropdownReq();
    }
  }, [subproductData]);

  useEffect(() => {
    if (!loginData?.hierarchyId) return;
    dashboardDataReq();
  }, [loginData?.hierarchyId, selectedDate]);

  const commonProps = {
    selectedDate,
    setSelectedDate,
    selectedLabel,
    dashboardData,
    isLoading,
  };

  return (
    <>
      {isLoading && <Loader />}
      <div style={{
        scrollbarWidth: "none",
      }}
        className="flex h-[calc(100vh-90px)] mx-auto p-4 items-center justify-center">
        {loginData?.role === "RT" || loginData?.role === "RU" ? (
          <RetailerDashboard  {...commonProps} />
        ) : (
          <CommonDashboard  {...commonProps} />
        )}
      </div>
    </>
  );
}
