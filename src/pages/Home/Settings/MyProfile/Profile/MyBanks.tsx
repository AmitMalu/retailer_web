import ButtonComponent from "@/components/Atoms/ButtonComponent";
import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import TableComponent from "@/components/Molecules/TableComponent";
import PayoutFormModal from "@/pages/Home/Products/Payout/PayoutForm";
import { RootState } from "@/Redux/Store";
import { Edit_Beneficiary_Bank_Details, User_Profile } from "@/Services/api";
import { decryptData } from "@/Utils/helper";
import { showErrorNotification, showSuccessNotification } from "@/Utils/notifications";
import { useBankVerification } from "@/Utils/Verification";
import { AddCircleOutlined, CheckCircle } from "@mui/icons-material";
import { useTheme } from "@mui/system";
import { useState } from "react";
import { useSelector } from "react-redux";

const MyBanks = () => {
  const theme = useTheme();
  const { verify: verifyBank } = useBankVerification();
  const [isLoading, setIsLoading] = useState(false);
  const [showDrawerForm, setShowDrawerForm] = useState(false);

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const UserProfileData = apiResponses?.userProfile
    ? decryptData(apiResponses?.userProfile)
    : null;

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const handleAddNewBank = () => {
    console.log("Add new bank clicked");
  }


  const handleVerifyBank = async (row: any) => {
    try {
      setIsLoading(true);
      // Step 1: Call 3rd party verification
      const response = await verifyBank({
        id_number: row?.accountNumber,
        ifsc: row?.ifscCode,
        ifsc_details: true,
      });

      if (response?.data?.data) {
        const verifiedData = response?.data?.data;

        // Step 3: Build payload for DB
        const payload = {
          id: row?.id,
          hierarchyId: row.hierarchyId,
          bankName: verifiedData?.ifsc_details?.bank_name || row.bankName,
          bankHolderName: verifiedData?.full_name || row.bankHolderName,
          bankAccountNumber: row.accountNumber,
          ifscCode: row.ifscCode,
          isVerified: true,
          createdBy: loginData?.mobileNumber,
        };

        // Step 4: Call DB API to persist changes
        const dbResponse = await Edit_Beneficiary_Bank_Details(payload);
        if (dbResponse?.status === 200 || dbResponse?.data?.status === "200") {
          showSuccessNotification("Bank verified & saved successfully");
          User_Profile(loginData?.hierarchyId); // re-fetch to get updated data in Redux
        } else {
          showErrorNotification(dbResponse?.data?.message || "Failed to save bank verification");
        }
      }
    } catch (error: any) {
      console.error("Bank verification failed:", error?.message);
      showErrorNotification(error?.message || "Error in bank verification");
    } finally {
      setIsLoading(false);
    }
  };

  const tableColumns = [
    { key: "bankName", label: "Bank Name", sortable: false },
    { key: "accountName", label: "Account Name", sortable: false },
    { key: "accountNo", label: "Account Number", sortable: false },
    { key: "ifcscode", label: "IFSC Code", sortable: false },
    {
      key: "isVerified",
      label: "Verified",
      searchKey: "isVerified",
      sortable: false,
      render: (_value: any, _index: number, row: any) => (
        <div className="flex items-center gap-2">
          {row?.isVerified ? (
            <div className="flex items-center gap-1">
              <CheckCircle color={theme?.palette?.GreenColor?.DEFAULT} />
              <TextComponent
                fontSize={14}
                fontWeight={500}
                color={theme?.palette?.GreenColor?.DEFAULT}
                align="center"
              >
                Verified
              </TextComponent>
            </div>
          ) : (
            <ButtonComponent
              title="Verify"
              variant="outline"
              radius={5}
              width={100}
              onClick={() => handleVerifyBank(row)}
            />
          )}
        </div>
      ),
      disableSearch: true
    },
    // // {
    // //   key: "verified",
    // //   label: "Verified",
    // //   sortable: false,
    // //   render: (_value: any, _index: number, row: any) => (
    // //     <div className="flex items-center bg-GreenColor-DEFAULT px-1 py-1 rounded text-center justify-center">
    // //       <TextComponent
    // //         color={theme.palette.background.paper}
    // //         fontSize={12}
    // //         fontWeight={400}
    // //       >
    // //         {row.verified === true ? "Verified" : "Not Verified"}
    // //       </TextComponent>
    // //     </div>
    // //   ),
    // },
    // {
    //   key: "action",
    //   label: "Action",
    //   sortable: false,
    //   render: (_value: any, _index: number, row: any) => (
    //     <div className="flex w-max items-center justify-between gap-2 justify-self-center">
    //       <UnstyledButton
    //         onClick={() => {
    //           // setSelectedRowData(row);
    //           // setShowDrawerForm(true);
    //         }}
    //       >
    //         <ViewDocSvgIcon color={theme.palette.red.DEFAULT} />
    //       </UnstyledButton>
    //     </div>
    //   ),
    // },
  ];

  return (
    <>
      {isLoading && <Loader />}
      <div className="flex flex-col gap-4">
        <TableComponent
          keyField="id"
          data={
            Array.isArray(UserProfileData?.myBanksList)
              ? UserProfileData.myBanksList
              : UserProfileData?.myBanksList
                ? [UserProfileData.myBanksList]
                : []
          }
          columns={tableColumns}
          enablePagination={false}
          onAddRow={
            (Array.isArray(UserProfileData?.myBanksList)
              ? UserProfileData.myBanksList.length
              : UserProfileData?.myBanksList
                ? 1
                : 0) < 2
              ? () => {
                setShowDrawerForm(false);
              }
              : undefined
          }
          addRowLabel="Add Bank"
          addRowIcon={<AddCircleOutlined style={{ color: "white" }} />}
        />
      </div>

      <PayoutFormModal
        opened={showDrawerForm}
        onClose={() => {
          setShowDrawerForm(false);
          // User_Profile(loginData?.hierarchyId);
        }}
      />
    </>
  );
};

export default MyBanks;
