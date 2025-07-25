import TableComponent from "@/components/Molecules/TableComponent";
import React, { useRef, useState } from "react";
import { useTheme } from "@mui/system";
import TextComponent from "@/components/Atoms/TextComponent";
import { PayOutInfoData, WalletParams } from "@/Common/interface";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";
import { handleCustomError } from "@/Utils/handleCustomError";
import { UnstyledButton } from "@mantine/core";
import { BackSvgIcon, FilterSvgIcon, PlusSvgIcon } from "@/assets/svg";
import { Formik } from "formik";
import * as Yup from "yup";
import Loader from "@/components/Atoms/Loader";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import PayoutFormModal from "./PayoutForm";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";

const InfoTable = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [showDrawerForm, setShowDrawerForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSeacrh, setIsSeacrh] = useState(false);
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const [selectedRowData, setSelectedRowData] = useState<PayOutInfoData | []>(
    []
  );
  //   const [isInfoList, setIsInfoList] = useState<PayOutInfoData | []>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isInfoList, setIsInfoList] = useState<PayOutInfoData | []>([
    {
      id: 1,
      createdOn: "2025-07-24T10:30:00",
      transactionId: "ICICI001",
      refNo: "123456789012",
      balanceBefore: 50000,
      amount: 10000,
      balanceAfter: 40000,
      walletType: "SAVINGS",
      bankName: "ICICI Bank",
      accountName: "John Doe",
      ifscCode: "ICIC0001234",
    },
    {
      id: 2,
      createdOn: "2025-07-24T11:45:00",
      transactionId: "HDFC002",
      refNo: "987654321098",
      balanceBefore: 75000,
      amount: 15000,
      balanceAfter: 60000,
      walletType: "CURRENT",
      bankName: "HDFC Bank",
      accountName: "Jane Smith",
      ifscCode: "HDFC0005678",
    },
  ]);

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const GetPayoutDataSubmit = async (values: WalletParams) => {
    try {
      setIsLoading(true);
      setCurrentPage(values.page);
      setItemsPerPage(values.size);
      let bodyRequest = {
        fromDate: "",
        toDate: "",
        hierarchyId: values.hierarchyId || loginData?.hierarchyId,
        walletType: values.walletType,
        subProductName: values.subProductName,
        status: values.status,
        page: values.page,
        size: values.size,
      };
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
      key: "createdOn",
      label: "Account Name",
      searchKey: "createdOn",
      sortable: false,
      type: "date",
    },
    {
      key: "transactionId",
      label: "Bank Name",
      searchKey: "transactionId",
      sortable: false,
    },
    {
      key: "refNo",
      label: "Account No",
      searchKey: "refNo",
      sortable: true,
    },
    {
      key: "balanceBefore",
      label: "IFSC Code",
      searchKey: "balanceBefore",
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
      key: "balanceAfter",
      label: "Verified",
      searchKey: "balanceAfter",
      sortable: false,
    },
    {
      key: "walletType",
      label: "Delete",
      searchKey: "walletType",
      sortable: false,
    },
  ];

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchWithValues = (
    columnKey: string,
    value: string,
    values: WalletParams
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

      if (values.fromDate && values.toDate) {
        const bodyRequest = {
          fromDate: "",
          toDate: "",
          hierarchyId: values.hierarchyId || loginData?.hierarchyId,
          walletType: values.walletType,
          subProductName: values.subProductName,
          status: values.status,
          page: values.page,
          size: values.size,
        };

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setIsLoading(true);
          //   Wallet_Report(newSearchValues, bodyRequest)
          //     .then((response) => {
          //       if (response?.status === 200) {
          //         setIsInfoList(response?.data?.data?.content);
          //       } else {
          //         showErrorNotification(response?.data?.message);
          //         setIsInfoList([]);
          //       }
          //     })
          //     .catch((error) => {
          //       handleCustomError(error);
          //       setIsInfoList([]);
          //     })
          //     .finally(() => {
          //       setIsLoading(false);
          //     });
        }, 900);
      }
    } catch (error) {
      handleCustomError(error);
    }
  };

  const validationSchema = Yup.object({
    walletType: Yup.string().required("Required"),
    subProductName: Yup.string().required("Required"),
    status: Yup.string().required("Required"),
  });

  const initialValues: WalletParams = {
    hierarchyId: loginData?.hierarchyId,
    walletType: "",
    fromDate: "",
    toDate: "",
    subProductName: "",
    status: "",
    page: currentPage,
    size: itemsPerPage,
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="w-full 320px:mt-12 md:mt-0">
        <div className="mb-6 flex items-center gap-6 justify-start">
          <UnstyledButton
            onClick={() => {
              navigate(`/products/payoutScreen`);
            }}
          >
            <BackSvgIcon color={theme.palette.red.DEFAULT} />
          </UnstyledButton>
          <TextComponent
            fontSize={28}
            fontWeight={600}
            color={theme.palette.red.DEFAULT}
          >
            Wallet Report
          </TextComponent>
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
              title=" ADD BANK"
              variant="filled"
              onClick={() => setShowDrawerForm(true)}
              radius={4}
              width={150}
              leftIcon={
                <PlusSvgIcon color={theme.palette.background.default} />
              }
            />
          </div>
        </div>
        <Formik<WalletParams>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={GetPayoutDataSubmit}
        >
          {({ values, handleSubmit, errors, touched, setFieldValue }) => {
            return (
              <>
                <div className="mt-6">
                  <TableComponent
                    data={Array.isArray(isInfoList) ? isInfoList : [isInfoList]}
                    columns={tableColumns}
                    showSearch={isSeacrh}
                    page={currentPage}
                    size={itemsPerPage}
                    onSelectRow={(row) => setSelectedRowData(row)}
                    onSearch={(columnKey, value) =>
                      handleSearchWithValues(columnKey, value, values)
                    }
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      const updatedValues = {
                        ...values,
                        page,
                        size: itemsPerPage,
                      };
                      GetPayoutDataSubmit(updatedValues);
                    }}
                    onPageSizeChange={(size) => {
                      setItemsPerPage(size);
                      setCurrentPage(1);
                      const updatedValues = {
                        ...values,
                        page: 1,
                        size,
                      };
                      GetPayoutDataSubmit(updatedValues);
                    }}
                  />
                </div>
                <PayoutFormModal
                  opened={showDrawerForm}
                  onClose={() => setShowDrawerForm(false)}
                  rowData={selectedRowData}
                />
              </>
            );
          }}
        </Formik>
      </div>
    </>
  );
};

export default InfoTable;
