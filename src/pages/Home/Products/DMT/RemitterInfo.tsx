// import { useTheme } from "@mui/system";
// import { useNavigate, useParams } from "react-router-dom";
// import { useState } from "react";
// import { RemitterInfoData } from "@/Common/interface";
// import DropdownComponent from "@/components/Atoms/DropdownComponent";
// import TextInputComponent from "@/components/Atoms/TextInputComponent";
// import ButtonComponent from "@/components/Atoms/ButtonComponent";
// import Loader from "@/components/Atoms/Loader";
// import { UnstyledButton } from "@mantine/core";
// import {
//   BackSvgIcon,
//   EditSvgIcon,
//   FilterSvgIcon,
//   PlusSvgIcon,
//   TrashSvgIcon,
// } from "@/assets/svg";
// import TextComponent from "@/components/Atoms/TextComponent";
// import TableComponent from "@/components/Molecules/TableComponent";
// import RemitterInfoEditModal from "@/components/Organism/DMT/RemitterINfoModal";
// import AddBeneficiaryModal from "@/components/Organism/DMT/AddBeneficiaryModal";
// import RemitterEkycModal from "@/components/Organism/DMT/RemitterEkycModal";

import { BackSvgIcon, EditSvgIcon, FilterSvgIcon, PlusSvgIcon, TrashSvgIcon } from "@/assets/svg";
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
import { showErrorNotification, showSuccessNotification } from "@/Utils/notifications";
import { UnstyledButton } from "@mantine/core";
import { Refresh } from "@mui/icons-material";
import { useTheme } from "@mui/system";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Yup from 'yup'

// const RemitterInfo = () => {
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const { subProductId } = useParams();
//   const [showDrawerForm, setShowDrawerForm] = useState(false);
//   const [showAddBeneficiaryForm, setShowAddBeneficiaryForm] =
//     useState(false);
//   const [showEkycDrawerForm, setShowEkycDrawerForm] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSeacrh, setIsSeacrh] = useState(false);
//   // const [searchValues, setSearchValues] = useState<Record<string, string>>({});
//   const [selectedRowData, setSelectedRowData] = useState<RemitterInfoData | []>(
//     []
//   );
//   //   const [isInfoList, setIsInfoList] = useState<RemitterInfoData | []>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [isRemitterInfoList, setIsRemitterInfoList] = useState<
//     RemitterInfoData | []
//   >([]);

//   console.log(
//     setIsRemitterInfoList,
//     setItemsPerPage,
//     setCurrentPage,
//     setIsLoading
//   );
//   // const apiResponses = useSelector(
//   //   (state: RootState) => state.apiResponse.responses
//   // );

//   // const loginData = apiResponses?.loginData
//   //   ? decryptData(apiResponses?.loginData)
//   //   : null;

//   // const GetPayoutDataSubmit = async () => {
//   //   try {
//   //     setIsLoading(true);
//   //     //   let bodyRequest = {
//   //     //     fromDate: "",
//   //     //     toDate: "",

//   //     //     page: values.page,
//   //     //     size: values.size,
//   //     //   };
//   //     //   const response = await Wallet_Report({}, bodyRequest);

//   //     //   if (response?.status === 200) {
//   //     //     setIsInfoList(response?.data?.data?.content);
//   //     //     showSuccessNotification(response?.data?.message);
//   //     //   } else {
//   //     //     showErrorNotification(response?.data?.message);
//   //     //   }
//   //   } catch (error) {
//   //     await handleCustomError(error);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };
//   // const tableColumns = [
//   //   {
//   //     key: "beneficiaryName",
//   //     label: "Beneficiary Name",
//   //     searchKey: "beneficiaryName",
//   //     sortable: false,
//   //   },
//   //   {
//   //     key: "bankName",
//   //     label: "Bank",
//   //     searchKey: "bankName",
//   //     sortable: false,
//   //   },
//   //   {
//   //     key: "accountNumber",
//   //     label: "Account No",
//   //     searchKey: "accountNumber",
//   //     sortable: true,
//   //   },
//   //   {
//   //     key: "ifscCode",
//   //     label: "IFSC Code",
//   //     searchKey: "ifscCode",
//   //     sortable: false,
//   //   },
//   //   {
//   //     key: "amount",
//   //     label: "Transfer",
//   //     searchKey: "amount",
//   //     sortable: true,
//   //     render: () => (
//   //       <div className="flex items-center gap-2 justify-center">
//   //         <div className="w-[20%]  ">
//   //           <DropdownComponent
//   //             data={[
//   //               { value: "PREPAID", label: "PREPAID" },
//   //               { value: "POSTPAID", label: "POSTPAID" },
//   //             ]}
//   //             value={""}
//   //             onChange={() => { }}
//   //             className="w-max"
//   //           />
//   //         </div>
//   //         <div className="w-[20%]  ">
//   //           <DropdownComponent
//   //             data={[
//   //               { value: "IMPS", label: "IMPS" },
//   //               { value: "NEFT", label: "NEFT" },
//   //             ]}
//   //             value={""}
//   //             onChange={() => { }}
//   //             className="w-max"
//   //           />
//   //         </div>
//   //         <div className="w-[30%]  ">
//   //           <TextInputComponent
//   //             allowCharacter={false}
//   //             allowSpace={false}
//   //             allowSpecialChar={false}
//   //             value={""}
//   //             onChange={() => { }}
//   //             // type="number"
//   //             className="w-max"
//   //           />
//   //         </div>
//   //         <div className="flex w-max ">
//   //           <ButtonComponent
//   //             title={"TRANSFER"}
//   //             variant="filled"
//   //             onClick={() => { }}
//   //             disabled={isLoading}
//   //             radius={10}
//   //           />
//   //         </div>
//   //       </div>
//   //     ),
//   //   },
//   //   {
//   //     key: "verified",
//   //     label: "Verified",
//   //     searchKey: "verified",
//   //     sortable: false,
//   //   },
//   //   {
//   //     key: "action",
//   //     label: "Action",
//   //     render: (row: any) => (
//   //       <div className="flex w-max items-center justify-between gap-2 justify-self-center">
//   //         <UnstyledButton
//   //           onClick={() => {
//   //             setSelectedRowData(row);
//   //           }}
//   //         >
//   //           <TrashSvgIcon color={theme.palette.error.main} />
//   //         </UnstyledButton>
//   //       </div>
//   //     ),
//   //   },
//   // ];

