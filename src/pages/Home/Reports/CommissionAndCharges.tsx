import { useEffect, useRef, useState } from "react";
import { Form, Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { CommissionAndChargesParams, CommissionAndChargeTableType, GenericTableHeader } from "@/Common/interface";
import {
  dateRangeValidationSchema,
  decryptData,
  exportToCsv,
  formatYMDdate,
  walletTypeSelectData,
} from "@/Utils/helper";
import { Grid, Loader } from "@mantine/core";
import { useTheme } from "@mui/system";
import NewTextComponent from "@/components/Atoms/NewComponents/TextComponent";
import { RefreshIcon } from "@/assets/svg";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import FormikDateRangePicker from "@/components/Molecules/NewComponents/FormikDateRangePicker";
import { DatesRangeValue } from "@mantine/dates";
import moment from "moment";
import FormikSelectComponent from "@/components/Molecules/NewComponents/FormikSelectComponent";
// import { useHierarchySubHierarchy } from "@/Utils/CustomHooks/useHierarchySubHierarchy";
import { useDispatch } from "react-redux";
import { useFetchList } from "@/Utils/CustomHooks/useFetchList";
import { API_ROUTES } from "@/Services/apiRoutes";
import { useThrottledFormSubmit } from "@/Utils/CustomHooks/useThrottleFormSubmit";
import { clearPagination, savePagination } from "@/Redux/Reducers/paginationSlice";
import { IconCalendar } from "@tabler/icons-react";
import GenericMasterToolbar from "@/components/Molecules/GenericMasterToolbar";
import ButtonComponent from "@/components/Atoms/NewComponents/ButtonComponent";
import { toast } from "react-toastify";
import GenericMasterTable from "@/components/Molecules/GenericMasterTable";
import ShimmerTableRows from "@/components/Atoms/ShimmerTableRows";
import { useProductSubProduct } from "@/Utils/CustomHooks/useProductSubProduct";

const KEY = "commision_and_charge_report"

const headers: GenericTableHeader<CommissionAndChargeTableType>[] = [
  { key: "txId", label: "Transaction ID", filterType: "text", copyable: true },
  { key: "productName", label: "Product Name", filterType: "text" },
  // { key: "subProductName", label: "Sub Product Name", filterType: "text" },
  { key: "hierarchyId", label: "User ID", filterType: "text" },
  { key: "walletType", label: "Wallet Type", filterType: "boolean", filterOptions: walletTypeSelectData }, // Could add options if needed
  { key: "txType", label: "Transaction Type", filterType: "text" },
  // { key: "operator", label: "Operator", filterType: "text" },
  { key: "balBefore", label: "Balance Before", filterType: "number" },
  { key: "amount", label: "Amount", filterType: "number" },
  { key: "balAfter", label: "Balance After", filterType: "number" },
  { key: "transactionDate", label: "Transaction Date", filterType: "date" },
  { key: "transactionTime", label: "Transaction Time", filterType: "text" },
  { key: "narration", label: "Narration", filterType: "text" },
];

const validationSchema = Yup.object({
  dateRange: dateRangeValidationSchema,
});

const CommissionAndCharges = () => {
  const theme = useTheme()
  const dispatch = useDispatch();

  const transformPayload = (values: any, loginData: any) => {
    const [fromDate, toDate] = values.dateRange || [];
    return {
      fromDate: fromDate ? formatYMDdate(fromDate) : null,
      toDate: toDate ? formatYMDdate(toDate) : null,
      // Use own hierarchy code and ID instead of selection
      hierarchyType: loginData?.hierarchyId?.split("-")?.[1] || "",
      hierarchyId: loginData?.hierarchyId || "",
      // hierarchyType: values.hierarchyType ?? "",
      // hierarchyId: values.hierarchyId ?? "",
      walletType: values.walletType ?? "",
      productId: values.productId ?? "",
      reportType: values.reportType ? values.reportType : "CHARGE_COMMISSION",
    }
  }

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const [payload, setPayload] = useState<any>(null);

  const formikRef = useRef<FormikProps<CommissionAndChargesParams>>(null);
  const dataRef = useRef<CommissionAndChargeTableType[] | null>(null);

  const [refreshKey, setRefreshKey] = useState<number>(0);

  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    headers.map((h) => h.key as string)
  );
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [submittedFilter, setSubmittedFilter] = useState<Record<string, any> | null>(null);

  const [viewSubmitted, setViewSubmitted] = useState(false);

  const {
    data, loading, pagination, error, setPage, setPageSize
  } = useFetchList<CommissionAndChargeTableType>({
    method: "POST",
    key: KEY,
    url: viewSubmitted ? `${API_ROUTES.COMMISSION_AND_CHARGES}` : undefined,
    payload: payload,
    refreshKey,
    sendPaginationIn: "body",
  });

  // const myHierarchyCode = loginData?.hierarchyId?.split("-")[1];
  // const hierarchyOrder = ["SA", "AD", "ET", "WL", "SD", "PT", "DT", "RT"];
  // const myLevelIndex = hierarchyOrder.indexOf(myHierarchyCode);

  const initialValues: CommissionAndChargesParams = {
    hierarchyType: loginData?.hierarchyId?.split("-")?.[1] || "",
    hierarchyId: "",
    dateRange: [
      moment().subtract(6, "days").toDate(), // from: 6 days ago
      moment().toDate(), // to: today
    ] as DatesRangeValue,
    productId: "",
    walletType: "",
    reportType: "",
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleExportClick = () => {
    const currentData = dataRef.current;
    if (!currentData || currentData.length === 0) {
      toast.warning("No data available to export.");
      return;
    }
    exportToCsv(currentData, "commission-and-charges-report");
  };

  const handleToggleColumn = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleToggleAllColumns = (selectAll: boolean) => {
    if (selectAll) {
      setVisibleColumns(headers.map((h) => h.key as string));
    } else {
      setVisibleColumns([]);
    }
  };

  const handleRefresh = () => {
    // Reset redux pagination / master state
    dispatch(clearPagination({ key: KEY }));

    // Reset table view state
    setVisibleColumns(headers.map((h) => h.key as string));
    setFilterVisible(false);
    setFilterValues({});
    setSubmittedFilter(null);

    setPayload(transformPayload(initialValues, loginData));
    setRefreshKey((prev) => prev + 1);

    // Reset Formik ONLY
    formikRef.current?.resetForm({
      values: initialValues,
    });
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilterSubmit = (key: string, value: any) => {
    dispatch(
      savePagination({
        key: KEY,
        pagination: { ...pagination, currentPage: 1, pageSize: pagination.pageSize },
      })
    );
    setSubmittedFilter((prev) => ({ ...prev, [key]: value }));
  };

  const throttledSubmit = useThrottledFormSubmit((values: any) => {
    setPayload(() => ({
      ...transformPayload(values, loginData),
      ...(submittedFilter || {}),
    }));

    setViewSubmitted(true);
  }, 3000);


  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    if (submittedFilter) {
      setPayload((prev: any) => ({ ...prev, ...submittedFilter }));
    }
  }, [submittedFilter])


  return (
    <div className="w-full">
      <NewTextComponent fontSize={22} color={theme.palette.primary.main} fontFamily="Inter" fontWeight={600}>
        Commission & Charges Report
      </NewTextComponent>

      <Formik
        key={refreshKey}
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={throttledSubmit}
      >
        {() => {

          // const { hierarchyList, loadingHierarchyList, subHierarchyList, loadingSubHierarchyList, subHierarchyKey, refetchHierarchy } = useHierarchySubHierarchy({
          //   selectedHierarchyCode: values.hierarchyType,
          //   onSubHierarchyReset: () => setFieldValue("hierarchyId", "")
          // })

          const {
            productDropdownData,
            loadingProductList,
            refetchProducts
          } = useProductSubProduct({});

          // const filteredHierarchyList = hierarchyList?.filter(
          //   (item: any) => hierarchyOrder.indexOf(item?.value) >= myLevelIndex
          // );

          return (
            <Form className="flex flex-col gap-2 mt-4">
              <Grid gutter="sm">

                <Grid.Col span={{ base: 6, xs: 4, md: 4, lg: 2.5 }}>
                  <FormikDateRangePicker
                    name="dateRange"
                    label="Date Range"
                    placeholder="Select Date Range"
                    size="xs"
                    shortcuts
                    required
                    leftIcon={<IconCalendar size={16} />}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 6, xs: 4, md: 4, lg: 2.5 }}>
                  <FormikSelectComponent
                    // key={values.productId}
                    name="productId"
                    label="Product"
                    placeholder="Select Product"
                    searchable={true}
                    nothingFoundMessage="No Product Found"
                    size="xs"
                    // withAsterisk
                    // required
                    allowDeselect={true}
                    data={productDropdownData}
                    disabled={loadingProductList}
                    rightSection={
                      <>
                        {loadingProductList && (
                          <Loader size={14} color="blue" />
                        )}
                        {!loadingProductList && productDropdownData.length < 1 && (
                          <div
                            onClick={refetchProducts}
                            className="cursor-pointer"
                            style={{ pointerEvents: "auto", display: "flex", alignItems: "center" }}
                            title="Refresh Products"
                          >
                            <RefreshIcon />
                          </div>
                        )}
                      </>
                    }
                  />
                </Grid.Col>

                {/* <Grid.Col span={{ base: 4, xs: 4, md: 4, lg: 2 }}>
                  <FormikSelectComponent
                    name="hierarchyType"
                    size="xs"
                    label="Hierarchy Type"
                    placeholder="Select Hierarchy Type"
                    nothingFoundMessage="No Hierarchy Found"
                    data={filteredHierarchyList || []}
                    disabled={loadingHierarchyList}
                    searchable={true}
                    // withAsterisk
                    // required
                    // allowDeselect={true}
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
                </Grid.Col> */}

                {/* <Grid.Col span={{ base: 4, xs: 4, md: 4, lg: 2.5 }}>
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
                    // withAsterisk
                    // required
                    allowDeselect={true}
                    searchable={true}
                    nothingFoundMessage="Nothing Found"
                    disabled={loadingSubHierarchyList}
                  />
                </Grid.Col> */}

                <Grid.Col span={{ base: 4, xs: 4, md: 4, lg: 2 }}>
                  <FormikSelectComponent
                    name="walletType"
                    label="Wallet Type"
                    placeholder="Select Wallet Type"
                    data={[
                      { value: "POSTPAID", label: "POSTPAID" },
                      { value: "PREPAID", label: "PREPAID" },
                    ]}
                    // withAsterisk
                    // required
                    allowDeselect={true}
                    size="xs"
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 4, xs: 4, md: 4, lg: 2 }}>
                  <FormikSelectComponent
                    name="reportType"
                    label="Report Type"
                    placeholder="Select Report Type"
                    data={[
                      { value: "COMMISSION", label: "COMMISSION" },
                      { value: "CHARGE", label: "CHARGE" },
                    ]}
                    // withAsterisk
                    // required
                    allowDeselect={true}
                    size="xs"
                  />
                </Grid.Col>

                <Grid.Col span="auto" style={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
                  <div>
                    <ButtonComponent
                      fontSize="14"
                      fullWidth={false}
                      radius={6}
                      size="sm"
                      variant="filled"
                      type="submit"
                      bgColor={theme.palette.primary.main}
                      textColor="white"
                    >
                      VIEW
                    </ButtonComponent>
                  </div>
                </Grid.Col>̥
              </Grid>

              <GenericMasterToolbar
                onRefresh={handleRefresh}
                onExport={handleExportClick}
                onColumnChange={handleToggleColumn}
                visibleColumns={visibleColumns}
                onToggleAll={handleToggleAllColumns}
                onFilter={() => setFilterVisible((prev) => !prev)}
                headers={headers}
                loading={loading}
                error={error ? error.toString() : null}
              />
            </Form>
          );
        }}
      </Formik>

      {loading ? (
        // Render shimmer
        <ShimmerTableRows rowCount={6} columnCount={headers.length} />
      ) : (
        <GenericMasterTable<CommissionAndChargeTableType>
          data={data}
          headers={headers.filter((h) =>
            visibleColumns.includes(h.key as string)
          )}
          pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          pageSize={pagination.pageSize}
          message={`Showing page ${pagination.currentPage} of ${pagination.totalPages}`}
          filterVisible={filterVisible}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          onFilterSubmit={handleFilterSubmit}
        />
      )}
    </div >
  );
};

export default CommissionAndCharges;
