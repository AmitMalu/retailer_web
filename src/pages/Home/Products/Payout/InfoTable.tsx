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
import ConfirmDialog from "@/components/Atoms/ConfirmDialog";

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

  // --- Transfer confirmation dialog ---
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    payload: PayoutSendBeneficiaryProps | null;
    submitFn: (() => void) | null;
  }>({ open: false, payload: null, submitFn: null });

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

  const selectedSubProduct = loginData?.products
    ?.flatMap((product: any) => product.subProducts)
    ?.find(
      (subProduct: any) => subProduct.subProductId === payoutType?.subProductId
    );

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
      width: 240,
    },
    {
      key: "bankName",
      label: "Bank Name",
      searchKey: "bankName",
      // sortable: true,
      width: 200,
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
            .min(1, "Minimum amount is 1")
            .test(
              "max-amount",
              selectedSubProduct?.maxAmount
                ? `Max Limit ${selectedSubProduct.maxAmount}`
                : "",
              function (value) {
                if (!value || !selectedSubProduct?.maxAmount) return true;
                return value <= selectedSubProduct.maxAmount;
              }
            ),
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
        const handleSubmit = async (values: PayoutSendBeneficiaryProps, bag: any) => {
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
              bag?.resetForm();
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
              validateForm,
              setTouched,
            }) => (
              <div className="flex items-center gap-2 justify-center">
                <div className="w-32 h-10 flex justify-center items-center">
                  <DropdownComponent
                    pY={6}
                    pX={6}
                    labelFontSize={14}
                    inputFontSize={12}
                    menuFontSize={12}
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
                <div className="w-32 h-10 flex justify-center items-center">
                  <TextInputComponent
                    labelFontSize={10}
                    size="small"
                    placeholder={"Enter Amount"}
                    value={values.amount ? values.amount : 0}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const val = e.target.value;

                      // current value is 0 and user types a number → replace it
                      if (values.amount === 0 && /^\d$/.test(val)) {
                        setFieldValue("amount", Number(val));
                      }
                      // Otherwise, handle normally
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
                  fontSize={14}
                  height={28}
                  title="Transfer"
                  variant="filled"
                  onClick={async () => {
                    // Touch all fields so errors show up
                    await setTouched({ paymentMode: true, amount: true });
                    const errors = await validateForm();
                    if (Object.keys(errors).length > 0) return; // validation failed — stop
                    setConfirmModal({
                      open: true,
                      payload: values,
                      submitFn: handleSubmit,
                    });
                  }}
                  radius={5}
                  width={90}
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
        <div
          className="flex items-center justify-center"
        >
          {row?.isVerified ? (
            <div
              style={{
                color: "#28a745",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              <span>✅</span>
              <span>Verified</span>
            </div>
          ) : (
            <ButtonComponent
              fontSize={14}
              height={28}
              title="Verify"
              variant="outline"
              radius={5}
              width={80}
              onClick={() => handleVerifyBank(row)}
            />
          )}
        </div>
      ),
      disableSearch: true,
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
            <BackSvgIcon color={theme.palette.primary.main} />
          </UnstyledButton>

          {/* Heading*/}
          <TextComponent
            fontSize={28}
            fontWeight={600}
            color={theme.palette.primary.main}
          >
            Payout
          </TextComponent>
        </div>

        <div className="flex items-center justify-end gap-3">
          {/* Refresh */}
          <div className="flex w-max items-center justify-center gap-2 rounded-lg border-2 border-divider bg-background-paper px-2 py-[6px]">
            <UnstyledButton
              onClick={handleRefresh}
              className="flex items-center justify-center gap-2"
            >
              <Refresh color="primary" />
            </UnstyledButton>
          </div>

          {/* Filter */}
          <div className="flex w-max items-center justify-center gap-2 rounded-lg border-2 border-divider bg-background-paper px-2 py-[6px]">
            <UnstyledButton
              onClick={() => setIsSeacrh(!isSeacrh)}
              className="flex items-center justify-center gap-2"
            >
              <FilterSvgIcon color={theme.palette.primary.main} />
              <TextComponent
                fontSize={16}
                fontWeight={400}
                color={theme.palette.primary.main}
                align="center"
              >
                Filter
              </TextComponent>
            </UnstyledButton>
          </div>

          {/* Add Bank Button */}
          <ButtonComponent
            height={40}
            size="xs"
            fontSize={12}
            title="ADD BANK"
            variant="filled"
            onClick={() => setShowDrawerForm(true)}
            radius={2}
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
            withColumnBorders
            verticalSpacing="xs"
            horizontalSpacing="xs"
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

        {/* Transfer Confirmation Dialog */}
        <ConfirmDialog
          opened={confirmModal.open}
          onClose={() => setConfirmModal({ open: false, payload: null, submitFn: null })}
          onConfirm={() => {
            setConfirmModal((prev) => ({ ...prev, open: false }));
            confirmModal.submitFn?.();
          }}
        />
      </div >
    </>
  );
};

export default InfoTable;
