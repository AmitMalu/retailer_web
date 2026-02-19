import { GenericTableHeader, WalletReportParams, WalletReportTableType } from "@/Common/interface";
import { clearPagination, savePagination } from "@/Redux/Reducers/paginationSlice";
import { API_ROUTES } from "@/Services/apiRoutes";
import { useFetchList } from "@/Utils/CustomHooks/useFetchList";
import NewTextComponent from "@/components/Atoms/NewComponents/TextComponent";
import { useThrottledFormSubmit } from "@/Utils/CustomHooks/useThrottleFormSubmit";
import { dateRangeValidationSchema, decryptData, exportToCsv, formatYMDdate } from "@/Utils/helper";
import { DatesRangeValue } from "@mantine/dates";
import { useTheme } from "@mui/system";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Form, Formik, FormikProps } from "formik";
import { Grid, Loader } from "@mantine/core";
import FormikDateRangePicker from "@/components/Molecules/NewComponents/FormikDateRangePicker";
import { IconCalendar } from "@tabler/icons-react";
import FormikSelectComponent from "@/components/Molecules/NewComponents/FormikSelectComponent";
import { RefreshIcon } from "@/assets/svg";
import ButtonComponent from "@/components/Atoms/NewComponents/ButtonComponent";
import GenericMasterToolbar from "@/components/Molecules/GenericMasterToolbar";
import ShimmerTableRows from "@/components/Atoms/ShimmerTableRows";
import GenericMasterTable from "@/components/Molecules/GenericMasterTable";
import { useProductSubProduct } from "@/Utils/CustomHooks/useProductSubProduct";
import * as Yup from "yup"
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";

const KEY = "wallet_report"

const headers: GenericTableHeader<WalletReportTableType>[] = [
  { key: "tranxId", label: "Transaction ID", filterType: "text", copyable: true },
  { key: "productName", label: "Product Name", filterType: "text" },
  // { key: "subProductName", label: "Sub Product Name", filterType: "text" },
  { key: "schemeName", label: "Scheme Name", filterType: "text" },
  { key: "hierarchyId", label: "User ID", filterType: "text" },
  // { key: "outletName", label: "Outlet Name", filterType: "text" },
  // { key: "transactionType", label: "Transaction Type", filterType: "text" },
  // { key: "walletType", label: "Wallet Type", filterType: "boolean", filterOptions: walletTypeSelectData },
  { key: "balBefore", label: "Balance Before", filterType: "number" },
  { key: "amount", label: "Amount", filterType: "number" },
  { key: "balAfter", label: "Balance After", filterType: "number" },
  { key: "actionOnBalanceAmount", label: "Action On Balance Amount", filterType: "text" },
  { key: "status", label: "Status", filterType: "text" },
  { key: "transactionDate", label: "Transaction Date", filterType: "date" },
  { key: "transactionTime", label: "Transaction Time", filterType: "text" },
  { key: "narration", label: "Narration", filterType: "text" },
];

const validationSchema = Yup.object({
  dateRange: dateRangeValidationSchema,
})

