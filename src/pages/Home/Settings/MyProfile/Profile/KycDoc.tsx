import { OpenEyeSvgIcon } from "@/assets/svg";
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

  const resolveFileUrl = (url: string): string | null => {
    if (!url) return null;

    // If already a valid HTTPS URL
    if (/^https:\/\/.+/i.test(url)) {
      return url;
    }

    // Invalid or non-HTTPS URL
    return null;
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
      key: "url",
      label: "View Document",
      render: (row: string) => {
        const fileUrl = resolveFileUrl(row);

        const isValidHttpsUrl =
          typeof fileUrl === "string" && /^https:\/\/.+/i.test(fileUrl);

        return (
          <div className="flex w-max items-center justify-between gap-2 justify-self-center">
            {isValidHttpsUrl ? (
              <UnstyledButton
                onClick={(e) => {
                  e.preventDefault();
                  window.open(fileUrl, "_blank");
                }}
              >
                <OpenEyeSvgIcon color={theme.palette.red.DEFAULT} />
              </UnstyledButton>
            ) : (
              <span className="text-gray-400 text-xs">Invalid or Unreachable URL</span>
            )}
          </div>
        );
      },
      sortable: false,
    }
  ];

  return (
    <div>
      <TableComponent
        data={
          documents && Array.isArray(documents) ? documents : []
        }
        columns={tableColumns}
        enablePagination={false}
      />
    </div>
  );
};

export default KycDoc;
