import { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { CommissionAndChargesParams, CommissionAndChargesRequest, CommissionData, TableColumn } from "@/Common/interface";
import {
  dateRangeValidationSchema,
  decryptData,
  formatYMDdate,
} from "@/Utils/helper";
import {
  showErrorNotification,
} from "@/Utils/notifications";
import { handleCustomError } from "@/Utils/handleCustomError";
import MyLoader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import { Loader, UnstyledButton } from "@mantine/core";
import TableComponent from "@/components/Molecules/TableComponent";
import { useTheme } from "@mui/system";
import { Commission_And_Charges_Report } from "@/Services/api";
import { ColsSvgIcon, ExportSvgIcon, FilterSvgIcon, RefreshSvgIcon } from "@/assets/svg";
import ColumsSelectionModal from "@/components/Molecules/ColumsSelectionModal";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import FormikDateRangePicker from "@/components/Molecules/NewComponents/FormikDateRangePicker";
import { DatesRangeValue } from "@mantine/dates";
import moment from "moment";
import FormikSelectComponent from "@/components/Molecules/NewComponents/FormikSelectComponent";
import { useHierarchySubHierarchy } from "@/Utils/CustomHooks/useHierarchySubHierarchy";

const CommissionAndCharges = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isCommissionReportList, setIsCommissionReportList] = useState<
    CommissionData | []
  >([]);
  const [isSeacrh, setIsSeacrh] = useState(false);
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const subproductData = apiResponses?.subProductDropdown
    ? decryptData(apiResponses?.subProductDropdown)
    : null;

  const myHierarchyCode = loginData?.hierarchyId?.split("-")[1];
  const hierarchyOrder = ["SA", "AD", "ET", "WL", "SD", "PT", "DT", "RT"];
  const myLevelIndex = hierarchyOrder.indexOf(myHierarchyCode);

  const uniqueSubProductTypes =
    subproductData?.map((item: any) => ({
      value: item.subProduct_name,
      label: item.subProduct_name,
    })) || [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const validationSchema = Yup.object({
    // fromDate: Yup.date()
    //   .required("Required")
    //   .test("max-today", "Invalid Date", function (value) {
    //     if (!value) return true;
    //     return isSameOrBefore(value, today);
    //   })
    //   .test("date-range", "Invalid Date", function (value) {
    //     const toDate = this.parent.toDate;
    //     if (!value || !toDate) return true;
    //     return isSameOrBefore(value, toDate);
    //   }),
    // toDate: Yup.date()
    //   .required("Required")
    //   .test("max-today", "Invalid Date", function (value) {
    //     if (!value) return true;
    //     return isSameOrBefore(value, today);
    //   })
    //   .test("date-range", "Invalid Date", function (value) {
    //     const fromDate = this.parent.fromDate;
    //     if (!value || !fromDate) return true;
    //     return isSameOrAfter(value, fromDate);
    //   }),
    dateRange: dateRangeValidationSchema,
    subProductName: Yup.string().required("Required"),
    walletType: Yup.string()
      .required("Wallet Type is Required")
      .oneOf(["POSTPAID", "PREPAID"], "Wallet Type must be either POSTPAID or PREPAID"),
    reportType: Yup.string().required("Required"),
  });

  const initialValues: CommissionAndChargesParams = {
    hierarchyType: loginData?.hierarchyId?.split("-")?.[1] || "",
    hierarchyId: "",
    dateRange: [
      moment().subtract(6, "days").toDate(), // from: 6 days ago
      moment().toDate(), // to: today
    ] as DatesRangeValue,
    subProductName: "",
    walletType: "",
    reportType: "",
    page: currentPage,
    size: itemsPerPage,
  };

  const handleReportSubmit = async (
    values: CommissionAndChargesParams
    // { resetForm }: FormikHelpers<ReportProps>,
  ) => {
    try {
      setIsLoading(true);
      setCurrentPage(values.page);
      setItemsPerPage(values.size);
      const [fromDate, toDate] = values.dateRange || [];

      let bodyRequest: CommissionAndChargesRequest = {
        fromDate: fromDate ? formatYMDdate(fromDate) : null,
        toDate: toDate ? formatYMDdate(toDate) : null,
        hierarchyType: values.hierarchyType ?? "",
        hierarchyId: values.hierarchyId ?? "",
        walletType: values.walletType ?? "PREPAID",
        subProductName: values.subProductName,
        reportType: values.reportType,
        page: Number(values.page) - 1,
        size: values.size,
      };
      const response = await Commission_And_Charges_Report({}, bodyRequest);

      if ([200, "200"].includes(response?.data?.statusCode)) {
        const content = response?.data?.data?.content || [];
        const totalElements = response?.data?.data?.totalElements || 0;

        setIsCommissionReportList(content);
        setTotalRecords(totalElements);

        if (content.length <= 0) {
          showErrorNotification("No records found");
        }

      } else {
        setIsCommissionReportList([]);
        showErrorNotification(response?.data?.message);
        setTotalRecords(0);
      }
    } catch (error) {
      setIsCommissionReportList([]);
      setTotalRecords(0);
      await handleCustomError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (formikValues: CommissionAndChargesParams) => {
    try {
      const bodyRequest = {
        fromDate: formatYMDdate(formikValues.fromDate),
        toDate: formatYMDdate(formikValues.toDate),
        hierarchyType: formikValues.hierarchyType || "",
        hierarchyId: formikValues.hierarchyId || loginData?.hierarchyId,
        walletType: formikValues.walletType,
        subProductName: formikValues.subProductName,
        reportType: formikValues.reportType,
        page: formikValues.page,
        size: formikValues.size,
      };

      const response = await Commission_And_Charges_Report(
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
        a.download = `Commission_&_Charges_report_${formatYMDdate(new Date())}.csv`;
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

  const tableColumns: TableColumn[] = [
    {
      key: "txId",
      label: "Transaction ID",
      searchKey: "txId",
      sortable: false,
    },
    // {
    //   key: "outletName",
    //   label: "Outlet Name",
    //   searchKey: "outletName",
    //   sortable: false,
    // },
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
      type: "boolean",
      options: [
        { label: "PREPAID", value: "PREPAID" },
        { label: "POSTPAID", value: "POSTPAID" },
      ]
    },
    {
      key: "txType",
      label: "Transaction Type",
      searchKey: "txType",
      sortable: false,
    },
    {
      key: "operator",
      label: "Operator",
      searchKey: "operator",
      sortable: false,
    },
    {
      key: "balBefore",
      label: "Balance Before",
      searchKey: "balBefore",
      sortable: false,
      type: "number"
    },
    {
      key: "amount",
      label: "Amount",
      searchKey: "amount",
      type: "number"
      // sortable: true,
    },
    // {
    //   key: "refNo",
    //   label: "Ref No",
    //   searchKey: "refNo",
    //   sortable: true,
    // },
    {
      key: "balAfter",
      label: "Balance After",
      searchKey: "balAfter",
      sortable: false,
      type: "number"
    },
    {
      key: "createdOn",
      label: "Created On",
      searchKey: "createdOn",
      sortable: false,
      type: "date" as const,
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
    values: CommissionAndChargesParams
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
        const [fromDate, toDate] = values.dateRange || [];

        let bodyRequest: CommissionAndChargesRequest = {
          fromDate: fromDate ? formatYMDdate(fromDate) : null,
          toDate: toDate ? formatYMDdate(toDate) : null,
          hierarchyType: values.hierarchyType || "",
          hierarchyId: values.hierarchyId || "",
          subProductName: values.subProductName,
          walletType: values.walletType,
          reportType: values.reportType,
          page: values.page - 1,
          size: values.size,
        };

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setIsLoading(true);
          Commission_And_Charges_Report(newSearchValues, bodyRequest)
            .then((response) => {
              if (response?.status === 200) {
                setIsCommissionReportList(response?.data?.data?.content);
              } else {
                showErrorNotification(response?.data?.message);
                setIsCommissionReportList([]);
              }
            })
            .catch((error) => {
              handleCustomError(error);
              setIsCommissionReportList([]);
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

  return (
    <>
      {isLoading && <MyLoader />}
      <div className="w-full 320px:mt-12 md:mt-0">
        <div className="mb-6 ">
          <TextComponent
            fontSize={22}
            fontWeight={600}
            color={theme.palette.red.DEFAULT}
          >
            Commission & Charges Report
          </TextComponent>
        </div>

        <Formik<CommissionAndChargesParams>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleReportSubmit}
        >
          {({ values, handleSubmit, setFieldValue }) => {

            const { hierarchyList, loadingHierarchyList, subHierarchyList, loadingSubHierarchyList, subHierarchyKey, refetchHierarchy } = useHierarchySubHierarchy({
              selectedHierarchyCode: values.hierarchyType,
              onSubHierarchyReset: () => setFieldValue("hierarchyId", "")
            })

            const filteredHierarchyList = hierarchyList?.filter(
              (item: any) => hierarchyOrder.indexOf(item?.value) >= myLevelIndex
            );

            useEffect(() => {
              if (values.subProductName) {
                handleReportSubmit(values);
              }
            }, [currentPage, itemsPerPage, searchValues])

            return (
              <>
                <div className="shadow-black-900/100 mt-5 flex w-full flex-col items-center justify-center gap-6 rounded-xl bg-background-paper p-3 shadow-lg 320px:mt-5 md:mt-0">
                  <div className="flex w-full flex-wrap items-center justify-between gap-4">
                    <div className="flex w-full flex-wrap items-center justify-start gap-4">
                      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(20%-16px)]">
                        {/* <CustomDateComponent
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
                        /> */}
                        <FormikDateRangePicker
                          name="dateRange"
                          label="Date Range"
                          size="xs"
                          shortcuts
                          required
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(20%-16px)]">
                        {/* <DropdownComponent
                          label="Sub Product"
                          data={uniqueSubProductTypes}
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
                        /> */}
                        <FormikSelectComponent
                          name="subProductName"
                          label="Sub Product"
                          placeholder="Select Sub Product"
                          data={uniqueSubProductTypes}
                          allowDeselect
                          searchable
                          withAsterisk
                          size="xs"
                        />
                      </div>

                      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(20%-16px)]">
                        <FormikSelectComponent
                          name="hierarchyType"
                          size="xs"
                          label="Hierarchy Type"
                          placeholder="Select Hierarchy Type"
                          nothingFoundMessage="No Hierarchy Found"
                          data={filteredHierarchyList || []}
                          disabled={loadingHierarchyList}
                          searchable={true}
                          withAsterisk
                          required
                          rightSection={
                            <>
                              {loadingHierarchyList && (
                                <Loader size={14} color="blue" />
                              )}
                              {!loadingHierarchyList && hierarchyList.length < 1 && (
                                <div
                                  onClick={refetchHierarchy}
                                  className="cursor-pointer"
                                  style={{ pointerEvents: "auto", display: "flex", alignItems: "center" }}
                                  title="Refresh Hierarchy List"
                                >
                                  <RefreshSvgIcon color={theme.palette.primary.DEFAULT} />
                                </div>
                              )}
                            </>
                          }
                        />
                      </div>

                      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(20%-16px)]">
                        <FormikSelectComponent
                          key={subHierarchyKey}
                          name="hierarchyId"
                          size="xs"
                          label="Hierarchy ID"
                          placeholder="Select Hierarchy ID"
                          data={subHierarchyList?.map((item: any) => ({
                            label: item.displayName,
                            value: String(item.id),
                          }))}
                          allowDeselect={true}
                          searchable={true}
                          nothingFoundMessage="Nothing Found"
                          disabled={loadingSubHierarchyList}
                        />
                      </div>

                      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(20%-16px)]">
                        {/* <DropdownComponent
                          label="Wallet Type"
                          data={[
                            { value: "POSTPAID", label: "POSTPAID" },
                            { value: "PREPAID", label: "PREPAID" },
                          ]}
                          value={values.walletType}
                          withAsterisk
                          onChange={(value) =>
                            setFieldValue("walletType", value)
                          }
                          error={
                            touched.walletType && errors.walletType
                              ? errors.walletType
                              : ""
                          }
                          className="w-max"
                        /> */}
                        <FormikSelectComponent
                          name="walletType"
                          label="Wallet Type"
                          placeholder="Select Wallet Type"
                          data={[
                            { value: "POSTPAID", label: "POSTPAID" },
                            { value: "PREPAID", label: "PREPAID" },
                          ]}
                          withAsterisk
                          size="xs"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(20%-16px)]">
                        {/* <DropdownComponent
                          label="Report Type"
                          data={[
                            { value: "COMMISSION", label: "COMMISSION" },
                            { value: "CHARGE", label: "CHARGE" },
                          ]}
                          value={values.reportType}
                          withAsterisk
                          onChange={(value) =>
                            setFieldValue("reportType", value)
                          }
                          error={
                            touched.reportType && errors.reportType
                              ? errors.reportType
                              : ""
                          }
                          className="w-max"
                        /> */}
                        <FormikSelectComponent
                          name="reportType"
                          label="Report Type"
                          placeholder="Select Report Type"
                          allowDeselect
                          data={[
                            { value: "COMMISSION", label: "COMMISSION" },
                            { value: "CHARGE", label: "CHARGE" },
                          ]}
                          withAsterisk
                          size="xs"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(20%-16px)] flex justify-end items-end">
                        <ButtonComponent
                          title="View"
                          variant="filled"
                          fontSize={14}
                          onClick={() => {
                            setFieldValue("download", false);
                            handleSubmit();
                          }}
                          radius={29}
                          width={100}
                        />
                      </div>
                    </div>
                    {/* <div className="flex items-center justify-end w-full"> */}
                  </div>
                </div>
                {isCommissionReportList &&
                  isCommissionReportList.length > 0 && (
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
                          <ExportSvgIcon color={theme.palette.red.DEFAULT} />
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
                    data={
                      Array.isArray(isCommissionReportList)
                        ? isCommissionReportList
                        : [isCommissionReportList]
                    }
                    columns={filteredTableColumns}
                    showSearch={isSeacrh}
                    page={currentPage}
                    size={itemsPerPage}
                    onSearch={(columnKey, value) =>
                      handleSearchWithValues(columnKey, value, values)
                    }
                    onPageChange={setCurrentPage}
                    onPageSizeChange={(newSize) => {
                      setItemsPerPage(newSize);
                      setCurrentPage(1); // reset to first page when size changes
                    }}
                    serverSide={true}
                    totalRecords={totalRecords}
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

export default CommissionAndCharges;
