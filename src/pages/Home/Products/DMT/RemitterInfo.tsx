import { BackSvgIcon, FilterSvgIcon, PlusSvgIcon, TrashSvgIcon } from "@/assets/svg";
import {
  TableColumn,
  VerifyDeleteBeneficiaryOtpPayload
} from "@/Common/interface";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import TableComponent from "@/components/Molecules/TableComponent";
import AddBeneficiaryModal from "@/components/Organism/DMT/AddBeneficiaryModal";
import DeleteBeneficiaryModal from "@/components/Organism/DMT/DeleteBeneficiaryModal";
import DmtTranOtpModal from "@/components/Organism/DMT/DmtTranOtpModal";
import EditRemitterModal from "@/components/Organism/DMT/EditRemitterModal";
import RemitterInfoHeader from "@/components/Organism/DMT/RemitterInfoHeader";
import { RootState } from "@/Redux/Store";
import { delete_beneficiary, Dmt_Transaction, Dmt_Tranx_Send_Otp, edit_beneficiary, Fetch_Beneficiaries, Remitter_details, Update_Remitter, Verify_Delete_Beneficiary_Otp } from "@/Services/api";
import { handleCustomError } from "@/Utils/handleCustomError";
import { decryptData } from "@/Utils/helper";
import { showErrorNotification, showSuccessNotification } from "@/Utils/notifications";
import { useBankVerification } from "@/Utils/Verification";
import { Drawer, UnstyledButton } from "@mantine/core";
import { Refresh } from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from 'yup'
import DMTTransactionReceipt from "./DMTTransactionReceipt";
import { useTransactionCooldown } from "@/Utils/CustomHooks/useTransactionCooldown";
import ConfirmDialog from "@/components/Atoms/ConfirmDialog";

