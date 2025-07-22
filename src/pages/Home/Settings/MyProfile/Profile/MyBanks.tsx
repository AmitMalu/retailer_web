import { ViewDocSvgIcon } from "@/assets/svg";
import TextComponent from "@/components/Atoms/TextComponent";
import TableComponent from "@/components/Molecules/TableComponent";
import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";
import { UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import { useSelector } from "react-redux";

const MyBanks = () => {
  const theme = useTheme();

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const UserProfileData = apiResponses?.userProfile
    ? decryptData(apiResponses?.userProfile)
    : null;

  const tableColumns = [
    { key: "bankName", label: "Bank Name", sortable: false },
    { key: "accountName", label: "Account Name", sortable: false },
    { key: "accountNo", label: "Account Number", sortable: false },
    { key: "ifcscode", label: "IFSC Code", sortable: false },
    {
      key: "verified",
      label: "Verified",
      sortable: false,
      render: (_value: any, _index: number, row: any) => (
        <div className="flex items-center bg-GreenColor-DEFAULT px-1 py-1 rounded text-center justify-center">
          <TextComponent
            color={theme.palette.background.paper}
            fontSize={12}
            fontWeight={400}
          >
            {row.verified === true ? "Verified" : "Not Verified"}
          </TextComponent>
        </div>
      ),
    },
    {
      key: "action",
      label: "Action",
      sortable: false,
      render: (_value: any, _index: number, row: any) => (
        <div className="flex w-max items-center justify-between gap-2 justify-self-center">
          <UnstyledButton
            onClick={() => {
              // setSelectedRowData(row);
              // setShowDrawerForm(true);
            }}
          >
            <ViewDocSvgIcon color={theme.palette.red.DEFAULT} />
          </UnstyledButton>
        </div>
      ),
    },
  ];

  console.log(UserProfileData?.myBanks, "UserProfileData?.myBanks");
  return (
    <div className="flex flex-col gap-4">
      <TableComponent
        data={
          Array.isArray(UserProfileData?.myBanks)
            ? UserProfileData.myBanks
            : UserProfileData?.myBanks
              ? [UserProfileData.myBanks]
              : []
        }
        columns={tableColumns}
        // onSelectRow={handleRowSelect}
        // onCurrentPageData={handleCurrentPageData}
        showSearch={false}
      />
    </div>
  );
};

export default MyBanks;
