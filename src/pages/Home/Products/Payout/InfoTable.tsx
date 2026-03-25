import TableComponent from "@/components/Molecules/TableComponent";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/system";
import TextComponent from "@/components/Atoms/TextComponent";
import {
  PayoutBankDetails,
  PayoutBankDetailsParams,
  PayoutSendBeneficiaryProps,
  subProductObjType,
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
import { Edit_Beneficiary_Bank_Details, Payout_GetAll_Payout_BankDetails, Payout_Send } from "@/Services/api";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import PayoutBankDeleteModal from "@/components/Organism/PayoutBankDeleteModal";
import { useBankVerification } from "@/Utils/Verification";
import { Refresh } from "@mui/icons-material";
import { useTransactionCooldown } from "@/Utils/CustomHooks/useTransactionCooldown";

interface LocationState {
  payoutType?: subProductObjType;
}

const InfoTable = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const { payoutType } = location.state as LocationState;

  const [showDrawerForm, setShowDrawerForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<
    PayoutBankDetails | []
  >([]);
  const [isBankList, setIsBankList] = useState<PayoutBankDetails | []>([]);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const { verify: verifyBank } = useBankVerification();

  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isSeacrh, setIsSeacrh] = useState(false);
  const apiResponses = useSelector(
    (state: RootState) => state?.apiResponse?.responses
  );
  const { checkDuplicate, store } = useTransactionCooldown("PAYOUT");

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const GetPayoutDataSubmit = async (pageNum = 1, pageSize = 10, filters: Record<string, any> = {}) => {
    const reqParams: PayoutBankDetailsParams = {
      page: pageNum - 1, // API is 0-indexed
      size: pageSize,
      ...filters, // dynamic filters
    };

    try {
      setIsLoading(true);
      const response = await Payout_GetAll_Payout_BankDetails(reqParams);
      if (response?.status === 200) {
        setIsBankList(response?.data?.data?.content);
        setTotalRecords(response?.data?.data?.totalElements || 0);
      } else {
        showErrorNotification(response?.data?.message);
        setIsBankList([]);
        setTotalRecords(0);
      }
    } catch (error) {
      await handleCustomError(error);
      setIsBankList([]);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyBank = async (row: PayoutBankDetails) => {
    try {
      setIsLoading(true);

      // Step 1: Call 3rd party verification
      const response = await verifyBank({
        id_number: row.accountNumber,
        ifsc: row.ifscCode,
        ifsc_details: true,
      });

      if (response?.data?.data) {
        const verifiedData = response?.data?.data;

        // Step 2: Update state (UI)
        setIsBankList((prev: PayoutBankDetails[]) =>
          prev.map((item) =>
            item.id === row.id
              ? {
                ...item,
                isVerified: true,
                ...(verifiedData?.ifsc_details?.bank_name && {
                  bankName: verifiedData?.ifsc_details.bank_name,
                }),
                ...(verifiedData?.full_name && {
                  bankHolderName: verifiedData?.full_name,
                }),
              }
              : item
          )
        );

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
    {
      key: "bankHolderName",
      label: "Holder Name",
      searchKey: "bankHolderName",
      // sortable: true,
    },
    {
      key: "bankName",
      label: "Bank Name",
      searchKey: "bankName",
      // sortable: true,
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
          amount: "0",
          beneficiaryName: values?.bankHolderName || "",
          paymentMode: "IMPS",
          subProductId: payoutType?.subProductId || "",
          schemeCode: payoutType?.schemeCode || ""
          // callbackurl: "https://uat.decipay.in/enterprises/api/payout/callback",
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
              schemeCode: values.schemeCode,

              // callbackurl: values.callbackurl,
            };

            if (checkDuplicate(values.accountNumber, Number(values.amount))) {
              showErrorNotification(
                "You cannot repeat the same transaction within 2 minutes. Please try a different amount or try again shortly."
              );
              return;
            }

            const response = await Payout_Send(payload);
            const status = response?.data?.statusCode
            if (status == 200 || status == "202") {
              showSuccessNotification(response?.data?.message);
              store(values.accountNumber, Number(values.amount));
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
              // handleChange,
              handleSubmit,
              errors,
              touched,
              setFieldValue,
            }) => (
              <div className="flex items-center gap-2 justify-center">
                <div className="w-40 h-20 flex justify-center items-center">
                  <DropdownComponent
                    label="Transaction Type"
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
                <div className="w-32 h-20 flex justify-center items-center">
                  <TextInputComponent
                    placeholder={"Enter Amount"}
                    value={values.amount ? values.amount : 0}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const val = e.target.value;

                      // 🧠 If current value is 0 and user types a number → replace it
                      if (values.amount === 0 && /^\d$/.test(val)) {
                        setFieldValue("amount", Number(val));
                      }
                      // ✅ Otherwise, handle normally
                      else if (/^\d*$/.test(val)) {
                        setFieldValue("amount", Number(val || 0));
                      }
                    }}
                    error={touched.amount && errors.amount ? errors.amount : ""}
                    className="w-max"
                    maxLength={8}
                  />
                </div>
                <ButtonComponent
                  height="40px"
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
      disableSearch: true
    },
    {
      key: "isVerified",
      label: "Verified",
      searchKey: "isVerified",
      sortable: false,
      render: (_value: any, _index: number, row: PayoutBankDetails) => (
        <div className="flex items-center gap-2">
          {row?.isVerified ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "#28a745",
                fontSize: "18px",
                fontWeight: 500,
              }}
            >
              ✅ Verified
            </div>
          ) : (
            <ButtonComponent
              height={40}
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
      disableSearch: true
    },
  ];

  const handleSearchWithValues = (columnKey: string, value: string) => {
    const newSearchValues = { ...searchValues };

    if (value) {
      newSearchValues[columnKey] = value;
    } else {
      delete newSearchValues[columnKey];
    }

    setSearchValues(newSearchValues);
    setPage(1); // Reset to first page when search changes
  };

  const handleRefresh = () => {
    setIsSeacrh(false)
    setSearchValues({});
    setPage(1)
    setSize(10)
  }

  useEffect(() => {
    GetPayoutDataSubmit(page, size, searchValues);
  }, [page, size, searchValues])

  useEffect(() => {
    // if no payoutType, redirect back
    if (!payoutType) {
      navigate("/products/payoutScreen", { replace: true });
    }
  }, [payoutType]);

  return (
    <>
      {isLoading && <Loader />}
      <div className="w-full 320px:mt-12 md:mt-0">

        {/* Back Button & Heading */}
        <div className="mb-6 flex items-center gap-6 justify-start">
          {/* Back Button */}
          <UnstyledButton
            onClick={() => {
              navigate(`/products/payoutScreen`);
            }}
          >
            <BackSvgIcon color={theme.palette.red.DEFAULT} />
          </UnstyledButton>

          {/* Heading*/}
          <TextComponent
            fontSize={28}
            fontWeight={600}
            color={theme.palette.red.DEFAULT}
          >
            Payout
          </TextComponent>
        </div>

        <div className="flex items-center justify-end gap-3">
          {/* Refresh */}
          <div className="flex w-max items-center justify-center gap-2 rounded-lg border-2 border-midNeutral bg-whiteColor px-2 py-[6px]">
            <UnstyledButton
              onClick={handleRefresh}
              className="flex items-center justify-center gap-2"
            >
              <Refresh color="error" />
            </UnstyledButton>
          </div>

          {/* Filter */}
          <div className="flex w-max items-center justify-center gap-2 rounded-lg border-2 border-midNeutral bg-whiteColor px-2 py-[6px]">
            <UnstyledButton
              onClick={() => setIsSeacrh(!isSeacrh)}
              className="flex items-center justify-center gap-2"
            >
              <FilterSvgIcon color={theme.palette.red.DEFAULT} />
              <TextComponent
                fontSize={16}
                fontWeight={400}
                color={theme.palette.red.DEFAULT}
                align="center"
              >
                Filter
              </TextComponent>
            </UnstyledButton>
          </div>

          {/* Add Bank Button */}
          <ButtonComponent
            title="ADD BANK"
            variant="filled"
            onClick={() => setShowDrawerForm(true)}
            radius={4}
            width={150}
            leftIcon={<PlusSvgIcon color={theme.palette.background.paper} />}
          />
        </div>

        {/* ////////////////////////////// Table ///////////////////////////////// */}
        <div className="mt-6">
          <TableComponent
            keyField="id"
            data={Array.isArray(isBankList) ? isBankList : [isBankList]}
            columns={tableColumns}
            showSearch={isSeacrh}
            onSelectRow={(row) => setSelectedRowData(row)}
            onSearch={(columnKey, value) =>
              handleSearchWithValues(columnKey, value)
            }
            page={page}
            size={size}
            onPageChange={setPage}
            onPageSizeChange={(newSize) => {
              setSize(newSize);
              setPage(1); // reset to first page when size changes
            }}
            serverSide={true}
            totalRecords={totalRecords}
          />
        </div>


        {/* ////////////////////////////// Modals ///////////////////////////////// */}
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
      </div >
    </>
  );
};

export default InfoTable;