const WalletReport = () => {

  const theme = useTheme()
  const dispatch = useDispatch();

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses.loginData)
    : null;

  const [payload, setPayload] = useState<any>(null);

  const formikRef = useRef<FormikProps<WalletReportTableType>>(null);
  const dataRef = useRef<WalletReportTableType[] | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    headers.map((h) => h.key as string)
  );
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [submittedFilter, setSubmittedFilter] = useState<Record<string, any> | null>(null);

  const [viewSubmitted, setViewSubmitted] = useState(false);

  const { data, loading, pagination, error, setPage, setPageSize } =
    useFetchList<WalletReportTableType>({
      method: "POST",
      key: KEY,
      url: viewSubmitted ? `${API_ROUTES.WALLET_REPORT}` : undefined,
      payload,
      refreshKey,
      sendPaginationIn: "body",
    });

  const transformPayload = (values: any) => {
    const [fromDate, toDate] = values.dateRange || [];
    return {

      fromDate: fromDate ? formatYMDdate(fromDate) : null,
      toDate: toDate ? formatYMDdate(toDate) : null,
      hierarchyType: values.hierarchyType || loginData?.hierarchyId?.split("-")[1] || "",
      hierarchyId: values.hierarchyId || loginData?.hierarchyId,
      productId: values?.productId ?? "",
      walletType: values.walletType ?? "",
      status: values.status ?? "ALL",
    }
  }

  const InitialValues: WalletReportParams = {
    dateRange: [
      moment().subtract(6, "days").toDate(), // from: 6 days ago
      moment().toDate(), // to: today
    ] as DatesRangeValue,
    hierarchyType: loginData?.hierarchyId?.split("-")[1] || "",
    hierarchyId: loginData?.hierarchyId,
    productId: "",
    subProductId: "",
    walletType: "",
    status: "",
  };

  const handleExportClick = () => {
    const currentData = dataRef.current;
    if (!currentData || currentData.length === 0) {
      toast.warning("No data available to export.");
      return;
    }
    exportToCsv(currentData, "Pending-Transaction-report");
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

    setPayload(transformPayload(InitialValues));
    setRefreshKey((prev) => prev + 1);

    // Reset Formik ONLY
    formikRef.current?.resetForm({
      values: InitialValues,
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
      ...transformPayload(values), // top filters
      ...(submittedFilter || {}),                      // 🔴 keep inline filters
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
      <NewTextComponent fontSize={22} color={theme.palette.red.DEFAULT} fontFamily="Inter" fontWeight={600}>
        WALLET REPORT
      </NewTextComponent>

      <Formik
        key={refreshKey}
        innerRef={formikRef}
        initialValues={InitialValues}
        validationSchema={validationSchema}
        onSubmit={throttledSubmit}
      >
        {() => {
          const {
            productDropdownData,
            loadingProductList,
            refetchProducts
          } = useProductSubProduct({});

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

                <Grid.Col span={{ base: 6, xs: 4, md: 4, lg: 2 }}>
                  <FormikSelectComponent
                    // key={values.productId}
                    name="productId"
                    label="Product"
                    // value={values.productId}
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

                <Grid.Col span={{ base: 6, xs: 4, md: 4, lg: 2 }}>
                  <FormikSelectComponent
                    name="walletType"
                    size="xs"
                    label="Wallet Type"
                    placeholder="Select Wallet Type"
                    allowDeselect={true}
                    data={[
                      { label: "PREPAID", value: "PREPAID" },
                      { label: "POSTPAID", value: "POSTPAID" },
                    ]}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 6, xs: 4, md: 4, lg: 2 }}>
                  <FormikSelectComponent
                    name="status"
                    size="xs"
                    label="Status"
                    allowDeselect={true}
                    placeholder="Status"
                    data={[
                      { label: "PENDING", value: "PENDING" },
                      { label: "SUCCESS", value: "SUCCESS" },
                      { label: "FAILURE", value: "FAILURE" },
                    ]}
                  />
                </Grid.Col>

                <Grid.Col span="auto">
                  <div className="flex justify-end items-center mt-4">
                    {<ButtonComponent
                      fontSize="14"
                      fullWidth={false}
                      radius={6}
                      size="sm"
                      borderColor="#fff"
                      variant="filled"
                      type="submit"
                      bgColor="#C30305"
                      textColor="#FFFFFF"
                    >
                      VIEW
                    </ButtonComponent>}
                  </div>
                </Grid.Col>
              </Grid>
            </Form>
          )
        }}
      </Formik>

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

      {loading ? (
        // Render shimmer
        <ShimmerTableRows rowCount={6} columnCount={headers.length} />
      ) : (
        <GenericMasterTable<WalletReportTableType>
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

export default WalletReport;
