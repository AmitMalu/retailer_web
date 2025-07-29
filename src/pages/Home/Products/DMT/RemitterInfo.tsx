import { useTheme } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { RemitterInfoData } from "@/Common/interface";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";
import { handleCustomError } from "@/Utils/handleCustomError";
import Loader from "@/components/Atoms/Loader";
import { UnstyledButton } from "@mantine/core";
import {
  BackSvgIcon,
  EditSvgIcon,
  FilterSvgIcon,
  PlusSvgIcon,
  TrashSvgIcon,
} from "@/assets/svg";
import TextComponent from "@/components/Atoms/TextComponent";
import TableComponent from "@/components/Molecules/TableComponent";
import RemitterInfoEditModal from "@/components/Organism/DMT/RemitterINfoModal";
import AddBeneficiaryModal from "@/components/Organism/DMT/AddBeneficiaryModal";
import RemitterEkycModal from "@/components/Organism/DMT/RemitterEkycModal";

const RemitterInfo = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [showDrawerForm, setShowDrawerForm] = useState(false);
  const [showBeneficiaryDrawerForm, setShowBeneficiaryDrawerForm] =
    useState(false);
  const [showEkycDrawerForm, setShowEkycDrawerForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSeacrh, setIsSeacrh] = useState(false);
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const [selectedRowData, setSelectedRowData] = useState<RemitterInfoData | []>(
    []
  );
  //   const [isInfoList, setIsInfoList] = useState<RemitterInfoData | []>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isRemitterInfoList, setIsRemitterInfoList] = useState<
    RemitterInfoData | []
  >([]);

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const GetPayoutDataSubmit = async () => {
    try {
      setIsLoading(true);
      //   let bodyRequest = {
      //     fromDate: "",
      //     toDate: "",

      //     page: values.page,
      //     size: values.size,
      //   };
      //   const response = await Wallet_Report({}, bodyRequest);

      //   if (response?.status === 200) {
      //     setIsInfoList(response?.data?.data?.content);
      //     showSuccessNotification(response?.data?.message);
      //   } else {
      //     showErrorNotification(response?.data?.message);
      //   }
    } catch (error) {
      await handleCustomError(error);
    } finally {
      setIsLoading(false);
    }
  };
  const tableColumns = [
    {
      key: "beneficiaryName",
      label: "Beneficiary Name",
      searchKey: "beneficiaryName",
      sortable: false,
    },
    {
      key: "bankName",
      label: "Bank",
      searchKey: "bankName",
      sortable: false,
    },
    {
      key: "accountNumber",
      label: "Account No",
      searchKey: "accountNumber",
      sortable: true,
    },
    {
      key: "ifscCode",
      label: "IFSC Code",
      searchKey: "ifscCode",
      sortable: false,
    },
    {
      key: "amount",
      label: "Transfer",
      searchKey: "amount",
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2 justify-center">
          <div className="w-[20%]  ">
            <DropdownComponent
              data={[
                { value: "PREPAID", label: "PREPAID" },
                { value: "POSTPAID", label: "POSTPAID" },
              ]}
              value={""}
              onChange={(value) => {}}
              className="w-max"
            />
          </div>
          <div className="w-[20%]  ">
            <DropdownComponent
              data={[
                { value: "IMPS", label: "IMPS" },
                { value: "NEFT", label: "NEFT" },
              ]}
              value={""}
              onChange={(value) => {}}
              className="w-max"
            />
          </div>
          <div className="w-[30%]  ">
            <TextInputComponent
              value={""}
              onChange={() => {}}
              type="number"
              className="w-max"
            />
          </div>
          <div className="flex w-max ">
            <ButtonComponent
              title={"TRANSFER"}
              variant="filled"
              onClick={() => {}}
              disabled={isLoading}
              radius={10}
            />
          </div>
        </div>
      ),
    },
    {
      key: "verified",
      label: "Verified",
      searchKey: "verified",
      sortable: false,
    },
    {
      key: "action",
      label: "Action",
      render: (row: any) => (
        <div className="flex w-max items-center justify-between gap-2 justify-self-center">
          <UnstyledButton
            onClick={() => {
              setSelectedRowData(row);
            }}
          >
            <TrashSvgIcon color={theme.palette.error.main} />
          </UnstyledButton>
        </div>
      ),
    },
  ];

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchWithValues = (
    columnKey: string,
    value: string
    // values: WalletParams
  ) => {
    try {
      const column = tableColumns.find((col) => col.key === columnKey);
      if (!column) return;

      const searchKey = column.searchKey || column.key;
      const newSearchValues = { ...searchValues };

      if (value) {
        newSearchValues[searchKey] = value;
      } else {
        delete newSearchValues[searchKey];
      }

      setSearchValues(newSearchValues);

      //   if (values.fromDate && values.toDate) {
      //     const bodyRequest = {
      //       fromDate: "",
      //       toDate: "",
      //       hierarchyId: values.hierarchyId || loginData?.hierarchyId,
      //       walletType: values.walletType,
      //       subProductName: values.subProductName,
      //       status: values.status,
      //       page: values.page,
      //       size: values.size,
      //     };

      //     if (timeoutRef.current) {
      //       clearTimeout(timeoutRef.current);
      //     }

      //     timeoutRef.current = setTimeout(() => {
      //       setIsLoading(true);
      //         Wallet_Report(newSearchValues, bodyRequest)
      //           .then((response) => {
      //             if (response?.status === 200) {
      //               setIsInfoList(response?.data?.data?.content);
      //             } else {
      //               showErrorNotification(response?.data?.message);
      //               setIsInfoList([]);
      //             }
      //           })
      //           .catch((error) => {
      //             handleCustomError(error);
      //             setIsInfoList([]);
      //           })
      //           .finally(() => {
      //             setIsLoading(false);
      //           });
      //     }, 900);
      //   }
    } catch (error) {
      handleCustomError(error);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="w-full 320px:mt-12 md:mt-0">
        <div className="mb-6 flex items-center gap-6 justify-start">
          <UnstyledButton
            onClick={() => {
              navigate(`/products/dmt`);
            }}
          >
            <BackSvgIcon color={theme.palette.red.DEFAULT} />
          </UnstyledButton>
          <TextComponent
            fontSize={28}
            fontWeight={600}
            color={theme.palette.red.DEFAULT}
          >
            Mudra Remit
          </TextComponent>
        </div>

        <div className="border-2 border-red-light rounded-lg mb-6 ">
          <div className="flex p-2 items-center justify-between w-full border-b-2 border-b-red-light">
            <TextComponent
              fontSize={24}
              fontWeight={500}
              color={theme.palette.background.default}
            >
              Remitter Info
            </TextComponent>
            <div className="flex items-center justify-end">
              <ButtonComponent
                title="EDIT"
                variant="filled"
                onClick={() => setShowDrawerForm(true)}
                radius={4}
                width={100}
                rightIcon={
                  <EditSvgIcon color={theme.palette.background.paper} />
                }
              />
            </div>
          </div>
          <div className="flex p-2 items-center justify-evenly w-full gap-4">
            <TextComponent
              fontSize={20}
              fontWeight={500}
              color={theme.palette.background.default}
            >
              Name: ABC
            </TextComponent>
            <TextComponent
              fontSize={20}
              fontWeight={500}
              color={theme.palette.background.default}
            >
              Mobile NO: 1234567890
            </TextComponent>
            <TextComponent
              fontSize={20}
              fontWeight={500}
              color={theme.palette.background.default}
            >
              Current Available Limit: 1000
            </TextComponent>
          </div>
        </div>

        <div className="flex items-center justify-end gap-6">
          <div className="border-1 flex w-max items-center justify-center justify-self-end rounded-md border-red-light bg-red-light px-2 py-1">
            <UnstyledButton
              onClick={() => setIsSeacrh(!isSeacrh)}
              className="flex flex-row items-center justify-center gap-3 text-center disabled:opacity-30"
            >
              <FilterSvgIcon color={theme.palette.red.DEFAULT} />
              <TextComponent
                fontSize={18}
                fontWeight={400}
                color={theme.palette.red.DEFAULT}
                align="center"
              >
                Search
              </TextComponent>
            </UnstyledButton>
          </div>
          <div className="flex items-center justify-end">
            <ButtonComponent
              title="ADD BENEFICIARY"
              variant="filled"
              onClick={() => setShowBeneficiaryDrawerForm(true)}
              radius={4}
              width="auto"
              leftIcon={<PlusSvgIcon color={theme.palette.background.paper} />}
            />
          </div>
        </div>
        <div className="mt-6">
          <TableComponent
            data={
              Array.isArray(isRemitterInfoList)
                ? isRemitterInfoList
                : [isRemitterInfoList]
            }
            columns={tableColumns}
            showSearch={isSeacrh}
            page={currentPage}
            size={itemsPerPage}
            onSelectRow={(row) => setSelectedRowData(row)}
            // onSearch={(columnKey, value) =>
            //   handleSearchWithValues(columnKey, value, values)
            // }
            // onPageChange={(page) => {
            //   setCurrentPage(page);
            //   const updatedValues = {
            //     ...values,
            //     page,
            //     size: itemsPerPage,
            //   };
            //   GetPayoutDataSubmit(updatedValues);
            // }}
            // onPageSizeChange={(size) => {
            //   setItemsPerPage(size);
            //   setCurrentPage(1);
            //   const updatedValues = {
            //     ...values,
            //     page: 1,
            //     size,
            //   };
            //   GetPayoutDataSubmit(updatedValues);
            // }}
          />
        </div>
        {showDrawerForm && (
          <RemitterInfoEditModal
            opened={showDrawerForm}
            onClose={() => setShowDrawerForm(false)}
            rowData={selectedRowData}
          />
        )}
        {showBeneficiaryDrawerForm && (
          <AddBeneficiaryModal
            opened={showBeneficiaryDrawerForm}
            onClose={() => setShowBeneficiaryDrawerForm(false)}
            rowData={selectedRowData}
          />
        )}
        {showEkycDrawerForm && (
          <RemitterEkycModal
            opened={showEkycDrawerForm}
            onClose={() => setShowEkycDrawerForm(false)}
          />
        )}
      </div>
    </>
  );
};

export default RemitterInfo;
