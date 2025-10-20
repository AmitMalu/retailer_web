import { DownlineBalanceParams, DownlineBalanceTableType, GenericTableHeader } from "@/Common/interface";
import ButtonComponent from "@/components/Atoms/NewComponents/ButtonComponent";
import NewTextComponent from "@/components/Atoms/NewComponents/TextComponent";
import ShimmerTableRows from "@/components/Atoms/ShimmerTableRows";
import GenericMasterTable from "@/components/Molecules/GenericMasterTable";
import GenericMasterToolbar from "@/components/Molecules/GenericMasterToolbar";
import FormikDateRangePicker from "@/components/Molecules/NewComponents/FormikDateRangePicker";
import { clearPagination, savePagination } from "@/Redux/Reducers/paginationSlice";
import { RootState } from "@/Redux/Store";
// import { Single_Hierarchy_Child_List } from "@/Services/api";
import { API_ROUTES } from "@/Services/apiRoutes";
import { useFetchList } from "@/Utils/CustomHooks/useFetchList";
import { useThrottledFormSubmit } from "@/Utils/CustomHooks/useThrottleFormSubmit";
// import { handleCustomError } from "@/Utils/handleCustomError";
import { dateRangeValidationSchema, decryptData, exportToCsv, formatYMDdate } from "@/Utils/helper";
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

const DOWNLINE_BALANCE_KEY = "downline-balance-report"

const DownLineBalance = () => {

  const dispatch = useDispatch();
  const theme = useTheme()
  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses.loginData)
    : null;

  const dataRef = useRef<DownlineBalanceTableType[] | null>(null);
  // const isFetchingRef = useRef(false);

  const [payload, setPayload] = useState<any>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [submittedFilter, setSubmittedFilter] = useState<Record<string, any> | null>(null);
  const [viewSubmitted, setViewSubmitted] = useState(false);

  const [refreshKey, setRefreshKey] = useState<number>(0);

  const headers: GenericTableHeader<DownlineBalanceTableType>[] = [
    { key: "userId", label: "User Id", filterType: "text" },
    { key: "name", label: "Name", filterType: "text" },
    { key: "parentAccount", label: "Parent Account", filterType: "text" },
    { key: "prepaidBalance", label: "Prepaid Balance", filterType: "number" },
    { key: "postpaidBalance", label: "Postpaid Balance", filterType: "number" },
    { key: "createdOn", label: "Created On", filterType: "date" },
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
  } = useFetchList<DownlineBalanceTableType>({
    method: "POST",
    key: DOWNLINE_BALANCE_KEY,
    url: viewSubmitted ? `${API_ROUTES.DOWNLINE_BALANCE_REPORT}/${loginData?.hierarchyId}` : undefined,
    payload: payload,
    sendPaginationIn: "params",
  });


  const initialValues: DownlineBalanceParams = {
    dateRange: [
      moment().subtract(6, "days").toDate(), // from: 6 days ago
      moment().toDate(), // to: today
    ] as DatesRangeValue,
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
    exportToCsv(currentData, "Downline-Balance-report");
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilterSubmit = (key: string, value: any) => {
    dispatch(
      savePagination({
        key: DOWNLINE_BALANCE_KEY,
        pagination: { ...pagination, currentPage: 1, pageSize: pagination.pageSize },
      })
    );
    setSubmittedFilter((prev) => ({ ...prev, [key]: value }));
  };

  const handleRefresh = () => {
    dispatch(clearPagination({ key: DOWNLINE_BALANCE_KEY }));
    setFilterValues({});
    setSubmittedFilter(null);
    setRefreshKey((prev) => prev + 1);
    setFilterVisible(false);
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
      dispatch(clearPagination({ key: DOWNLINE_BALANCE_KEY }))
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
        DOWNLINE BALANCE REPORT
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

                <Grid.Col span="auto">
                  <div className="flex justify-end items-end h-full gap-2 ">
                    <GenericMasterToolbar
                      onRefresh={handleRefresh}
                      onExport={handleExportClick}
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
                      borderColor="#fff"
                      variant="filled"
                      type="submit"
                      bgColor="#C30305"
                      textColor="#FFFFFF"
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
        <GenericMasterTable<DownlineBalanceTableType>
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

export default DownLineBalance;
