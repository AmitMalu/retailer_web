import { FundLoadingParams, FundLoadingTableType, GenericTableHeader } from "@/Common/interface";
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
import { Form, Formik } from "formik";
import { Grid } from "@mantine/core";
import FormikDateRangePicker from "@/components/Molecules/NewComponents/FormikDateRangePicker";
import { IconCalendar } from "@tabler/icons-react";
import ButtonComponent from "@/components/Atoms/NewComponents/ButtonComponent";
import GenericMasterToolbar from "@/components/Molecules/GenericMasterToolbar";
import ShimmerTableRows from "@/components/Atoms/ShimmerTableRows";
import GenericMasterTable from "@/components/Molecules/GenericMasterTable";
import * as Yup from "yup"
import { RootState } from "@/Redux/Store";
import { useSelector } from "react-redux";

const KEY = "Fund_Loading_Report"

const FundLoading = () => {

  const dispatch = useDispatch();
  const theme = useTheme()
  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const dataRef = useRef<FundLoadingTableType[] | null>(null);

  const [payload, setPayload] = useState<any>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [submittedFilter, setSubmittedFilter] = useState<Record<string, any> | null>(null);
  const [viewSubmitted, setViewSubmitted] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const headers: GenericTableHeader<FundLoadingTableType>[] = [
    { key: "paymentMode", label: "Deposit Type", filterType: "text" },
    { key: "bankTranId", label: "Transaction ID", filterType: "text" },
    { key: "depositAmount", label: "Amount", filterType: "amount" },
    { key: "bankAccountNumber", label: "Account Number", filterType: "number" },
    { key: "depositDate", label: "Deposit Date", filterType: "date" },
    {
      key: "depositeImage",
      label: "Deposit Slip",
      filterType: "text",
      renderType: "link",
    },
    { key: "requestedBy", label: "Requested By", filterType: "none" },
    { key: "ipAddress", label: "Client IP", filterType: "text" },
    { key: "mobileNumber", label: "Partner Mobile Number", filterType: "number" },
    {
      key: "status",
      label: "Request Status",
      filterType: "boolean",
      filterOptions: [
        { label: "PENDING", value: "pending" },
        { label: "APPROVE", value: "approve" },
        { label: "REJECT", value: "reject" },
      ],
    },
    { key: "remarks", label: "Remark", filterType: "text", copyable: true },
    { key: "createDateTime", label: "Created Date Time", filterType: "date" },
    {
      key: "approveOrRejectDate",
      label: "Approve Or Reject Date ",
      filterType: "date",
    },
    {
      key: "approveOrRejectTime",
      label: "Approve Or Reject Time",
      filterType: "time",
    },
  ];

  const transformPayload = (values: any) => {
    const [fromDate, toDate] = values.dateRange || [];
    return {
      fromDate: fromDate ? formatYMDdate(fromDate) : null,
      toDate: toDate ? formatYMDdate(toDate) : null,
      requestedBy: loginData?.hierarchyId || "",
    }
  }

  const { data, loading, pagination, error, setPage, setPageSize } =
    useFetchList<FundLoadingTableType>({
      method: "GET",
      key: KEY,
      url: viewSubmitted ? `${API_ROUTES.FUND_LOADING_REPORT}` : undefined,
      filter: payload,
      refreshKey,
      sendPaginationIn: "params",
    });

  const InitialValues: FundLoadingParams = {
    dateRange: [
      moment().subtract(6, "days").toDate(), // from: 6 days ago
      moment().toDate(), // to: today
    ] as DatesRangeValue,
    requestedBy: loginData?.hierarchyId || "",
  };

  const validationSchema = Yup.object({
    dateRange: dateRangeValidationSchema,
  })

  const [formValues, setFormValues] = useState(InitialValues);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    headers.map((h) => h.key as string)
  );

  const handleExportClick = () => {
    const currentData = dataRef.current;
    if (!currentData || currentData.length === 0) {
      toast.warning("No data available to export.");
      return;
    }
    exportToCsv(currentData, "Fund-loading-report");
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


  const handleRefresh = () => {
    dispatch(clearPagination({ key: KEY }));
    setFilterValues({});
    setVisibleColumns(headers.map((h) => h.key as string));
    setSubmittedFilter(null);
    setPayload(transformPayload(InitialValues));
    setRefreshKey((prev) => prev + 1);
    setFilterVisible(false);
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


  const throttledSubmit = useThrottledFormSubmit((values: any) => {
    setFormValues(values);
    const payload = transformPayload(values);
    setPayload(payload);
    setRefreshKey((prev) => prev + 1);
    setViewSubmitted(true);
  }, 3000);

  useEffect(() => {
    return () => {
      setFormValues(InitialValues); // Reset form data on unmount
      dispatch(clearPagination({ key: KEY }));
    }
  }, []);

  useEffect(() => {
    if (submittedFilter) {
      setPayload((prev: any) => ({ ...prev, ...submittedFilter }));
    }
  }, [submittedFilter])

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  return (
    <div className="w-full">
      <NewTextComponent fontSize={22} color={theme.palette.primary.main} fontFamily="Inter" fontWeight={600}>
        FUND LOADING REPORT
      </NewTextComponent>

      <Formik
        initialValues={formValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={throttledSubmit}
      >
        {() => {

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

                <Grid.Col span="auto">
                  <div className="flex justify-end items-center mt-4">
                    {<ButtonComponent
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
        <GenericMasterTable<FundLoadingTableType>
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

export default FundLoading;