//   // const timeoutRef = useRef<NodeJS.Timeout | null>(null);

//   // const handleSearchWithValues = (
//   //   columnKey: string,
//   //   value: string
//   //   // values: WalletParams
//   // ) => {
//   //   try {
//   //     const column = tableColumns.find((col) => col.key === columnKey);
//   //     if (!column) return;

//   //     const searchKey = column.searchKey || column.key;
//   //     const newSearchValues = { ...searchValues };

//   //     if (value) {
//   //       newSearchValues[searchKey] = value;
//   //     } else {
//   //       delete newSearchValues[searchKey];
//   //     }

//   //     setSearchValues(newSearchValues);

//   //     //   if (values.fromDate && values.toDate) {
//   //     //     const bodyRequest = {
//   //     //       fromDate: "",
//   //     //       toDate: "",
//   //     //       hierarchyId: values.hierarchyId || loginData?.hierarchyId,
//   //     //       walletType: values.walletType,
//   //     //       subProductName: values.subProductName,
//   //     //       status: values.status,
//   //     //       page: values.page,
//   //     //       size: values.size,
//   //     //     };

//   //     //     if (timeoutRef.current) {
//   //     //       clearTimeout(timeoutRef.current);
//   //     //     }

//   //     //     timeoutRef.current = setTimeout(() => {
//   //     //       setIsLoading(true);
//   //     //         Wallet_Report(newSearchValues, bodyRequest)
//   //     //           .then((response) => {
//   //     //             if (response?.status === 200) {
//   //     //               setIsInfoList(response?.data?.data?.content);
//   //     //             } else {
//   //     //               showErrorNotification(response?.data?.message);
//   //     //               setIsInfoList([]);
//   //     //             }
//   //     //           })
//   //     //           .catch((error) => {
//   //     //             handleCustomError(error);
//   //     //             setIsInfoList([]);
//   //     //           })
//   //     //           .finally(() => {
//   //     //             setIsLoading(false);
//   //     //           });
//   //     //     }, 900);
//   //     //   }
//   //   } catch (error) {
//   //     handleCustomError(error);
//   //   }
//   // };

//   return (
//     <>
//       {isLoading && <Loader />}

//         <div className="border-2 border-red-light rounded-lg mb-6 ">
//           <div className="flex p-2 items-center justify-between w-full border-b-2 border-b-red-light">
//          

//           </div>
//           <div className="flex p-2 items-center justify-evenly w-full gap-4">
//             <TextComponent
//               fontSize={20}
//               fontWeight={500}
//               color={theme.palette.background.default}
//             >
//               Name: ABC
//             </TextComponent>
//             <TextComponent
//               fontSize={20}
//               fontWeight={500}
//               color={theme.palette.background.default}
//             >
//               Mobile NO: 1234567890
//             </TextComponent>
//             <TextComponent
//               fontSize={20}
//               fontWeight={500}
//               color={theme.palette.background.default}
//             >
//               Current Available Limit: 1000
//             </TextComponent>
//           </div>
//         </div>

//         {showDrawerForm && (
//           <RemitterInfoEditModal
//             opened={showDrawerForm}
//             onClose={() => setShowDrawerForm(false)}
//             rowData={selectedRowData}
//           />
//         )}
//       </div>
//     </>
//   );
// };

// export default RemitterInfo;




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

  const tableColumns = [
    {
      key: "beneficiaryName",
      label: "Beneficiary Name",
      searchKey: "beneficiaryName",
    },
    {
      key: "bankName",
      label: "Bank Name",
      searchKey: "bankName",
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
      render: (_value: any, _index: number, row: any) => (
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
            // onClick={() => handleVerifyBank(row)}
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

  const getBeneficiariesList = async (pageNum = 1, pageSize = 10, filters: Record<string, any> = {}) => {
    const reqParams = {
      page: pageNum - 1, // API is 0-indexed
      size: pageSize,
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
          onEdit={() => setShowAddBeneficiaryForm(true)}
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
            // onClick={() => setShowDrawerForm(true)}
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
      />
    </>
  )
}

export default RemitterInfo
