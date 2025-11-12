import { BackSvgIcon, FilterSvgIcon, PlusSvgIcon, TrashSvgIcon } from "@/assets/svg";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import TableComponent from "@/components/Molecules/TableComponent";
import AddBeneficiaryModal from "@/components/Organism/DMT/AddBeneficiaryModal";
import RemitterInfoHeader from "@/components/Organism/DMT/RemitterInfoHeader";
import { Fetch_Beneficiaries } from "@/Services/api";
import { handleCustomError } from "@/Utils/handleCustomError";
import { showErrorNotification } from "@/Utils/notifications";
import { useBankVerification } from "@/Utils/Verification";
import { UnstyledButton } from "@mantine/core";
import { Refresh } from "@mui/icons-material";
import { useTheme } from "@mui/system";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Yup from 'yup'

const RemitterInfo = () => {

  const navigate = useNavigate();
  const theme = useTheme();
  const { subProductId } = useParams();
  const location = useLocation();
  const { limit, mobileNumber, subProduct } = location.state || {};
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isSeacrh, setIsSeacrh] = useState(false);
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [showAddBeneficiaryForm, setShowAddBeneficiaryForm] = useState(false);
  const { verify: verifyBank } = useBankVerification();


  const tableColumns = [
    {
      key: "bene_id",
      label: "ID",
      searchKey: "bene_id",
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
            .min(1, "Minimum amount is 1"),
        });

        const initialValues = {
          accountNumber: values?.accountNumber || "",
          ifscCode: values?.ifscCode || "",
          amount: "0",
          beneficiaryName: values?.bankHolderName || "",
          paymentMode: "IMPS",
        };
        const handleSubmit = async (values: any) => {
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
            };


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

                      // 🧠 If current value is 0 and user types a number → replace it
                      if (Number(values.amount) === 0 && /^\d$/.test(val)) {
                        setFieldValue("amount", Number(val));
                      }
                      // ✅ Otherwise, handle normally
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
      render: (row: any) => (
        <div>
          <UnstyledButton
            onClick={() => {
              // setIsDeleteModal(true);
              // setSelectedRowData(row);
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
          id: row?.id,
          hierarchyId: row.hierarchyId,
          bankName: verifiedData?.ifsc_details?.bank_name || row.bankName,
          bankHolderName: verifiedData?.full_name || row.bankHolderName,
          bankAccountNumber: row.accountNumber,
          ifscCode: row.ifscCode,
          verified: "1",
          // createdBy: loginData?.mobileNumber,
        };

        // Step 4: Call DB API to persist changes
        // const dbResponse = await Edit_Beneficiary_Bank_Details(payload);
        // if (dbResponse?.status === 200 || dbResponse?.data?.status === "200") {
        //   showSuccessNotification("Bank verified & saved successfully");
        // } else {
        //   showErrorNotification(dbResponse?.data?.message || "Failed to save bank verification");
        // }
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
        setBeneficiaries(response?.data?.data?.data);
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
    getBeneficiariesList(page, size, searchValues);
  }, [page, size, searchValues])

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

        <RemitterInfoHeader
          remitter={{
            name: "ABC",
            mobile: mobileNumber || "N/A",
            availableLimit: limit || 0,
          }}
        // onEdit={() => setShowAddBeneficiaryForm(true)}
        />

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
      />
    </>
  )
}

export default RemitterInfo
