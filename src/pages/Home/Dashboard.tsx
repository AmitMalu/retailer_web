import { useEffect, useRef } from "react";
import TextComponent from "@/components/Atoms/TextComponent";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import {
  decryptData,
  useIpAddress,
  useWalletBalance,
  useSubProductDropdown,
} from "@/Utils/helper";
import RetailerDashboard from "@/components/Organism/Dashboard/RetailerDashboard";

export default function Dashboard() {
  const { fetchIpAddress } = useIpAddress();
  const { WalletBalanceReq } = useWalletBalance();
  const { SubProductDropdownReq } = useSubProductDropdown();
  const isFetchingRef = useRef(false);
  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  useEffect(() => {
    if (!isFetchingRef.current) {
      isFetchingRef.current = true;
      fetchIpAddress();
      WalletBalanceReq(loginData?.hierarchyId);
      SubProductDropdownReq();
    }
  }, []);

  return (
    <div style={{
      scrollbarWidth: "none",
    }}
      className="flex h-[calc(100vh-90px)] mx-auto p-4 items-center justify-center">
      <RetailerDashboard />
    </div>
  );
}
