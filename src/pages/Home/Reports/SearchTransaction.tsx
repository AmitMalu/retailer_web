import { useState } from "react";
import { Form, Formik } from "formik";
import { Grid } from "@mantine/core";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { exportToCsv, textField, transactionStatusSelectData, walletTypeSelectData } from "@/Utils/helper";
import { GenericTableHeader, SearchTransReportData, SearchTransReportTableType } from "@/Common/interface";
import { useFetchList } from "@/Utils/CustomHooks/useFetchList";
import { API_ROUTES } from "@/Services/apiRoutes";
import { toast } from "react-toastify";
import { clearPagination } from "@/Redux/Reducers/paginationSlice";
import { useThrottledFormSubmit } from "@/Utils/CustomHooks/useThrottleFormSubmit";
import TextComponent from "@/components/Atoms/NewComponents/TextComponent";
import { useTheme } from "@mui/system";
import FormikTextInputComponent from "@/components/Molecules/NewComponents/FormikTextInputComponent";
import GenericMasterToolbar from "@/components/Molecules/GenericMasterToolbar";
import ButtonComponent from "@/components/Atoms/NewComponents/ButtonComponent";
import { CustomTab } from "@/components/Molecules/CustomTab";
import ShimmerTableRows from "@/components/Atoms/ShimmerTableRows";
import GenericMasterTable from "@/components/Molecules/GenericMasterTable";

const KEY = 'search-transaction'

export const searchTransInitialValues = {
  transactionId: "",
};

// Yup schema
export const SearchTransReportSchema = {
  transactionId: textField("Transaction ID", 30, true, true, 17),
};

export const SearchTransReportHeaders: GenericTableHeader<SearchTransReportTableType>[] =
  [
    {
      key: "transactionId",
      label: "Transaction ID",
      filterType: "text",
      copyable: true,
    },
    { key: "hierarchyId", label: "Hierarchy ID", filterType: "text" },
    { key: "productName", label: "Product Name", filterType: "text" },
    {
      key: "walletType",
      label: "Wallet Type",
      filterType: "boolean",
      filterOptions: walletTypeSelectData,
    },
    { key: "balBefore", label: "Balance Before", filterType: "text" },
    { key: "amount", label: "Amount", filterType: "text" },
    { key: "balAfter", label: "Balance After", filterType: "text" },
    { key: "narration", label: "Narration", filterType: "text" },
    {
      key: "status",
      label: "Status",
      filterType: "boolean",
      filterOptions: transactionStatusSelectData,
    },
    { key: "date", label: "Date", filterType: "date" },
    { key: "time", label: "Time", filterType: "text" },
  ];

const SearchTransactionReport = () => {

  const dispatch = useDispatch();
  const theme = useTheme()
  const [reportFilter, setReportFilter] = useState<Record<string, any> | null>(null);
  const [shouldFetch, setShouldFetch] = useState(false);

  const [activeTab, setActiveTab] = useState("transaction");
  const [refreshKey, setRefreshKey] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    SearchTransReportHeaders.map((h) => h.key as string)
  );

  const tabList = [
    { value: "transaction", label: "Transaction Details" },
    { value: "wallet", label: "Wallet Details" },
  ];

  const { data, loading, error } =
    useFetchList<SearchTransReportData>({
      key: KEY,
      url: shouldFetch ? API_ROUTES.SEARCH_TRANSACTION_REPORT : "",
      filter: shouldFetch ? reportFilter : null,
      method: "GET",
      refreshKey,
      expectArray: false,
      skipPagination: true,     // don't send page & size
      returnFullData: true,     // return response.data directly
    });

  const filteredData = data ? (activeTab === "transaction" ? data.transactionDetails : data.walletDetails) : [];

  const handleExportClick = () => {
    if (!filteredData || filteredData.length === 0) {
      toast.warning("No data available to export.");
      return;
    }

    const fileName = activeTab === "transaction"
      ? "transaction-details-report"
      : "wallet-details-report";
    exportToCsv(filteredData, fileName);
  };

  const handleToggleColumn = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleToggleAllColumns = (selectAll: boolean) => {
    if (selectAll) {
      setVisibleColumns(SearchTransReportHeaders.map((h) => h.key as string));
    } else {
      setVisibleColumns([]);
    }
  };

  const handleRefresh = () => {
    dispatch(clearPagination({ key: KEY }));
    setVisibleColumns(SearchTransReportHeaders.map((h) => h.key as string));
    setRefreshKey((prev) => prev + 1);
  };

  const throttledSubmit = useThrottledFormSubmit((values: any) => {
    setReportFilter(values);
    setShouldFetch(true); //enable fetch only after form submit
  }, 3000);

  return (
    <div className="p-2 w-full h-[calc(100vh-90px)] flex flex-col">
      {/* Heading */}
      <TextComponent fontFamily="Inter" color={theme.palette.primaryExtra.hover} fontWeight={600} fontSize={24}>
        Search Transaction Report
      </TextComponent>

      <Formik
        initialValues={searchTransInitialValues}
        validationSchema={Yup.object(SearchTransReportSchema)}
        onSubmit={throttledSubmit}
      >
        {() => {

          return (
            <Form className="flex flex-col gap-2 mt-4">
              <Grid gutter="sm">
                <Grid.Col span={{ base: 12, sm: 4, md: 4, lg: 4 }} >
                  <FormikTextInputComponent
                    name="transactionId"
                    placeholder="Search By Transaction ID"
                    label="Transaction ID"
                    size="sm"
                    required
                    withAsterisk
                    maxLength={30}
                  />
                </Grid.Col>

                <Grid.Col span="auto">
                  <div className="flex justify-end items-end h-full gap-2">
                    <GenericMasterToolbar
                      onRefresh={handleRefresh}
                      onColumnChange={handleToggleColumn}
                      onToggleAll={handleToggleAllColumns}
                      onExport={handleExportClick}
                      headers={SearchTransReportHeaders}
                      visibleColumns={visibleColumns}
                      loading={loading}
                      error={error ? error.toString() : null}
                    />

                    <ButtonComponent
                      fontSize="14"
                      fullWidth={false}
                      radius={6}
                      style={{ height: 34 }}
                      size="sm"
                      variant="filled"
                      type="submit"
                      disabled={loading}
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

      <CustomTab
        className="mt-6"
        tabList={tabList}
        value={activeTab}
        onChange={(val) => {
          if (val !== null) {
            setActiveTab(val);
          }
        }}
        grow={true}
        activeColor={theme.palette.primary.main}
      />

      {
        loading ? (
          // Render shimmer
          <ShimmerTableRows rowCount={6} columnCount={SearchTransReportHeaders.length} />
        ) : (
          <GenericMasterTable<SearchTransReportTableType>
            data={filteredData}
            headers={SearchTransReportHeaders.filter((h) =>
              visibleColumns.includes(h.key as string)
            )}
          // pagination
          // currentPage={pagination.currentPage}
          // totalPages={pagination.totalPages}
          // onPageChange={setPage}
          // onPageSizeChange={setPageSize}
          // pageSize={pagination.pageSize}
          // pageSizeOptions={pageSizeSelectData}
          // message={`Showing page ${pagination.currentPage} of ${pagination.totalPages}`}
          />
        )
      }
    </div >
  );
};

export default SearchTransactionReport;
