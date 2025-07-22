import { ViewDocSvgIcon } from "@/assets/svg";
import { KycDocList } from "@/Common/interface";
import TableComponent from "@/components/Molecules/TableComponent";
import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";
import { UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import { useSelector } from "react-redux";

const KycDoc = () => {
  const theme = useTheme();
  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const UserProfileData = apiResponses?.userProfile
    ? decryptData(apiResponses?.userProfile)
    : null;

  const tableColumns = [
    {
      key: "document",
      label: "Document",
      searchKey: "document",
      sortable: false,
    },
    {
      key: "documentNo",
      label: "Document No",
      searchKey: "documentNo",
      sortable: false,
    },
    // {
    //   key: "verified",
    //   label: "Status",
    //   render: (row: KycDocList) => (
    //     <div className="flex items-center bg-GreenColor-DEFAULT px-1 py-1 rounded text-center justify-center">
    //       <TextComponent
    //         color={theme.palette.background.paper}
    //         fontSize={12}
    //         fontWeight={400}
    //       >
    //         {row.verified === true ? "Verified" : "Not Verified"}
    //       </TextComponent>
    //     </div>
    //   ),
    //   searchKey: "verified",
    //   sortable: false,
    // },
    {
      key: "action",
      label: "Action",
      render: (row: KycDocList) => (
        <div className="flex w-max items-center justify-between gap-2  justify-self-center">
          <UnstyledButton
            onClick={() => {
              // setSelectedRowData(row);
              //   setShowDrawerForm(true);
            }}
          >
            <ViewDocSvgIcon color={theme.palette.red.DEFAULT} />
          </UnstyledButton>
        </div>
      ),
      searchKey: "action",
      sortable: false,
    },
  ];
  return (
    <div>
      <div className="shadow-black-900/100 bg-transparent shadow-lg">
        <TableComponent
          data={
            Array.isArray(UserProfileData?.kycDocs)
              ? UserProfileData.kycDocs
              : UserProfileData?.kycDocs
                ? [UserProfileData.kycDocs]
                : []
          }
          columns={tableColumns}
          // onCurrentPageData={setCurrentPageData}
        />
      </div>
    </div>
  );
};

export default KycDoc;
