import TableComponent from "@/components/Molecules/TableComponent";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/system";
import TextComponent from "@/components/Atoms/TextComponent";
import {
  PayoutBankDetails,
  PayoutSendBeneficiaryProps,
} from "@/Common/interface";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";
import { handleCustomError } from "@/Utils/handleCustomError";
import { UnstyledButton } from "@mantine/core";
import {
  BackSvgIcon,
  FilterSvgIcon,
  PlusSvgIcon,
  TrashSvgIcon,
} from "@/assets/svg";
import { Formik } from "formik";
import * as Yup from "yup";
import Loader from "@/components/Atoms/Loader";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import PayoutFormModal from "./PayoutForm";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import { Payout_GetAll_Payout_BankDetails, Payout_Send } from "@/Services/api";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import PayoutBankDeleteModal from "@/components/Organism/PayoutBankDeleteModal";

const InfoTable = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const { payoutType } = location.state || {};

  const [showDrawerForm, setShowDrawerForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSeacrh, setIsSeacrh] = useState(false);
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const [selectedRowData, setSelectedRowData] = useState<
    PayoutBankDetails | []
  >([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isBankList, setIsBankList] = useState<PayoutBankDetails | []>([]);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const isFetchingRef = useRef<boolean>(false);

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const GetPayoutDataSubmit = async () => {
    try {
      setIsLoading(true);
      // setCurrentPage(values.page);
      // setItemsPerPage(values.size);

      const response = await Payout_GetAll_Payout_BankDetails();
      if (response?.status === 200) {
        setIsBankList(response?.data?.data?.content);
      } else {
        showErrorNotification(response?.data?.message);
      }
    } catch (error) {
      await handleCustomError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isFetchingRef.current) {
      isFetchingRef.current = true;
      GetPayoutDataSubmit();
    }
  }, []);

  const tableColumns = [
    {
      key: "bankHolderName",
      label: "Holder Name",
      searchKey: "bankHolderName",
      sortable: true,
    },
    {
      key: "bankName",
      label: "Bank Name",
      searchKey: "bankName",
      sortable: true,
    },
    {
      key: "accountNumber",
      label: "Account No",
      searchKey: "accountNumber",
      sortable: false,
    },
    {
      key: "ifscCode",
      label: "IFSC Code",
      searchKey: "ifscCode",
      sortable: false,
    },
    {
      key: "transfer",
      label: "Transfer",
      searchKey: "transfer",
      sortable: false,
      render: (_row: PayoutBankDetails, _rowIndex: number, values: any) => {
        const validationSchema = Yup.object().shape({
          paymentMode: Yup.string().required("Required"),
          amount: Yup.number()
            .required("Required")
            .positive("Amount must be positive")
            .min(1, "Minimum amount is 1"),
        });

        const initialValues: PayoutSendBeneficiaryProps = {
          retailerId: loginData?.hierarchyId || "",
          accountNumber: values?.accountNumber || "",
          ifscCode: values?.ifscCode || "",
          amount: 0,
          beneficiaryName: values?.bankHolderName || "",
          paymentMode: "",
          subProductId: payoutType,
          callbackurl: "https://uat.decipay.in/enterprises/api/payout/callback",
        };
        const handleSubmit = async (values: PayoutSendBeneficiaryProps) => {
          try {
            setIsLoading(true);
            const payload = {
              retailerId: values.retailerId,
              accountNumber: values.accountNumber,
              ifscCode: values.ifscCode,
              amount: Number(values.amount),
              beneficiaryName: values.beneficiaryName,
              paymentMode: values.paymentMode,
              subProductId: values.subProductId,
              callbackurl: values.callbackurl,
            };

            const response = await Payout_Send(payload);
            if (response?.status === 200) {
              showSuccessNotification("Transfer initiated successfully");
              return true;
            } else {
              showErrorNotification(
                response?.data?.message || "Transfer failed"
              );
              return false;
            }
          } catch (error) {
            await handleCustomError(error);
            return false;
          } finally {
            setIsLoading(false);
          }
        };

        return (
          <Formik<PayoutSendBeneficiaryProps>
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({
              values,
              handleChange,
              handleSubmit,
              errors,
              touched,
              setFieldValue,
            }) => (
              <div className="flex items-center gap-2 justify-center">
                <div className="w-24">
                  <DropdownComponent
                    data={[
                      { value: "IMPS", label: "IMPS" },
                      { value: "NEFT", label: "NEFT" },
                    ]}
                    value={values.paymentMode}
                    onChange={(value) => setFieldValue("paymentMode", value)}
                    error={
                      touched.paymentMode && errors.paymentMode
                        ? errors.paymentMode
                        : ""
                    }
                    className="w-max"
                  />
                </div>
                <div className="w-32">
                  <TextInputComponent
                    placeholder={"Enter"}
                    value={values.amount}
                    onChange={handleChange("amount")}
                    error={touched.amount && errors.amount ? errors.amount : ""}
                    className="w-max"
                  />
                </div>
                <ButtonComponent
                  title="Transfer"
                  variant="filled"
                  onClick={() => {
                    handleSubmit();
                  }}
                  radius={5}
                  width={120}
                />
              </div>
            )}
          </Formik>
        );
      },
    },
    {
      key: "isVerified",
      label: "Verified",
      searchKey: "isVerified",
      sortable: false,
      render: (row: PayoutBankDetails) => (
        <div>
          <TextComponent
            fontSize={14}
            fontWeight={500}
            color={theme.palette.red.DEFAULT}
          >
            {row?.isVerified ? "Verified" : "Not Verified"}
          </TextComponent>
        </div>
      ),
    },
    {
      key: "action",
      label: "Delete",
      render: (row: PayoutBankDetails) => (
        <div>
          <UnstyledButton
            onClick={() => {
              setIsDeleteModal(true);
              setSelectedRowData(row);
            }}
          >
            <TrashSvgIcon color={theme.palette.gray.DEFAULT} />
          </UnstyledButton>
        </div>
      ),
      searchKey: "action",
      sortable: false,
    },
  ];

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchWithValues = (columnKey: string, value: string) => {
    try {
      const newSearchValues = {
        ...searchValues,
        [columnKey]: value,
      };
      setSearchValues(newSearchValues);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsLoading(true);
        Payout_GetAll_Payout_BankDetails()
          .then((response) => {
            if (response?.status === 200) {
              setIsBankList(response?.data?.data?.content);
            } else {
              showErrorNotification(response?.data?.message);
              setIsBankList([]);
            }
          })
          .catch((error) => {
            handleCustomError(error);
            setIsBankList([]);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }, 900);
    } catch (error) {
      console.error("Search error:", error);
    }
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
            Payout
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
          {isBankList && isBankList.length < 50 && (
            <div className="flex items-center justify-end">
              <ButtonComponent
                title="ADD BANK"
                variant="filled"
                onClick={() => setShowDrawerForm(true)}
                radius={4}
                width={150}
                leftIcon={
                  <PlusSvgIcon color={theme.palette.background.paper} />
                }
              />
            </div>
          )}
        </div>
        <div className="mt-6">
          <TableComponent
            data={Array.isArray(isBankList) ? isBankList : [isBankList]}
            columns={tableColumns}
            showSearch={isSeacrh}
            keyField="id"
            // page={currentPage}
            // size={itemsPerPage}
            onSelectRow={(row) => setSelectedRowData(row)}
            onSearch={(columnKey, value) =>
              handleSearchWithValues(columnKey, value)
            }
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
        <PayoutFormModal
          opened={showDrawerForm}
          onClose={() => {
            setShowDrawerForm(false);
            GetPayoutDataSubmit();
          }}
          rowData={selectedRowData}
        />
        <PayoutBankDeleteModal
          opened={isDeleteModal}
          onClose={() => {
            setIsDeleteModal(false);
            setSelectedRowData([]);
            GetPayoutDataSubmit();
          }}
          rowData={selectedRowData}
        />
      </div>
    </>
  );
};

export default InfoTable;
