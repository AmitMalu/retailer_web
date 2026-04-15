import ButtonComponent from "@/components/Atoms/ButtonComponent";
import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import TableComponent from "@/components/Molecules/TableComponent";
import { RootState } from "@/Redux/Store";
import { Delete_Bank, Edit_Bank, User_Profile } from "@/Services/api";
import { decryptData } from "@/Utils/helper";
import { showErrorNotification, showSuccessNotification } from "@/Utils/notifications";
import { useBankVerification } from "@/Utils/Verification";
import { AddCircleOutlined, CheckCircle } from "@mui/icons-material";
import { useTheme } from "@mui/system";
import { useState } from "react";
import { useSelector } from "react-redux";
import AddBankForm from "./AddBankForm";
import { saveApiResponse } from "@/Redux/Actions/apiActions";
import { useDispatch } from "react-redux";
import { UnstyledButton } from "@mantine/core";
import { TrashSvgIcon } from "@/assets/svg";

const MyBanks = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
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

  // ✅ Handle bank verification
  const handleVerifyBank = async (row: any) => {
    try {
      setIsLoading(true);
      // Step 1: Call 3rd party verification
      const response = await verifyBank({
        id_number: row?.accountNo,
        ifsc: row?.ifcscode,
        ifsc_details: true,
      });

      if (response?.data?.data) {
        const verifiedData = response?.data?.data;

        // Step 3: Build payload for DB
        const payload = {
          id: row?.id,
          hierarchyId: loginData?.hierarchyId,
          bankName: verifiedData?.ifsc_details?.bank_name || row.bankName,
          bankHolderName: verifiedData?.full_name || row.bankHolderName,
          bankAccountNumber: row.accountNo,
          ifscCode: row.ifcscode,
          isVerified: true,
          createdBy: loginData?.mobileNumber,
        };

        // Step 4: Call DB API to persist changes
        const dbResponse = await Edit_Bank(payload);
        if (dbResponse?.status === 200 || dbResponse?.data?.status === "200") {
          showSuccessNotification("Bank verified & saved successfully");

          const response = await User_Profile(loginData?.hierarchyId); // re-fetch to get updated data in Redux
          if (response?.data?.statusCode == 200) {
            dispatch(saveApiResponse("userProfile", response?.data?.data));
          } else {
            showErrorNotification(response?.data?.message);
          }
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

  // Handle delete bank
  const handleDeleteBank = async (id: any) => {
    if (!id) {
      showErrorNotification("Bank ID Not Found");
      return
    }
    try {
      const res = await Delete_Bank(id);

      if (res?.data?.statusCode === 200) {
        showSuccessNotification("Bank deleted successfully");

        const profileRes = await User_Profile(loginData?.hierarchyId);
        if (profileRes?.data?.statusCode === 200) {
          dispatch(saveApiResponse("userProfile", profileRes.data.data));
        } else {
          showErrorNotification(profileRes?.data?.message);
        }
      } else {
        showErrorNotification(res?.data?.message || "Failed to delete bank");
      }
    } catch (error: any) {
      console.error("Delete bank failed:", error);
      showErrorNotification(error?.response.data.message || error?.message || "Error deleting bank");
    }
  };

  // Table columns
  const tableColumns = [
    { key: "id", label: "ID", sortable: false },
    { key: "bankName", label: "Bank Name", sortable: false },
    { key: "accountName", label: "Bank Holder Name", sortable: false },
    { key: "accountNo", label: "Account Number", sortable: false },
    { key: "ifcscode", label: "IFSC Code", sortable: false },
    {
      key: "isVerified",
      label: "Verified",
      searchKey: "isVerified",
      sortable: false,
      render: (_value: any, _index: number, row: any) => (
        <div className="flex items-center gap-2">
          {row?.verified ? (
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
    {
      key: "action",
      label: "Delete",
      sortable: false,
      searchKey: "action",
      disableSearch: true,
      render: (_value: any, _index: number, rowData: any) => {

        return (
          <UnstyledButton onClick={() => handleDeleteBank(rowData?.id)}>
            <TrashSvgIcon color={theme.palette.gray.DEFAULT} />
          </UnstyledButton>
        )
      },
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
    //         <ViewDocSvgIcon color={theme.palette.primary.dark} />
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
          showNoDataFound={false}
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
                setShowDrawerForm(true);
              }
              : undefined
          }
          addRowLabel="Add Bank"
          addRowIcon={<AddCircleOutlined style={{ color: "white" }} />}
        />
      </div>

      <AddBankForm
        opened={showDrawerForm}
        onClose={() => {
          setShowDrawerForm(false);
        }}
      />
    </>
  );
};

export default MyBanks;
