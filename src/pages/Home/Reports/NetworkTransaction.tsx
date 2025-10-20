import { GenericTableHeader, NetworkTransactionParams, NetworkTransactionTableType } from "@/Common/interface";
import ButtonComponent from "@/components/Atoms/NewComponents/ButtonComponent";
import NewTextComponent from "@/components/Atoms/NewComponents/TextComponent";
import ShimmerTableRows from "@/components/Atoms/ShimmerTableRows";
import GenericMasterTable from "@/components/Molecules/GenericMasterTable";
import GenericMasterToolbar from "@/components/Molecules/GenericMasterToolbar";
import FormikDateRangePicker from "@/components/Molecules/NewComponents/FormikDateRangePicker";
import FormikSelectComponent from "@/components/Molecules/NewComponents/FormikSelectComponent";
import { clearPagination, savePagination } from "@/Redux/Reducers/paginationSlice";
import { RootState } from "@/Redux/Store";
import { Single_Hierarchy_Child_List } from "@/Services/api";
import { API_ROUTES } from "@/Services/apiRoutes";
import { useFetchList } from "@/Utils/CustomHooks/useFetchList";
import { useThrottledFormSubmit } from "@/Utils/CustomHooks/useThrottleFormSubmit";
import { handleCustomError } from "@/Utils/handleCustomError";
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
import * as Yup from 'yup'
import { toast } from "react-toastify";

const NTW_TRANX_KEY = "network_transaction_report"

