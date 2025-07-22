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

  const documentMapping = {
    aadhaarCardFrontImage: { name: "Aadhaar Card Front" },
    aadhaarCardBackImage: { name: "Aadhaar Card Back" },
    panCardImage: { name: "PAN Card" },
    shopImage: { name: "Shop Image" },
    businessProofImage: { name: "Business Proof" },
  } as const;

  type DocumentKey = keyof typeof documentMapping;

  const transformDocuments = (kycDocs: any) => {
    if (!kycDocs) return [];
    return Object.entries(kycDocs).map(([key, url]) => ({
      document: documentMapping[key as DocumentKey]?.name || key,
      documentNo: "",
      url: url,
    }));
  };

  const documents = transformDocuments(UserProfileData?.kycDocs);
  const tableColumns = [
    {
      key: "document",
      label: "Document Name",
      searchKey: "document",
      sortable: false,
    },
    // {
    //   key: "documentNo",
    //   label: "Document No",
    //   searchKey: "documentNo",
    //   sortable: false,
    // },
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
            onClick={(e) => {
              e.preventDefault();
              const fileUrl = row.url.startsWith("C:\\")
                ? `file:///${row.url.replace(/\\/g, "/")}`
                : row.url;
              window.open(fileUrl, "_blank");
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

  console.log(UserProfileData?.kycDocs);
  return (
    <div>
      <div className="shadow-black-900/100 bg-transparent shadow-lg">
        <TableComponent
          data={
            documents
            // Array.isArray(UserProfileData?.kycDocs)
            //   ? UserProfileData.kycDocs
            //   : UserProfileData?.kycDocs
            //     ? [UserProfileData.kycDocs]
            //     : []
          }
          columns={tableColumns}
        />
      </div>
    </div>
  );
};

export default KycDoc;
