import { GenericTableHeader, NetworkTransactionParams, NetworkTransactionTableType } from "@/Common/interface";
import ButtonComponent from "@/components/Atoms/NewComponents/ButtonComponent";
import NewTextComponent from "@/components/Atoms/NewComponents/TextComponent";
import ShimmerTableRows from "@/components/Atoms/ShimmerTableRows";
import GenericMasterTable from "@/components/Molecules/GenericMasterTable";
import GenericMasterToolbar from "@/components/Molecules/GenericMasterToolbar";
import FormikDateRangePicker from "@/components/Molecules/NewComponents/FormikDateRangePicker";
import { clearPagination, savePagination } from "@/Redux/Reducers/paginationSlice";
import { API_ROUTES } from "@/Services/apiRoutes";
import { useFetchList } from "@/Utils/CustomHooks/useFetchList";
import { useThrottledFormSubmit } from "@/Utils/CustomHooks/useThrottleFormSubmit";
import { dateRangeValidationSchema, exportToCsv, formatYMDdate } from "@/Utils/helper";
import { Grid } from "@mantine/core";
import { DatesRangeValue } from "@mantine/dates";
import { useTheme } from "@mui/system";
import { IconCalendar } from "@tabler/icons-react";
import { Form, Formik } from "formik";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from 'yup'
import { toast } from "react-toastify";

const NTW_TRANX_KEY = "network_transaction_report"

const NetworkTransaction = () => {

  const dispatch = useDispatch();
  const theme = useTheme()

  const dataRef = useRef<NetworkTransactionTableType[] | null>(null);

  const [payload, setPayload] = useState<any>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [submittedFilter, setSubmittedFilter] = useState<Record<string, any> | null>(null);
  const [viewSubmitted, setViewSubmitted] = useState(false);

  const [refreshKey, setRefreshKey] = useState<number>(0);

  const headers: GenericTableHeader<NetworkTransactionTableType>[] = [
    { key: "transactionDate", label: "Transaction Date", filterType: "date" },
    { key: "hierarchyId", label: "Hierarchy ID", filterType: "text", copyable: true },
    { key: "mobileNo", label: "Mobile No.", filterType: "text" },
    { key: "productName", label: "Product Name", filterType: "text" },
    { key: "walletType", label: "Wallet Type", filterType: "text" },
    { key: "transactionType", label: "Tx Mode", filterType: "text" },
    { key: "tranxId", label: "Transaction ID", filterType: "text", copyable: true },
    { key: "amount", label: "Amount", filterType: "number" },
    { key: "status", label: "Transaction Status", filterType: "text" },
    { key: "bankReferenceNo", label: "Bank Reference No", filterType: "text" },
    { key: "vendorTransactionId", label: "Vendor Transaction ID", filterType: "text" },
    { key: "narration", label: "Narration", filterType: "text" },
    { key: "balBefore", label: "Balance Before", filterType: "number" },
    { key: "balAfter", label: "Balance After", filterType: "number" },
    { key: "actionOnBalanceAmount", label: "Action On Balance Amount", filterType: "text" },
    { key: "transactionTime", label: "Transaction Time", filterType: "text" },
  ];

  const transformPayload = (values: any) => {
    const [fromDate, toDate] = values.dateRange || [];
    return {
      fromDate: fromDate ? formatYMDdate(fromDate) : null,
      toDate: toDate ? formatYMDdate(toDate) : null,
    }
  }

  const {
    data, loading, pagination, error, setPage, setPageSize
  } = useFetchList<NetworkTransactionTableType>({
    method: "POST",
    key: NTW_TRANX_KEY,
    url: viewSubmitted ? `${API_ROUTES.NETWORK_TRANSACTION_REPORT}` : undefined,
    payload: payload,
    refreshKey,
  });

  const initialValues: NetworkTransactionParams = {
    dateRange: [
      moment().subtract(6, "days").toDate(), // from: 6 days ago
      moment().toDate(), // to: today
    ] as DatesRangeValue,
  };

  const validationSchema = Yup.object({
    dateRange: dateRangeValidationSchema
  })

  const [formValues, setFormValues] = useState(initialValues);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    headers.map((h) => h.key as string)
  );

  const handleExportClick = () => {
    const currentData = dataRef.current;
    if (!currentData || currentData.length === 0) {
      toast.warning("No data available to export.");
      return;
    }
    exportToCsv(currentData, "Network-Transaction-report");
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilterSubmit = (key: string, value: any) => {
    dispatch(
      savePagination({
        key: NTW_TRANX_KEY,
        pagination: { ...pagination, currentPage: 1, pageSize: pagination.pageSize },
      })
    );
    setSubmittedFilter((prev) => ({ ...prev, [key]: value }));
  };

  const handleRefresh = () => {
    dispatch(clearPagination({ key: NTW_TRANX_KEY }));
    setFilterValues({});
    setVisibleColumns(headers.map((h) => h.key as string));
    setSubmittedFilter(null);
    setFormValues(initialValues);
    setPayload(transformPayload(initialValues));
    setViewSubmitted(true);
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
    const basePayload = transformPayload(values);
    const cleanedFilter = submittedFilter
      ? Object.fromEntries(
          Object.entries(submittedFilter).filter(
            ([, v]) => v !== "" && v !== null && v !== undefined
          )
        )
      : {};
    setPayload({ ...basePayload, ...cleanedFilter });
    setViewSubmitted(true);
  }, 3000);

  useEffect(() => {
    return () => {
      setFormValues(initialValues); // Reset form data on unmount
      dispatch(clearPagination({ key: NTW_TRANX_KEY }));
    }
  }, []);

  useEffect(() => {
    if (submittedFilter) {
      const cleanedFilter = Object.fromEntries(
        Object.entries(submittedFilter).filter(
          ([, v]) => v !== "" && v !== null && v !== undefined
        )
      );
      setPayload((prev: any) => ({ ...prev, ...cleanedFilter }));
    }
  }, [submittedFilter])

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  return (
    <div className="w-full">
      <NewTextComponent fontSize={22} color={theme.palette.primary.main} fontFamily="Inter" fontWeight={600}>
        Network Transaction Report
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
                </Grid.Col>
              </Grid>
            </Form>
          )
        }}
      </Formik>

      {loading ? (
        // Render shimmer
        <ShimmerTableRows rowCount={6} columnCount={headers.length} />
      ) : (
        <GenericMasterTable<NetworkTransactionTableType>
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

    </div>
  )
}

export default NetworkTransaction
