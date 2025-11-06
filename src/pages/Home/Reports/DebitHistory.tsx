import { DebitHistoryParams, DebitHistoryTableType, GenericTableHeader } from "@/Common/interface";
import ButtonComponent from "@/components/Atoms/NewComponents/ButtonComponent";
import NewTextComponent from "@/components/Atoms/NewComponents/TextComponent";
import ShimmerTableRows from "@/components/Atoms/ShimmerTableRows";
import GenericMasterTable from "@/components/Molecules/GenericMasterTable";
import GenericMasterToolbar from "@/components/Molecules/GenericMasterToolbar";
import FormikDateRangePicker from "@/components/Molecules/NewComponents/FormikDateRangePicker";
import FormikSelectComponent from "@/components/Molecules/NewComponents/FormikSelectComponent";
import { savePagination } from "@/Redux/Reducers/paginationSlice";
import { RootState } from "@/Redux/Store";
// import { Single_Hierarchy_Child_List } from "@/Services/api";
import { API_ROUTES } from "@/Services/apiRoutes";
import { useFetchList } from "@/Utils/CustomHooks/useFetchList";
import { useThrottledFormSubmit } from "@/Utils/CustomHooks/useThrottleFormSubmit";
// import { handleCustomError } from "@/Utils/handleCustomError";
import { dateRangeValidationSchema, decryptData, exportToCsv, formatYMDdate, walletTypeSelectData } from "@/Utils/helper";
import { Grid } from "@mantine/core";
import { DatesRangeValue } from "@mantine/dates";
import { useTheme } from "@mui/system";
import { IconCalendar } from "@tabler/icons-react";
import { Form, Formik } from "formik";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from 'yup'

const DEBIT_HISTORY_KEY = "debit_history_report"

const DebitHistory = () => {

  const dispatch = useDispatch();
  const theme = useTheme()
  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses.loginData)
    : null;

  const dataRef = useRef<DebitHistoryTableType[] | null>(null);
  // const isFetchingRef = useRef(false);

  const [payload, setPayload] = useState<any>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [submittedFilter, setSubmittedFilter] = useState<Record<string, any> | null>(null);
  const [viewSubmitted, setViewSubmitted] = useState(false);

  const headers: GenericTableHeader<DebitHistoryTableType>[] = [
    { key: "transactionId", label: "Transaction ID", filterType: "text", copyable: true },
    { key: "transactionType", label: "Transaction Type", filterType: "text" },
    { key: "service", label: "Service", searchable: false },
    { key: "balBeforeTran", label: "Balance Before", filterType: "number" },
    { key: "amount", label: "Amount", filterType: "number" },
    { key: "balAfterTran", label: "Balance After", filterType: "number" },
    { key: "finalBalance", label: "Final Balance", filterType: "number" },
    { key: "dateOfTransaction", label: "Transaction Date", filterType: "date" },
    { key: "timeOfTransaction", label: "Transaction Time", filterType: "text" },
    { key: "narration", label: "Narration", filterType: "text" },
  ];

  const transformPayload = (values: any) => {
    const [fromDate, toDate] = values.dateRange || [];
    return {

      fromDate: fromDate ? formatYMDdate(fromDate) : null,
      toDate: toDate ? formatYMDdate(toDate) : null,
      hierarchyType: values.hierarchyType || loginData?.hierarchyId?.split("-")[1] || "",
      hierarchyId: values.hierarchyId || loginData?.hierarchyId,
      walletType: values.walletType ?? "",
      service: 'DEBIT',
    }
  }

  const {
    data, loading, pagination, error, setPage, setPageSize
  } = useFetchList<DebitHistoryTableType>({
    method: "POST",
    key: DEBIT_HISTORY_KEY,
    url: viewSubmitted ? `${API_ROUTES.DEBIT_HISTORY_REPORT}` : undefined,
    payload: payload,
    sendPaginationIn: "params",
  });

  const initialValues: DebitHistoryParams = {
    dateRange: [
      moment().subtract(6, "days").toDate(), // from: 6 days ago
      moment().toDate(), // to: today
    ] as DatesRangeValue,
    hierarchyType: loginData?.hierarchyId?.split("-")[1] || "",
    hierarchyId: loginData?.hierarchyId,
    walletType: "",
  };

  const validationSchema = Yup.object({
    dateRange: dateRangeValidationSchema
  })

  const [formValues, setFormValues] = useState(initialValues);

  const handleExportClick = () => {
    const currentData = dataRef.current;
    if (!currentData || currentData.length === 0) {
      toast.warning("No data available to export.");
      return;
    }
    exportToCsv(currentData, "Debit-History-report");
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilterSubmit = (key: string, value: any) => {
    dispatch(
      savePagination({
        key: DEBIT_HISTORY_KEY,
        pagination: { ...pagination, currentPage: 1, pageSize: pagination.pageSize },
      })
    );
    setSubmittedFilter((prev) => ({ ...prev, [key]: value }));
  };

  const throttledSubmit = useThrottledFormSubmit((values: any) => {
    setFormValues(values);
    const payload = transformPayload(values);
    setPayload(payload);
    setViewSubmitted(true);
  }, 3000);

  useEffect(() => {
    return () => {
      setFormValues(initialValues); // Reset form data on unmount
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
      <NewTextComponent fontSize={22} color={theme.palette.red.DEFAULT} fontFamily="Inter" fontWeight={600}>
        DEBIT HISTORY REPORT
      </NewTextComponent>

      <Formik
        initialValues={formValues}
        validationSchema={validationSchema}
        enableReinitialize
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

                <Grid.Col span={{ base: 4, xs: 4, md: 4, lg: 2 }}>
                  <FormikSelectComponent
                    name="walletType"
                    size="xs"
                    required
                    label="Wallet Type"
                    placeholder="Select Wallet Type"
                    allowDeselect={true}
                    nothingFoundMessage="Nothing Found"
                    data={walletTypeSelectData}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 6, xs: 4, md: 4, lg: 1.5 }}>
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

                <Grid.Col span="auto">
                  <div className="flex justify-end items-end h-full">
                    <GenericMasterToolbar
                      onExport={handleExportClick}
                      onFilter={() => setFilterVisible((prev) => !prev)}
                      headers={headers}
                      loading={loading}
                      error={error ? error.toString() : null}
                    />
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
        <GenericMasterTable<DebitHistoryTableType>
          data={data}
          headers={headers}
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

export default DebitHistory;
