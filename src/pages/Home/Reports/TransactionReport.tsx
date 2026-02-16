import { GenericTableHeader, TransactionReportTableType, TransactionReportParams } from "@/Common/interface";
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
import { useAppSelector } from "@/Redux/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { clearReportState, saveReportState } from "@/Redux/Reducers/reportStateSlice";

const KEY = "transaction_report"

const TransactionReport = () => {

    const dispatch = useDispatch();
    const theme = useTheme()
    const navigate = useNavigate();
    const location = useLocation();
    const fromTicket = location.state?.fromTicket;
    const { responses } = useAppSelector(state => state.apiResponse)
    const reportState = useAppSelector(
        (state) => state.reportState?.[KEY]
    );
    const loginData = responses?.loginData
        ? decryptData(responses.loginData)
        : null;

    const formikRef = useRef<FormikProps<TransactionReportParams>>(null);
    const dataRef = useRef<TransactionReportTableType[] | null>(null);

    const [payload, setPayload] = useState<any>(null);
    const [filterVisible, setFilterVisible] = useState(false);
    const [filterValues, setFilterValues] = useState<Record<string, any>>({});
    const [submittedFilter, setSubmittedFilter] = useState<Record<string, any> | null>(null);
    const [viewSubmitted, setViewSubmitted] = useState(false);

    const [refreshKey, setRefreshKey] = useState(0);

    const headers: GenericTableHeader<TransactionReportTableType>[] = [
        { key: "txId", label: "Transaction ID", filterType: "text", copyable: true },
        { key: "productName", label: "Product Name", filterType: "none" },
        // { key: "subProductName", label: "Sub Product Name", filterType: "none" },
        { key: "userId", label: "User ID", filterType: "none" },
        // { key: "mobileNo", label: "Mobile No", filterType: "text" },
        // { key: "schemeName", label: "Scheme Name", filterType: "text" },
        { key: "amount", label: "Amount", filterType: "number" },
        { key: "txStatus", label: "Transaction Status", filterType: "text" },
        // { key: "txType", label: "Transaction Type", filterType: "text" },
        { key: "remarks", label: "Remarks", filterType: "text" },
        { key: "walletType", label: "Wallet Type", filterType: "none" },
        // { key: "medium", label: "Medium", filterType: "text" },
        // { key: "vendor", label: "Vendor", filterType: "text" },
        { key: "dateOfTransaction", label: "Transaction Date", filterType: "date" },
        { key: "timeOfTransaction", label: "Transaction Time", filterType: "text" },
        // { key: "updatedDateOfTransaction", label: "Updated Date", filterType: "date" },
        // { key: "updatedTimeOfTransaction", label: "Updated Time", filterType: "time" },
    ];

    const transformPayload = (values: any) => {
        const [fromDate, toDate] = values.dateRange || [];
        return {

            fromDate: fromDate ? formatYMDdate(fromDate) : null,
            toDate: toDate ? formatYMDdate(toDate) : null,
            productId: values?.productId ?? "",
            subProductId: values.subProductId ?? "",
            walletType: values.walletType ?? "",
            tranStatus: "",
            userId: loginData.hierarchyId
        }
    }

    const { data, loading, pagination, error, setPage, setPageSize } =
        useFetchList<TransactionReportTableType>({
            method: "POST",
            key: KEY,
            url: viewSubmitted ? `${API_ROUTES.TRANSACTION_REPORT}` : undefined,
            payload,
            refreshKey,
            sendPaginationIn: "params",
        });

    const defaultValues: TransactionReportParams = {
        dateRange: [
            moment().subtract(6, "days").toDate(), // from: 6 days ago
            moment().toDate(), // to: today
        ] as DatesRangeValue,
        productId: "",
        subProductId: "",
        walletType: "",
        tranStatus: "",
    };

    const InitialValues = reportState?.formValues || defaultValues;

    const validationSchema = Yup.object({
        dateRange: dateRangeValidationSchema,
    })

    const [visibleColumns, setVisibleColumns] = useState<string[]>(
        headers.map((h) => h.key as string)
    );

    const handleExportClick = () => {
        const currentData = dataRef.current;
        if (!currentData || currentData.length === 0) {
            toast.warning("No data available to export.");
            return;
        }
        exportToCsv(currentData, "Pending-Transaction-report");
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
        const updatedFilter = { ...(submittedFilter || {}), [key]: value };

        setSubmittedFilter(updatedFilter);

        // SAVE TO REDUX IMMEDIATELY
        dispatch(
            saveReportState({
                key: KEY,
                data: {
                    formValues: formikRef.current?.values,
                    submittedFilter: updatedFilter,
                },
            })
        );
    };


    const handleRefresh = () => {
        // Reset redux pagination / master state
        dispatch(clearPagination({ key: KEY }));

        // CLEAR REPORT STATE
        dispatch(clearReportState({ key: KEY }));

        // Reset table view state
        setVisibleColumns(headers.map((h) => h.key as string));
        setFilterVisible(false);
        setFilterValues({});
        setSubmittedFilter(null);

        setPayload(transformPayload(InitialValues));
        setRefreshKey((prev) => prev + 1);

        // Reset Formik ONLY
        formikRef.current?.resetForm({
            values: InitialValues as any,
        });
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
        dispatch(clearPagination({ key: KEY }));

        // SAVE TO REDUX
        dispatch(
            saveReportState({
                key: KEY,
                data: {
                    formValues: values,
                    submittedFilter,
                },
            })
        );

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

    useEffect(() => {
        if (fromTicket && reportState?.formValues) {
            setPayload({
                ...transformPayload(reportState.formValues),
                ...(reportState.submittedFilter || {}),
            });

            setViewSubmitted(true);
        }
    }, [fromTicket, reportState]);

    useEffect(() => {
        if (fromTicket) {
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [fromTicket]);


    //To trigger auto api call when returning from ticketing form page
    useEffect(() => {
        if (reportState?.submittedFilter) {
            setSubmittedFilter(reportState.submittedFilter);
        }
    }, []);

    return (
        <div className="w-full">
            <NewTextComponent fontSize={22} color={theme.palette.red.DEFAULT} fontFamily="Inter" fontWeight={600}>
                TRANSACTION REPORT
            </NewTextComponent>

            <Formik
                key={refreshKey}
                innerRef={formikRef}
                initialValues={InitialValues}
                validationSchema={validationSchema}
                onSubmit={throttledSubmit}
            >
                {({ values, setFieldValue }) => {
                    const {
                        productDropdownData,
                        loadingProductList,
                        subProductDropdownData,
                        loadingSubProductList,
                        subProductKey,
                        refetchProducts
                    } = useProductSubProduct({
                        selectedProductId: values.productId ? String(values.productId) : null,
                        selectedSubProductId: values.subProductId ? String(values.subProductId) : null,
                        onSubProductReset: () => setFieldValue("subProductId", ""),
                    });

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
                                        name="subProductId"
                                        key={`${subProductKey}-${values.productId}`}
                                        value={values.subProductId}
                                        data={subProductDropdownData}
                                        label="Sub Product"
                                        placeholder="Select Sub Product"
                                        allowDeselect={true}
                                        searchable={true}
                                        nothingFoundMessage="No SubProduct Found for Selected Product"
                                        size="xs"
                                        disabled={loadingSubProductList}
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
                <GenericMasterTable<TransactionReportTableType>
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
                    extraColumnPosition="left"
                    renderExtraHeader={() => <></>} // empty header for action column/>
                    renderExtraRowCell={(item) => (
                        <div className="flex justify-center gap-2 min-w-10">
                            <span
                                onClick={() => navigate(`/support/ticketingSystem?txId=${item.txId}`)}
                                title="Raise Ticket"
                                className="cursor-pointer hover:scale-110 transition-all duration-200"
                            >
                                <i className="fa-solid fa-ticket fa-lg" style={{ color: "#bf2024ff" }}></i>
                            </span>
                        </div>
                    )
                    }
                />
            )}

        </div >
    );
};

export default TransactionReport;
