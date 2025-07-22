import { ColsSvgIcon, ExportSvgIcon, FilterSvgIcon } from "@/assets/svg";
import {
  NetworkTransactionData,
  NetworkTransactionParams,
} from "@/Common/interface";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import CustomDateComponent from "@/components/Atoms/CustomDateComponent";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import ColumsSelectionModal from "@/components/Molecules/ColumsSelectionModal";
import TableComponent from "@/components/Molecules/TableComponent";
import { RootState } from "@/Redux/Store";
import { Network_Transaction_Report } from "@/Services/api";
import { useDebounce } from "@/Utils/debounce";
import { handleCustomError } from "@/Utils/handleCustomError";
import {
  decryptData,
  formatYMDdate,
  isSameOrAfter,
  isSameOrBefore,
} from "@/Utils/helper";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import { UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";

const NetworkTransaction = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isNetworkTransactionReportList, setIsNetworkTransactionReportList] =
    useState<NetworkTransactionData | []>([]);
  const [isSeacrh, setIsSeacrh] = useState(false);
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 800);
  const [currentPageData, setCurrentPageData] = useState<
    NetworkTransactionData[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const validationSchema = Yup.object({
    fromDate: Yup.date()
      .required("Required")
      .test("max-today", "Invalid Date", function (value) {
        if (!value) return true;
        return isSameOrBefore(value, today);
      })
      .test("date-range", "Invalid Date", function (value) {
        const toDate = this.parent.toDate;
        if (!value || !toDate) return true;
        return isSameOrBefore(value, toDate);
      }),
    toDate: Yup.date()
      .required("Required")
      .test("max-today", "Invalid Date", function (value) {
        if (!value) return true;
        return isSameOrBefore(value, today);
      })
      .test("date-range", "Invalid Date", function (value) {
        const fromDate = this.parent.fromDate;
        if (!value || !fromDate) return true;
        return isSameOrAfter(value, fromDate);
      }),
    subProductName: Yup.string().required("Required"),
    partnerId: Yup.string().required("Required"),
    distributorId: Yup.string().required("Required"),
    retailerId: Yup.string().required("Required"),
    status: Yup.string().required("Required"),
  });

  const initialValues: NetworkTransactionParams = {
    loginHierarchyId: loginData?.hierarchyId,
    fromDate: "",
    toDate: "",
    subProductName: "",
    partnerId: "",
    distributorId: "",
    retailerId: "",
    status: "",
    page: currentPage,
    size: itemsPerPage,
    // search: "",
    // download: false,
  };

  const handleReportSubmit = async (
    values: NetworkTransactionParams
    // { resetForm }: FormikHelpers<ReportProps>,
  ) => {
    try {
      setIsLoading(true);
      setCurrentPage(values.page);
      setItemsPerPage(values.size);
      let bodyRequest = {
        fromDate: formatYMDdate(values.fromDate),
        toDate: formatYMDdate(values.toDate),
        loginHierarchyId: values.loginHierarchyId || loginData?.hierarchyId,
        subProductName: values.subProductName,
        partnerId: values.partnerId,
        distributorId: values.distributorId,
        retailerId: values.retailerId,
        status: values.status,
        page: values.page,
        size: values.size,
      };
      const response = await Network_Transaction_Report({}, bodyRequest);

      if (response?.status === 200) {
        setIsNetworkTransactionReportList(response?.data?.data?.content);
        showSuccessNotification(response?.data?.message);
      } else {
        showErrorNotification(response?.data?.message);
      }
    } catch (error) {
      await handleCustomError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (formikValues: NetworkTransactionParams) => {
    try {
      const bodyRequest = {
        fromDate: formatYMDdate(formikValues.fromDate),
        toDate: formatYMDdate(formikValues.toDate),
        loginHierarchyId:
          formikValues.loginHierarchyId || loginData?.hierarchyId,
        subProductName: formikValues.subProductName,
        partnerId: formikValues.partnerId,
        distributorId: formikValues.distributorId,
        retailerId: formikValues.retailerId,
        status: formikValues.status,
        page: formikValues.page,
        size: formikValues.size,
      };

      const response = await Network_Transaction_Report(
        searchValues,
        bodyRequest
      );

      if (response?.status === 200) {
        const blob = new Blob([response.data], {
          type: "application/octet-stream",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Commission_&_Changes_report_${formatYMDdate(new Date())}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        showErrorNotification(response?.data?.message);
      }
    } catch (error) {
      await handleCustomError(error);
    }
  };

  const tableColumns = [
    {
      key: "createdOn",
      label: "Created On",
      searchKey: "createdOn",
      sortable: false,
      type: "date",
    },
    {
      key: "transactionId",
      label: "Transaction ID",
      searchKey: "transactionId",
      sortable: false,
    },
    {
      key: "outletName",
      label: "Outlet Name",
      searchKey: "outletName",
      sortable: false,
    },
    {
      key: "subProductName",
      label: "Sub Product Name",
      searchKey: "subProductName",
      sortable: false,
    },
    {
      key: "walletType",
      label: "Wallet Type",
      searchKey: "walletType",
      sortable: false,
    },
    {
      key: "transactionType",
      label: "Transaction Type",
      searchKey: "transactionType",
      sortable: false,
    },
    {
      key: "operator",
      label: "Operator",
      searchKey: "operator",
      sortable: false,
    },
    {
      key: "balanceBefore",
      label: "Balance Before",
      searchKey: "balanceBefore",
      sortable: false,
    },
    {
      key: "amount",
      label: "Amount",
      searchKey: "amount",
      sortable: true,
    },
    {
      key: "refNo",
      label: "Ref No",
      searchKey: "refNo",
      sortable: true,
    },
    {
      key: "balanceAfter",
      label: "Balance After",
      searchKey: "balanceAfter",
      sortable: false,
    },
    {
      key: "narration",
      label: "Narration",
      searchKey: "narration",
      sortable: false,
    },
  ];

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchWithValues = (
    columnKey: string,
    value: string,
    values: NetworkTransactionParams
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
          fromDate: formatYMDdate(values.fromDate),
          toDate: formatYMDdate(values.toDate),
          loginHierarchyId: values.loginHierarchyId || loginData?.hierarchyId,
          subProductName: values.subProductName,
          partnerId: values.partnerId,
          distributorId: values.distributorId,
          retailerId: values.retailerId,
          status: values.status,
          page: values.page,
          size: values.size,
        };

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setIsLoading(true);
          Network_Transaction_Report(newSearchValues, bodyRequest)
            .then((response) => {
              if (response?.status === 200) {
                setIsNetworkTransactionReportList(
                  response?.data?.data?.content
                );
              } else {
                showErrorNotification(response?.data?.message);
                setIsNetworkTransactionReportList([]);
              }
            })
            .catch((error) => {
              handleCustomError(error);
              setIsNetworkTransactionReportList([]);
            })
            .finally(() => {
              setIsLoading(false);
            });
        }, 900);
      }
    } catch (error) {
      handleCustomError(error);
    }
  };
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    tableColumns.filter((col) => col.key !== "action").map((col) => col.key)
  );

  const filteredTableColumns = [
    ...tableColumns.filter(
      (col) => visibleColumns.includes(col.key) && col.key !== "action"
    ),
    tableColumns.find((col) => col.key === "action")!,
  ];

  const filteredData = isNetworkTransactionReportList
    .filter((item: any) => {
      const matchesSearch = debouncedSearchValue
        ? Object.entries(item).some(([key, value]) => {
            const stringValue = value?.toString().toLowerCase() || "";
            const matches =
              key !== "action" &&
              stringValue.includes(debouncedSearchValue.toLowerCase());
            return matches;
          })
        : true;

      return matchesSearch;
    })
    .map((item: any, index: number) => ({
      ...item,
      _rowKey: `${item.userId || ""}__${index}`,
    }));

  return (
    <>
      {isLoading && <Loader />}
      <div className="w-full 320px:mt-12 md:mt-0">
        <div className="mb-6 ">
          <TextComponent
            fontSize={22}
            fontWeight={600}
            color={theme.palette.red.DEFAULT}
          >
            Network Transaction Report
          </TextComponent>
        </div>

        <Formik<NetworkTransactionParams>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleReportSubmit}
        >
          {({ values, handleSubmit, errors, touched, setFieldValue }) => {
            return (
              <>
                <div className="shadow-black-900/100 mt-5 flex w-full flex-col items-center justify-center gap-6 rounded-xl bg-background-paper p-3 shadow-lg 320px:mt-5 md:mt-0">
                  <div className="flex w-full flex-wrap items-center justify-between gap-4">
                    <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(20%-16px)]">
                      <CustomDateComponent
                        label="Date Range"
                        type="range"
                        value={[
                          values.fromDate ? new Date(values.fromDate) : null,
                          values.toDate ? new Date(values.toDate) : null,
                        ]}
                        onChange={(val) => {
                          if (Array.isArray(val) && val.length === 2) {
                            setFieldValue("fromDate", val[0]);
                            setFieldValue("toDate", val[1]);
                          }
                        }}
                        onShortcutSelect={(
                          start: Date | null,
                          end: Date | null
                        ) => {
                          setFieldValue("fromDate", start);
                          setFieldValue("toDate", end);
                        }}
                        dateFormat="YYYY-MM-DD"
                        className="w-72"
                        withAsterisk
                        error={
                          (touched.fromDate && errors.fromDate
                            ? errors.fromDate
                            : "") +
                          (touched.toDate &&
                          errors.toDate &&
                          errors.toDate !== errors.fromDate
                            ? (errors.fromDate ? " | " : "") + errors.toDate
                            : "")
                        }
                        customButtons={true}
                      />
                    </div>
                    <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(20%-16px)]">
                      <DropdownComponent
                        label="Partner ID"
                        data={[
                          { value: "POSTPAID", label: "POSTPAID" },
                          { value: "PREPAID", label: "PREPAID" },
                        ]}
                        value={values.partnerId}
                        withAsterisk
                        onChange={(value) => setFieldValue("partnerId", value)}
                        error={
                          touched.partnerId && errors.partnerId
                            ? errors.partnerId
                            : ""
                        }
                        className="w-max"
                      />
                    </div>
                    <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(20%-16px)]">
                      <DropdownComponent
                        label="Sub Product Name"
                        data={[
                          { value: "PG_QUICK", label: "PG_QUICK" },
                          { value: "PREPAID", label: "PREPAID" },
                        ]}
                        value={values.subProductName}
                        withAsterisk
                        onChange={(value) =>
                          setFieldValue("subProductName", value)
                        }
                        error={
                          touched.subProductName && errors.subProductName
                            ? errors.subProductName
                            : ""
                        }
                        className="w-max"
                      />
                    </div>
                    <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(20%-16px)]">
                      <DropdownComponent
                        label="Distributor ID"
                        data={[
                          { value: "COMMISSION", label: "COMMISSION" },
                          { value: "CHARGE", label: "CHARGE" },
                        ]}
                        value={values.distributorId}
                        withAsterisk
                        onChange={(value) =>
                          setFieldValue("distributorId", value)
                        }
                        error={
                          touched.distributorId && errors.distributorId
                            ? errors.distributorId
                            : ""
                        }
                        className="w-max"
                      />
                    </div>
                    <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(20%-16px)]">
                      <DropdownComponent
                        label="Retailer ID"
                        data={[
                          { value: "COMMISSION", label: "COMMISSION" },
                          { value: "CHARGE", label: "CHARGE" },
                        ]}
                        value={values.retailerId}
                        withAsterisk
                        onChange={(value) => setFieldValue("retailerId", value)}
                        error={
                          touched.retailerId && errors.retailerId
                            ? errors.retailerId
                            : ""
                        }
                        className="w-max"
                      />
                    </div>
                    <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(20%-16px)]">
                      <DropdownComponent
                        label="Status"
                        data={[
                          { value: "COMMISSION", label: "COMMISSION" },
                          { value: "CHARGE", label: "CHARGE" },
                        ]}
                        value={values.status}
                        withAsterisk
                        onChange={(value) => setFieldValue("status", value)}
                        error={
                          touched.status && errors.status ? errors.status : ""
                        }
                        className="w-max"
                      />
                    </div>

                    <div className="flex items-center justify-end w-max">
                      <ButtonComponent
                        title="View"
                        variant="filled"
                        onClick={() => {
                          setFieldValue("download", false);
                          handleSubmit();
                        }}
                        radius={29}
                      />
                    </div>
                  </div>
                </div>
                {isNetworkTransactionReportList &&
                  isNetworkTransactionReportList.length > 0 && (
                    <div className="flex items-center justify-end gap-2">
                      <div className="border-1 mt-4 flex w-max items-center justify-center justify-self-end rounded-md border-red-light bg-red-light px-2 py-1">
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
                      <div
                        onClick={() => setShowColumnModal(true)}
                        className="border-1 mt-4 flex w-max items-center justify-center justify-self-end rounded-md border-red-light bg-red-light px-2 py-1"
                      >
                        <ColsSvgIcon color={theme.palette.red.DEFAULT} />
                        <TextComponent
                          color={theme.palette.red.DEFAULT}
                          fontSize={16}
                          fontWeight={400}
                        >
                          Cols
                        </TextComponent>
                      </div>
                      <div className="border-1 mt-4 flex w-28 items-center justify-center justify-self-end rounded-md border-red-light bg-red-light px-2 py-1">
                        <UnstyledButton
                          onClick={() => handleExport(values)}
                          className="flex flex-row items-center justify-center gap-3 disabled:opacity-30"
                        >
                          <ExportSvgIcon color={theme.palette.red.DEFAULT} />{" "}
                          <TextComponent
                            fontSize={18}
                            fontWeight={400}
                            color={theme.palette.red.DEFAULT}
                          >
                            Export
                          </TextComponent>
                        </UnstyledButton>
                      </div>
                    </div>
                  )}
                <div className="mt-6">
                  <TableComponent
                    data={filteredData}
                    columns={filteredTableColumns}
                    showSearch={isSeacrh}
                    page={currentPage}
                    size={itemsPerPage}
                    onCurrentPageData={setCurrentPageData}
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
                      handleReportSubmit(updatedValues); //
                    }}
                    onPageSizeChange={(size) => {
                      setItemsPerPage(size);
                      setCurrentPage(1);
                      const updatedValues = {
                        ...values,
                        page: 1,
                        size,
                      };
                      handleReportSubmit(updatedValues); //
                    }}
                  />
                </div>
              </>
            );
          }}
        </Formik>
        <ColumsSelectionModal
          open={showColumnModal}
          onClose={() => setShowColumnModal(false)}
          data={tableColumns}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
        />
      </div>
    </>
  );
};

export default NetworkTransaction;