const RemitterInfo = () => {

  const navigate = useNavigate();
  const theme = useTheme();
  const { subProductId } = useParams();
  const location = useLocation();
  const { mobileNumber, remitterReferenceKey } = location.state || {};
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isSeacrh, setIsSeacrh] = useState(false);
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [showAddBeneficiaryForm, setShowAddBeneficiaryForm] = useState(false);
  const [showEditRemitterForm, setShowEditRemitterForm] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpLength, setOtpLength] = useState<4 | 6>(4);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Record<string, any> | null>(null);
  const [deleteOtpData, setDeleteOtpData] = useState<any>(null);
  const [showDeleteOtpModal, setShowDeleteOtpModal] = useState(false);
  const [remitterDetails, setRemitterDetails] = useState<any>({});
  const { verify: verifyBank } = useBankVerification();
  const [tranxData, setTranxData] = useState<{
    retailerId?: string;
    subProductId?: string;
    mobile?: string;
    beneId?: string;
    txnType?: string;
    amount?: string;
    stateresp?: string;
    referenceId?: string;
    referenceKey?: string;
  }>({});

  // --- Transfer confirmation dialog ---
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    payload: any | null;
    submitFn: (() => void) | null;
  }>({ open: false, payload: null, submitFn: null });

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const { checkDuplicate, store } = useTransactionCooldown("DMT");


  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses.loginData)
    : null;

  // const schemeCode = loginData?.products
  //   ?.flatMap((product: any) => product.subProducts) // Flatten all subProducts into a single array
  //   ?.find((subProduct: any) => subProduct.subProductId === subProductId) // Find matching subProductId
  //   ?.schemeCode; // Get the schemeCode

  const selectedSubProduct = loginData?.products
    ?.flatMap((product: any) => product.subProducts)
    ?.find(
      (subProduct: any) => subProduct.subProductId === subProductId
    );

  const [receiptDrawerOpened, setReceiptDrawerOpened] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [receiptTxnType, setReceiptTxnType] = useState<string>("");


  const tableColumns: TableColumn[] = [
    // {
    //   key: "bene_id",
    //   label: "ID",
    //   searchKey: "bene_id",
    // },
    {
      key: "srNo",
      label: "ID",
      searchKey: "name",
    },
    {
      key: "name",
      label: "Beneficiary Name",
      searchKey: "name",
    },
    {
      key: "bankname",
      label: "Bank Name",
      searchKey: "bankname",
    },
    {
      key: "accno",
      label: "Account No",
      searchKey: "accno",
      sortable: false,
    },
    {
      key: "ifsc",
      label: "IFSC Code",
      searchKey: "ifsc",
      sortable: false,
    },
    {
      key: "transfer",
      label: "Transfer",
      searchKey: "transfer",
      sortable: false,
      render: (_row: any, _rowIndex: number, values: any) => {
        const validationSchema = Yup.object().shape({
          paymentMode: Yup.string().required("Payment Mode is Required"),
          amount: Yup.number()
            .required("Required")
            .positive("Amount must be positive")
            .min(100, "Min amount is 100")
            .test(
              "max-amount",
              selectedSubProduct?.maxAmount
                ? `Max Limit ${selectedSubProduct.maxAmount}`
                : "",
              function (value) {
                if (!value || !selectedSubProduct?.maxAmount) return true;
                return value <= selectedSubProduct.maxAmount;
              }
            )
        });

        const initialValues = {
          beneId: values.bene_id,
          accountNumber: values?.accountNumber || "",
          ifscCode: values?.ifscCode || "",
          amount: "0",
          beneficiaryName: values?.bankHolderName || "",
          paymentMode: "IMPS",
        };
        const handleSubmit = async (values: any, { resetForm }: any) => {
          if (!values.beneId) return

          try {
            setIsLoading(true);
            const payload = {
              retailerId: loginData.hierarchyId,
              subProductId: subProductId,
              mobile: mobileNumber,
              beneId: values.beneId,
              txnType: values.paymentMode,
              amount: String(values.amount),
              referenceKey: remitterReferenceKey
            };
            if (checkDuplicate(values.beneId, Number(values.amount))) {
              showErrorNotification(
                "You cannot repeat the same transaction within 2 minutes. Please try a different amount or try again shortly."
              );
              return;
            }
            const response = await Dmt_Tranx_Send_Otp(payload)
            const data = response?.data
            if (data?.statusCode == 200) {
              const responseCode = data?.data?.response_code;

              if (responseCode === 1) {
                // Paysprint: 4-digit OTP, referenceId and stateresp
                setTranxData({
                  ...payload,
                  stateresp: data?.data?.stateresp,
                  referenceId: data?.data?.referenceId,
                })
                setOtpLength(4);
                showSuccessNotification(data.message || "OTP Send Successfully")
                resetForm()
                setShowOtpModal(true)
              } else if (responseCode === 2) {
                // Instantpay: 6-digit OTP, referenceKey
                setTranxData({
                  ...payload,
                  referenceKey: data?.data?.referenceKey, // Store proper vendor key
                })
                setOtpLength(6);
                showSuccessNotification(data.message || "OTP Send Successfully")
                resetForm()
                setShowOtpModal(true)
              } else {
                showErrorNotification(data?.data?.message || data?.message || "Failed to Send OTP")
              }
            } else {
              showErrorNotification(data?.message || "Failed to Send OTP")
            }
          } catch (error) {
            await handleCustomError(error);
            return false;
          } finally {
            setIsLoading(false);
          }
        };

        return (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({
              values,
              handleSubmit,
              errors,
              touched,
              setFieldValue,
              validateForm,
              setTouched,
            }) => (
              <div className="flex items-center gap-2 h-14 justify-center">
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
                    className="w-max h-10"
                  />
                </div>
                <div className="w-32 h-20 flex justify-center items-center">
                  <TextInputComponent
                    placeholder={"Enter Amount"}
                    value={values.amount ? values.amount : 0}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const val = e.target.value;

                      // If current value is 0 and user types a number → replace it
                      if (Number(values.amount) === 0 && /^\d$/.test(val)) {
                        setFieldValue("amount", Number(val));
                      }
                      // Otherwise, handle normally
                      else if (/^\d*$/.test(val)) {
                        setFieldValue("amount", Number(val || 0));
                      }
                    }}
                    error={touched.amount && errors.amount ? errors.amount : ""}
                    className="w-max"
                    size="small"
                    maxLength={8}
                  />
                </div>
                <ButtonComponent
                  height="40px"
                  title="Transfer"
                  variant="filled"
                  onClick={async () => {
                    // handleSubmit();
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
      key: "verified",
      label: "Verified",
      searchKey: "verified",
      sortable: false,
      render: (_value: any, _index: number, row: any) => (
        <div className="flex items-center gap-2">
          {row?.verified === "1" ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "#28a745",
                fontSize: "18px",
                fontWeight: 500,
                width: "100px",
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
      render: (_value: any, _index: number, row: any) => (
        <div>
          <UnstyledButton
            onClick={() => {
              setSelectedRow(row);
              setIsDeleteModal(true);
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

  const handleVerifyBank = async (row: any) => {
    try {
      setIsLoading(true);

      // Step 1: Call 3rd party verification
      const response = await verifyBank({
        id_number: row.accno,
        ifsc: row.ifsc,
        ifsc_details: true,
      });

      if (response?.data?.data) {
        const verifiedData = response?.data?.data;
        toast.success(verifiedData?.full_name, {
          position: "top-center",
          autoClose: 6000,
          hideProgressBar: true,
        })
        // Step 2: Update state (UI)
        setBeneficiaries((prev: any) =>
          prev.map((item: any) =>
            item.bene_id === row.bene_id
              ? {
                ...item,
                verified: "1",
                ...(verifiedData?.ifsc_details?.bank_name && {
                  bankname: verifiedData?.ifsc_details.bank_name,
                }),
                ...(verifiedData?.full_name && {
                  name: verifiedData?.full_name,
                }),
              }
              : item
          )
        );

        // Step 3: Build payload for DB
        const payload = {
          beneId: row?.bene_id,
          mobileNumber: remitterDetails.mobile,
          bankname: verifiedData?.ifsc_details?.bank_name || row.bankname,
          name: verifiedData?.full_name || row.name,
          verified: "1",
          subProductId: subProductId
        };

        // Step 4: Call DB API to persist changes
        const dbResponse = await edit_beneficiary(payload);
        if (dbResponse?.data?.statusCode == 200) {
          showSuccessNotification("Bank verified & saved successfully");
        } else {
          showErrorNotification(dbResponse?.data?.message || "Failed to save bank verification");
        }
      }
    } catch (error: any) {
      console.error("Bank verification failed:", error?.message);
      handleCustomError(error || "Error in bank verification");
    } finally {
      setIsLoading(false);
    }
  };

  const getBeneficiariesList = async (pageNum = 1, pageSize = 10, filters: Record<string, any> = {}) => {
    const reqParams = {
      page: pageNum - 1, // API is 0-indexed
      size: pageSize,
      mobile: mobileNumber || "",
      subProductId: subProductId || "",
      ...filters, // dynamic filters
    };

    try {
      setIsLoading(true);
      const response = await Fetch_Beneficiaries(reqParams);
      if (response?.status === 200) {
        setBeneficiaries(response?.data?.data?.content);
        setTotalRecords(response?.data?.data?.totalElements || 0);
      } else {
        showErrorNotification(response?.data?.message);
        setBeneficiaries([]);
        setTotalRecords(0);
      }
    } catch (error) {
      await handleCustomError(error);
      setBeneficiaries([]);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Close modal function
  const handleCloseDeleteModal = () => {
    setIsDeleteModal(false);
    setSelectedRow(null);
    setTranxData({});
    // Clear OTP data when modal is closed
    setShowDeleteOtpModal(false);
    setDeleteOtpData(null);
  };

  const handleDeleteBeneficiary = async () => {
    if (!selectedRow) return;

    try {
      setIsLoading(true);

      const payload = {
        mobile: mobileNumber || "",
        bene_id: selectedRow?.bene_id,
        subProductId: subProductId || "",
      };

      const response = await delete_beneficiary(payload);

      if (response?.data?.statusCode == "200") {
        const responseCode = response?.data?.data?.response_code;

        if (responseCode === 1) {
          // Vendor 1: Direct delete success
          showSuccessNotification(response?.data?.message || "Beneficiary deleted successfully");
          handleCloseDeleteModal();
          await getBeneficiariesList(page, size, searchValues); // refresh with same filters
        } else if (responseCode === 2) {
          // Vendor 2: OTP verification required
          showSuccessNotification(response?.data?.message || "OTP sent for beneficiary deletion");
          // Store response data for OTP verification
          setDeleteOtpData({
            referenceKey: response?.data?.data?.referenceKey,
            bene_id: selectedRow?.bene_id,
            mobile: mobileNumber
          });
          setShowDeleteOtpModal(true);
        } else {
          // Any other response_code means error
          showErrorNotification(response?.data?.message || "Unable to delete beneficiary");
        }
      } else {
        // Non-200 status code means error
        showErrorNotification(response?.data?.message || "Unable to delete beneficiary");
      }

      // Close modal after success (for direct delete)
      if (response?.data?.data?.response_code === 1) {
        handleCloseDeleteModal();
      }
    } catch (error) {
      handleCustomError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete beneficiary OTP verification
  const handleDeleteOtpVerification = async (otp: string) => {
    if (!deleteOtpData) return;

    try {
      setIsLoading(true);

      const otpPayload: VerifyDeleteBeneficiaryOtpPayload = {
        mobile: deleteOtpData.mobile,
        bene_id: deleteOtpData.bene_id,
        otp: otp,
        referenceKey: deleteOtpData.referenceKey,
      };

      const response = await Verify_Delete_Beneficiary_Otp(otpPayload);

      if (response?.data?.statusCode == "200" && response?.data?.data?.statuscode == "TXN") {
        showSuccessNotification(response?.data?.message || "Beneficiary deleted successfully");
        // Clear all OTP data and close modals
        setShowDeleteOtpModal(false);
        setDeleteOtpData(null);
        handleCloseDeleteModal();
        await getBeneficiariesList(page, size, searchValues); // refresh list
      } else {
        showErrorNotification(response?.data?.message || "OTP verification failed");
      }
    } catch (error) {
      handleCustomError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemitterUpdate = async (values: any) => {
    try {
      setIsLoading(true);
      const payload = {
        mobile: values.mobileNumber,
        name: values.beneficiaryName,
        otp: values.otp
      };
      const response = await Update_Remitter(payload); // your API call
      if (response?.data?.statusCode == 200) {
        showSuccessNotification(response?.data?.message || 'Remitter updated successfully!');
        await fetchRemitterDetails(values.mobileNumber); // Refresh state
      } else {
        showErrorNotification(response?.data?.message || 'Failed to update remitter');
      }

      return response;
    } catch (error) {
      handleCustomError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

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

  const handleReset = () => {
    setIsSeacrh(false)
    setSearchValues({});
    setPage(1)
    setSize(10)
  }

  const fetchRemitterDetails = async (mobileNumber: string) => {
    try {
      if (!mobileNumber) return;
      const response = await Remitter_details(mobileNumber);
      if (response?.data?.statusCode == "200") {
        setRemitterDetails(response?.data?.data || {});
      }
    } catch (err) {
      handleCustomError(err);
    }
  }

  const handleOtpSubmit = async (values: any) => {
    try {
      setIsLoading(true);

      const payload = {
        otp: values.otp,
        schemeCode: selectedSubProduct?.schemeCode,
        ...tranxData
      };

      const response = await Dmt_Transaction(payload);
      const data = response?.data
      const apiData = data?.data;

      // No receipt data → show snackbar only
      if (!apiData) {
        showErrorNotification(data?.message || "No receipt available");
        return;
      }

      // Failure message builder (safe)
      const failureMessage = apiData?.remarks
        ? `${data?.message} - ${apiData.remarks}`
        : data?.message || "Transaction Failed";

      if (data?.statusCode == "200") {
        showSuccessNotification(response?.data?.message || "Transaction Success");
        if (tranxData?.beneId) {
          store(tranxData?.beneId, Number(tranxData?.amount));
        }
        // Store receipt data
        setReceiptData(apiData);
        setReceiptTxnType(tranxData?.txnType || "");

        // Open drawer
        setReceiptDrawerOpened(true);

        handleCloseDeleteModal();
        fetchRemitterDetails(mobileNumber);
        await getBeneficiariesList(page, size, searchValues); // refresh with same filters
      } else if (data?.statusCode == "202") {
        toast.warning(failureMessage || "Transaction is in Pending");

        // Store receipt data
        setReceiptData(apiData);
        setReceiptTxnType(tranxData?.txnType || "");

        // Open drawer
        setReceiptDrawerOpened(true);

        handleCloseDeleteModal();
        fetchRemitterDetails(mobileNumber);
        await getBeneficiariesList(page, size, searchValues);
      }
      else {
        showErrorNotification(failureMessage);

        // Store receipt data
        setReceiptData(apiData);
        setReceiptTxnType(tranxData?.txnType || "");

        // Open drawer
        setReceiptDrawerOpened(true);
      }
    } catch (error: any) {
      if (error?.isAxiosError && error.response?.data?.data) {
        const errorData = error.response.data;
        const apiData = errorData.data;

        // Store receipt data from error response
        setReceiptData(apiData);
        setReceiptTxnType(tranxData?.txnType || "");

        // Open drawer for failure
        setReceiptDrawerOpened(true);
      }
      handleCustomError(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleRefresh = async () => {
    await getBeneficiariesList(page, size, searchValues);
  }

  useEffect(() => {
    getBeneficiariesList(page, size, searchValues);
  }, [page, size, searchValues])


  useEffect(() => {
    if (!mobileNumber) return;
    fetchRemitterDetails(mobileNumber);
  }, [])

  return (
    <>
      {isLoading && <Loader />}
      <div className="w-full 320px:mt-12 md:mt-0">
        <div className="mb-3 flex items-center gap-6 justify-start">
          <UnstyledButton
            onClick={() => {
              navigate(`/products/dmt/${subProductId}`);
            }}
          >
            <BackSvgIcon color={theme.palette.primary.main} />
          </UnstyledButton>
          <TextComponent
            fontSize={28}
            fontWeight={600}
            color={theme.palette.primary.main}
          >
            Mudra Remit
          </TextComponent>
        </div>

        <RemitterInfoHeader
          remitter={{
            name: remitterDetails?.name || "N/A",
            mobile: mobileNumber || "N/A",
            availableLimit: remitterDetails?.limitAmount || 0,
          }}
          onEdit={() => setShowEditRemitterForm(true)}
        />

        <div className="flex items-center justify-end gap-3">
          {/* Refresh */}
          <div className="flex w-max items-center justify-center gap-2 rounded-lg border-2 border-divider bg-background-paper px-2 py-[6px]">
            <UnstyledButton
              onClick={handleReset}
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
            title="ADD BENEFICIARY"
            variant="filled"
            onClick={() => setShowAddBeneficiaryForm(true)}
            radius={2}
            width={220}
            height={40}
            leftIcon={<PlusSvgIcon color={theme.palette.background.paper} />}
          />
        </div>

        {/* ////////////////////////////// Table ///////////////////////////////// */}
        <div className="mt-6">
          <TableComponent
            keyField="id"
            data={beneficiaries}
            columns={tableColumns}
            showSearch={isSeacrh}
            onSearch={(columnKey, value) => {
              handleSearchWithValues(columnKey, value)
            }}
            showNoDataFound={true}
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
      </div>

      <AddBeneficiaryModal
        opened={showAddBeneficiaryForm}
        onClose={() => setShowAddBeneficiaryForm(false)}
        subProductId={subProductId || ""}
        refresh={handleRefresh}
        mobile={mobileNumber || ""}
      />

      <EditRemitterModal
        opened={showEditRemitterForm}
        onClose={() => setShowEditRemitterForm(false)}
        remitterData={{
          mobile: mobileNumber || 'N/A',
          name: remitterDetails?.name || '',
        }}
        onSubmit={handleRemitterUpdate}
      />

      <DeleteBeneficiaryModal
        opened={isDeleteModal}
        onClose={handleCloseDeleteModal}
        isLoading={isLoading}
        onDeleteSubmit={handleDeleteBeneficiary}
        selectedRow={selectedRow}
        showOtpField={showDeleteOtpModal}
        onOtpVerify={handleDeleteOtpVerification}
        mobileNumber={mobileNumber}
      />

      <DmtTranOtpModal
        opened={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onSubmit={handleOtpSubmit}
        otpLength={otpLength}
        mobile={mobileNumber}
      />

      <Drawer
        opened={receiptDrawerOpened}
        onClose={() => {
          setReceiptDrawerOpened(false);
          setReceiptData(null);
          // navigate("/products/dmt");
        }}
        closeOnEscape={false}
        closeOnClickOutside={false}
        position="right"
        size="xl"
        overlayProps={{ backgroundOpacity: 0.4, blur: 2 }}
        transitionProps={{ transition: "slide-right", duration: 300 }}
      >
        {receiptData && (
          <DMTTransactionReceipt
            data={receiptData}
            txnType={receiptTxnType}
          />
        )}
      </Drawer>

      {/* Transfer Confirmation Dialog */}
      <ConfirmDialog
        opened={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, payload: null, submitFn: null })}
        onConfirm={() => {
          setConfirmModal((prev) => ({ ...prev, open: false }));
          confirmModal.submitFn?.();
        }}
      />
    </>
  )
}

export default RemitterInfo