const NetworkTransaction = () => {

  const dispatch = useDispatch();
  const theme = useTheme()
  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses.loginData)
    : null;

  const dataRef = useRef<NetworkTransactionTableType[] | null>(null);
  const isFetchingRef = useRef(false);

  const [payload, setPayload] = useState<any>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [submittedFilter, setSubmittedFilter] = useState<Record<string, any> | null>(null);
  const [viewSubmitted, setViewSubmitted] = useState(false);

  const [refreshKey, setRefreshKey] = useState<number>(0);

  const [loadingState, setLoadingState] = useState({
    WL: false,
    SD: false,
    PT: false,
    DT: false,
    RT: false,
  });

  const headers: GenericTableHeader<NetworkTransactionTableType>[] = [
    { key: "tranxId", label: "Transaction ID", filterType: "text" },
    { key: "subProductName", label: "Sub Product Name", filterType: "text" },
    // { key: "operator", label: "Operator", filterType: "text" },
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

  const transformPayload = (values: any) => {
    const [fromDate, toDate] = values.dateRange || [];
    return {

      fromDate: fromDate ? formatYMDdate(fromDate) : null,
      toDate: toDate ? formatYMDdate(toDate) : null,
      loginHierarchyId: values.loginHierarchyId || loginData?.hierarchyId,
      subProductName: values.subProductName,
      whitelabelId: values.whitelabelId,
      superDistributorId: values.superDistributorId,
      partnerId: values.partnerId,
      distributorId: values.distributorId,
      retailerId: values.retailerId,
      reportType: values.reportType,
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
    sendPaginationIn: "body",
  });

  const initialValues: NetworkTransactionParams = {
    loginHierarchyId: loginData?.hierarchyId,
    dateRange: [
      moment().subtract(6, "days").toDate(), // from: 6 days ago
      moment().toDate(), // to: today
    ] as DatesRangeValue,
    whitelabelId: loginData?.role === "WL" ? loginData?.hierarchyId : "",
    superDistributorId: loginData?.role === "SD" ? loginData?.hierarchyId : "",
    partnerId: loginData?.role === "PT" ? loginData?.hierarchyId : "",
    distributorId: loginData?.role === "DT" ? loginData?.hierarchyId : "",
    retailerId: loginData?.role === "RT" ? loginData?.hierarchyId : "",
    reportType: "",
    page: pagination?.currentPage,
    size: pagination?.pageSize,
  };

  const validationSchema = Yup.object({
    dateRange: dateRangeValidationSchema
  })

  const [formValues, setFormValues] = useState(initialValues);

  const [partnersMemberList, setPartnersMemberList] = useState([]);
  const [superDistributorMemberList, setSuperDistributorMemberList] = useState([]);
  const [distributorsMemberList, setDistributorsMemberList] = useState([]);
  const [retailersMemberList, setRetailersMemberList] = useState([]);

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

  const GetSingleHierarchyChildList = async (
    hierarchyId: string,
    level: "WL" | "SD" | "PT" | "DT" | "RT"
  ) => {
    if (level == "RT") return;

    try {
      setLoadingState((prev) => ({ ...prev, [level]: true }));

      const response = await Single_Hierarchy_Child_List(hierarchyId);

      if (
        response?.data?.statusCode === 200 ||
        response?.data?.statusCode === 201
      ) {
        const data = response.data.data?.content || [];

        switch (level) {
          case "WL":
            setSuperDistributorMemberList(data);
            break;
          case "SD":
            setPartnersMemberList(data);
            break;
          case "PT":
            setDistributorsMemberList(data);
            break;
          case "DT":
            setRetailersMemberList(data);
            break;
        }
      }
    } catch (error) {
      handleCustomError(error);
    } finally {
      setLoadingState((prev) => ({ ...prev, [level]: false }));
    }
  };


  const handleSuperDistributorChange = (
    value: string | number | string[] | number[]
  ) => {
    const id = String(Array.isArray(value) ? value[0] : value);

    setDistributorsMemberList([]);
    setRetailersMemberList([]);
    GetSingleHierarchyChildList(id, "SD");
  };

  const handlePartnerChange = (
    value: string | number | string[] | number[]
  ) => {
    const id = String(Array.isArray(value) ? value[0] : value);

    setRetailersMemberList([]);

    GetSingleHierarchyChildList(id, "PT");
  };

  const handleDistributorChange = (
    value: string | number | string[] | number[]
  ) => {
    const id = String(Array.isArray(value) ? value[0] : value);
    GetSingleHierarchyChildList(id, "DT");
  };


  const uniqueSuperDistributorList = Array.from(
    new Set(superDistributorMemberList?.map((item: any) => item.userId))
  )?.map((userId, index) => ({
    value: userId,
    label: userId,
    id: index + 1,
  }));
  const uniquePartnerList = Array.from(
    new Set(partnersMemberList?.map((item: any) => item.userId))
  )?.map((userId, index) => ({
    value: userId,
    label: userId,
    id: index + 1,
  }));
  const uniqueDistributorList = Array.from(
    new Set(distributorsMemberList?.map((item: any) => item.userId))
  )?.map((userId, index) => ({
    value: userId,
    label: userId,
    id: index + 1,
  }));
  const uniqueRetailerList = Array.from(
    new Set(retailersMemberList?.map((item: any) => item.userId))
  )?.map((userId, index) => ({
    value: userId,
    label: userId,
    id: index + 1,
  }));

  const handleRefresh = () => {
    dispatch(clearPagination({ key: NTW_TRANX_KEY }));
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
      dispatch(clearPagination({ key: NTW_TRANX_KEY }));
    }
  }, []);

  useEffect(() => {
    if (submittedFilter) {
      setPayload((prev: any) => ({ ...prev, ...submittedFilter }));
    }
  }, [submittedFilter])

  useEffect(() => {
    if (loginData?.hierarchyId && !isFetchingRef.current) {
      isFetchingRef.current = true;
      GetSingleHierarchyChildList(loginData.hierarchyId, loginData.role);
    }
  }, [loginData?.hierarchyId, loginData?.role]);


  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  return (
    <div className="w-full">
      <NewTextComponent fontSize={22} color={theme.palette.red.DEFAULT} fontFamily="Inter" fontWeight={600}>
        Network Transaction Report
      </NewTextComponent>

      <Formik
        initialValues={formValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={throttledSubmit}
      >
        {({ values, setFieldValue }) => {

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
                    name="superDistributorId"
                    label="Super Distributor"
                    placeholder="Select Super Distributor"
                    nothingFoundMessage="Nothing Found "
                    size="xs"
                    allowDeselect={true}
                    onChange={(value: any) => {
                      if (!value) return

                      const id = String(
                        Array.isArray(value) ? value[0] : value
                      );
                      setFieldValue("superDistributorId", id);
                      handleSuperDistributorChange(id);
                    }}
                    data={uniqueSuperDistributorList || []}
                    disabled={!values.whitelabelId || loadingState.WL}
                    searchable={true}
                  // withAsterisk
                  // required
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 4, xs: 4, md: 4, lg: 2 }}>
                  <FormikSelectComponent
                    name="partnerId"
                    label="Partner"
                    placeholder="Select Partner"
                    nothingFoundMessage="Nothing Found "
                    size="xs"
                    onChange={(value: any) => {
                      if (!value) return

                      const id = String(
                        Array.isArray(value) ? value[0] : value
                      );
                      setFieldValue("partnerId", id);
                      handlePartnerChange(id);
                    }}
                    data={uniquePartnerList || []}
                    disabled={!values.superDistributorId || loadingState.SD}
                    allowDeselect
                    searchable={true}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 4, xs: 4, md: 4, lg: 2 }}>
                  <FormikSelectComponent
                    name="distributorId"
                    label="Distributor"
                    placeholder="Select Distributor"
                    nothingFoundMessage="Nothing Found "
                    size="xs"
                    onChange={(value: any) => {
                      if (!value) return
                      const id = String(
                        Array.isArray(value) ? value[0] : value
                      );
                      setFieldValue("distributorId", id);
                      handleDistributorChange(id);
                    }}
                    data={uniqueDistributorList || []}
                    disabled={!values.partnerId || loadingState.PT}
                    allowDeselect
                    searchable={true}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 4, xs: 4, md: 4, lg: 2 }}>
                  <FormikSelectComponent
                    name="retailerId"
                    data={uniqueRetailerList || []}
                    label="Retailer"
                    nothingFoundMessage="Nothing Found "
                    placeholder="Select Retailer"
                    size="xs"
                    disabled={!values.distributorId || loadingState.DT}
                    allowDeselect
                    searchable={true}
                  />
                </Grid.Col>

                <Grid.Col span="auto">
                  <div className="flex justify-end items-center mt-4">
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
        <GenericMasterTable<NetworkTransactionTableType>
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

export default NetworkTransaction
