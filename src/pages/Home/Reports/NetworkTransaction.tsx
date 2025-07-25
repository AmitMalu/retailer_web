import { ColsSvgIcon, ExportSvgIcon, FilterSvgIcon } from "@/assets/svg";
import {
  DistributorsData,
  NetworkTransactionData,
  NetworkTransactionParams,
  PartnersData,
  RetailersData,
} from "@/Common/interface";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import CustomDateComponent from "@/components/Atoms/CustomDateComponent";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import ColumsSelectionModal from "@/components/Molecules/ColumsSelectionModal";
import TableComponent from "@/components/Molecules/TableComponent";
import { RootState } from "@/Redux/Store";
import { Child_Member_List, Network_Transaction_Report } from "@/Services/api";
import { handleCustomError } from "@/Utils/handleCustomError";
import {
  decryptData,
  formatYMDdate,
  isSameOrAfter,
  isSameOrBefore,
} from "@/Utils/helper";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import { UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";

const NetworkTransaction = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isNetworkTransactionReportList, setIsNetworkTransactionReportList] =
    useState<NetworkTransactionData | []>([]);
  const [isSeacrh, setIsSeacrh] = useState(false);
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const isFetchingRef = useRef(false);
  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;
  const subproductData = apiResponses?.subProductDropdown
    ? decryptData(apiResponses?.subProductDropdown)
    : null;

  const uniqueSubProductTypes =
    subproductData?.map((item: any) => ({
      value: item.subProduct_name,
      label: item.subProduct_name,
    })) || [];

  const [partnersMemberList, setPartnersMemberList] = useState<PartnersData[]>(
    []
  );
  const [superDistributorMemberList, setSuperDistributorMemberList] = useState<
    PartnersData[]
  >([]);
  const [distributorsMemberList, setDistributorsMemberList] = useState<
    DistributorsData[]
  >([]);
  const [retailersMemberList, setRetailersMemberList] = useState<
    RetailersData[]
  >([]);

  const GetChildList = async (
    hierarchyId: string,
    level: "WL" | "SD" | "PT" | "DT" | "RT"
  ) => {
    try {
      setIsLoading(true);
      const response = await Child_Member_List(hierarchyId);

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
      setIsLoading(false);
    }
  };

  const handleSuperDistributorChange = (
    value: string | number | string[] | number[]
  ) => {
    const id = String(Array.isArray(value) ? value[0] : value);

    setDistributorsMemberList([]);
    setRetailersMemberList([]);
    GetChildList(id, "SD");
  };

  const handlePartnerChange = (
    value: string | number | string[] | number[]
  ) => {
    const id = String(Array.isArray(value) ? value[0] : value);

    setRetailersMemberList([]);

    GetChildList(id, "PT");
  };

  const handleDistributorChange = (
    value: string | number | string[] | number[]
  ) => {
    const id = String(Array.isArray(value) ? value[0] : value);
    GetChildList(id, "DT");
  };

  useEffect(() => {
    if (loginData?.hierarchyId && !isFetchingRef.current) {
      isFetchingRef.current = true;
      GetChildList(loginData.hierarchyId, loginData.role);
    }
  }, [loginData?.hierarchyId, loginData?.role]);

  const uniqueSuperDistributorList = Array.from(
    new Set(superDistributorMemberList.map((item: any) => item.userId))
  ).map((userId, index) => ({
    value: userId,
    label: userId,
    id: index + 1,
  }));
  const uniquePartnerList = Array.from(
    new Set(partnersMemberList.map((item: any) => item.userId))
  ).map((userId, index) => ({
    value: userId,
    label: userId,
    id: index + 1,
  }));
  const uniqueDistributorList = Array.from(
    new Set(distributorsMemberList.map((item: any) => item.userId))
  ).map((userId, index) => ({
    value: userId,
    label: userId,
    id: index + 1,
  }));
  const uniqueRetailerList = Array.from(
    new Set(retailersMemberList.map((item: any) => item.userId))
  ).map((userId, index) => ({
    value: userId,
    label: userId,
    id: index + 1,
  }));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const validationSchema = Yup.object({
    fromDate: Yup.date()
      .required("Required")
      .test("max-today", "Invalid Date", function (value) {
        if (!value) return true;
        return isSameOrBefore(value, today);
      })
      .test("date-range", "Invalid Date", function (value) {
        const toDate = this.parent.toDate;
        if (!value || !toDate) return true;
        return isSameOrBefore(value, toDate);
      }),
    toDate: Yup.date()
      .required("Required")
      .test("max-today", "Invalid Date", function (value) {
        if (!value) return true;
        return isSameOrBefore(value, today);
      })
      .test("date-range", "Invalid Date", function (value) {
        const fromDate = this.parent.fromDate;
        if (!value || !fromDate) return true;
        return isSameOrAfter(value, fromDate);
      }),
    subProductName: Yup.string().required("Required"),
    status: Yup.string().required("Required"),

    // whitelabelId: Yup.string(),
    // superDistributorId: Yup.string(),
    // partnerId: Yup.string(),
    // distributorId: Yup.string(),
    // retailerId: Yup.string(),
  });
  //   .test(
  //   "role-based-validation",
  //   "Please select the required field(s) based on your role",
  //   function (values) {
  //     const {
  //       whitelabelId,
  //       superDistributorId,
  //       partnerId,
  //       distributorId,
  //       retailerId,
  //     } = values;
  //     const role = loginData?.role;
  //     let errorMessage = "";
  //     let errorPath = "";

  //     if (role === "WL") {
  //       if (
  //         !whitelabelId &&
  //         !superDistributorId &&
  //         !partnerId &&
  //         !distributorId &&
  //         !retailerId
  //       ) {
  //         errorMessage =
  //           "Please select at least one ID (Whitelabel, Super Distributor, Partner, Distributor, or Retailer)";
  //         errorPath = "whitelabelId";
  //       }
  //     } else if (role === "PT") {
  //       // At least one of distributor or retailer
  //       if (!distributorId && !retailerId) {
  //         errorMessage =
  //           "Please select at least one ID (Distributor or Retailer)";
  //         errorPath = "distributorId";
  //       }
  //     } else if (role === "SD") {
  //       if (!distributorId && !partnerId && !retailerId) {
  //         errorMessage =
  //           "Please select at least one ID (Partner, Distributor, or Retailer)";
  //         errorPath = "partnerId";
  //       }
  //     } else if (role === "DT") {
  //       if (!retailerId) {
  //         errorMessage = "Retailer ID is required";
  //         errorPath = "retailerId";
  //       }
  //     } else if (role === "RT") {
  //       if (!retailerId) {
  //         errorMessage = "Retailer ID is required";
  //         errorPath = "retailerId";
  //       }
  //     }

  //     if (errorMessage) {
  //       return this.createError({
  //         path: errorPath,
  //         message: errorMessage,
  //       });
  //     }

  //     return true;
  //   }
  // );

  const initialValues: NetworkTransactionParams = {
    loginHierarchyId: loginData?.hierarchyId,
    fromDate: "",
    toDate: "",
    subProductName: "",
    whitelabelId: loginData?.role === "WL" ? loginData?.hierarchyId : "",
    superDistributorId: loginData?.role === "SD" ? loginData?.hierarchyId : "",
    partnerId: loginData?.role === "PT" ? loginData?.hierarchyId : "",
    distributorId: loginData?.role === "DT" ? loginData?.hierarchyId : "",
    retailerId: loginData?.role === "RT" ? loginData?.hierarchyId : "",
    status: "",
    page: currentPage,
    size: itemsPerPage,
    // search: "",
    // download: false,
  };

  const handleReportSubmit = async (
    values: NetworkTransactionParams
    // { resetForm }: FormikHelpers<ReportProps>,
  ) => {
    try {
      setIsLoading(true);
      setCurrentPage(values.page);
      setItemsPerPage(values.size);
      let bodyRequest = {
        fromDate: formatYMDdate(values.fromDate),
        toDate: formatYMDdate(values.toDate),
        loginHierarchyId: values.loginHierarchyId || loginData?.hierarchyId,
        subProductName: values.subProductName,
        whitelabelId: values.whitelabelId,
        superDistributorId: values.superDistributorId,
        partnerId: values.partnerId,
        distributorId: values.distributorId,
        retailerId: values.retailerId,
        status: values.status,
        page: values.page,
        size: values.size,
      };
      const response = await Network_Transaction_Report({}, bodyRequest);

      if (response?.status === 200) {
        setIsNetworkTransactionReportList(response?.data?.data?.content);
        showSuccessNotification(response?.data?.message);
      } else {
        showErrorNotification(response?.data?.message);
      }
    } catch (error) {
      await handleCustomError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (formikValues: NetworkTransactionParams) => {
    try {
      const bodyRequest = {
        fromDate: formatYMDdate(formikValues.fromDate),
        toDate: formatYMDdate(formikValues.toDate),
        loginHierarchyId:
          formikValues.loginHierarchyId || loginData?.hierarchyId,
        subProductName: formikValues.subProductName,
        whitelabelId: formikValues.whitelabelId,
        superDistributorId: formikValues.superDistributorId,
        partnerId: formikValues.partnerId,
        distributorId: formikValues.distributorId,
        retailerId: formikValues.retailerId,
        status: formikValues.status,
        page: formikValues.page,
        size: formikValues.size,
      };

      const response = await Network_Transaction_Report(
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
        a.download = `Commission_&_Changes_report_${formatYMDdate(new Date())}.csv`;
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

  const tableColumns = [
    {
      key: "createdOn",
      label: "Created On",
      searchKey: "createdOn",
      sortable: false,
      type: "date",
    },
    {
      key: "transactionId",
      label: "Transaction ID",
      searchKey: "transactionId",
      sortable: false,
    },
    {
      key: "outletName",
      label: "Outlet Name",
      searchKey: "outletName",
      sortable: false,
    },
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
    },
    {
      key: "transactionType",
      label: "Transaction Type",
      searchKey: "transactionType",
      sortable: false,
    },
    {
      key: "operator",
      label: "Operator",
      searchKey: "operator",
      sortable: false,
    },
    {
      key: "balanceBefore",
      label: "Balance Before",
      searchKey: "balanceBefore",
      sortable: false,
    },
    {
      key: "amount",
      label: "Amount",
      searchKey: "amount",
      sortable: true,
    },
    {
      key: "refNo",
      label: "Ref No",
      searchKey: "refNo",
      sortable: true,
    },
    {
      key: "balanceAfter",
      label: "Balance After",
      searchKey: "balanceAfter",
      sortable: false,
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
    values: NetworkTransactionParams
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
        const bodyRequest = {
          fromDate: formatYMDdate(values.fromDate),
          toDate: formatYMDdate(values.toDate),
          loginHierarchyId: values.loginHierarchyId || loginData?.hierarchyId,
          subProductName: values.subProductName,
          whitelabelId: values.whitelabelId,
          superDistributorId: values.superDistributorId,
          partnerId: values.partnerId,
          distributorId: values.distributorId,
          retailerId: values.retailerId,
          status: values.status,
          page: values.page,
          size: values.size,
        };

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setIsLoading(true);
          Network_Transaction_Report(newSearchValues, bodyRequest)
            .then((response) => {
              if (response?.status === 200) {
                setIsNetworkTransactionReportList(
                  response?.data?.data?.content
                );
              } else {
                showErrorNotification(response?.data?.message);
                setIsNetworkTransactionReportList([]);
              }
            })
            .catch((error) => {
              handleCustomError(error);
              setIsNetworkTransactionReportList([]);
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
      {isLoading && <Loader />}
      <div className="w-full 320px:mt-12 md:mt-0">
        <div className="mb-6 ">
          <TextComponent
            fontSize={22}
            fontWeight={600}
            color={theme.palette.red.DEFAULT}
          >
            Network Transaction Report
          </TextComponent>
        </div>

        <Formik<NetworkTransactionParams>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleReportSubmit}
        >
          {({ values, handleSubmit, errors, touched, setFieldValue }) => {
            return (
              <>
                <div className="shadow-black-900/100 mt-5 flex w-full flex-col items-start justify-center gap-6 rounded-xl bg-background-paper p-3 shadow-lg 320px:mt-5 md:mt-0">
                  <div className="flex w-full flex-wrap items-start justify-between gap-4">
                    <div className="flex w-full flex-wrap items-start justify-start gap-4">
                      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(20%-16px)]">
                        <CustomDateComponent
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
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(20%-16px)]">
                        <DropdownComponent
                          label="Sub Product Name"
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
                        />
                      </div>
                      {loginData?.role === "WL" && (
                        <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(20%-16px)]">
                          <DropdownComponent
                            label="Super Distributor ID"
                            data={uniqueSuperDistributorList}
                            value={values.superDistributorId}
                            withAsterisk
                            onChange={(value) => {
                              const id = String(
                                Array.isArray(value) ? value[0] : value
                              );
                              setFieldValue("superDistributorId", id);
                              handleSuperDistributorChange(id);
                            }}
                            error={
                              touched.superDistributorId &&
                              errors.superDistributorId
                                ? errors.superDistributorId
                                : ""
                            }
                            className="w-max"
                          />
                        </div>
                      )}
                      {(loginData?.role === "WL" ||
                        loginData?.role === "SD") && (
                        <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(20%-16px)]">
                          <DropdownComponent
                            label="Partner ID"
                            data={uniquePartnerList}
                            value={values.partnerId}
                            withAsterisk
                            onChange={(value) => {
                              const id = String(
                                Array.isArray(value) ? value[0] : value
                              );
                              setFieldValue("partnerId", id);
                              handlePartnerChange(id);
                            }}
                            error={
                              touched.partnerId && errors.partnerId
                                ? errors.partnerId
                                : ""
                            }
                            disabled={
                              !values.superDistributorId &&
                              loginData?.role === "WL"
                            }
                            className="w-max"
                          />
                        </div>
                      )}
                      {(loginData?.role === "WL" ||
                        loginData?.role === "SD" ||
                        loginData?.role === "PT") && (
                        <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(20%-16px)]">
                          <DropdownComponent
                            label="Distributor ID"
                            data={uniqueDistributorList}
                            value={values.distributorId}
                            withAsterisk
                            onChange={(value) => {
                              const id = String(
                                Array.isArray(value) ? value[0] : value
                              );
                              setFieldValue("distributorId", id);
                              handleDistributorChange(id);
                            }}
                            error={
                              touched.distributorId && errors.distributorId
                                ? errors.distributorId
                                : ""
                            }
                            disabled={!values.partnerId}
                            className="w-max"
                          />
                        </div>
                      )}
                      {(loginData?.role === "WL" ||
                        loginData?.role === "SD" ||
                        loginData?.role === "PT" ||
                        loginData?.role === "DT") && (
                        <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(20%-16px)]">
                          <DropdownComponent
                            label="Retailer ID"
                            data={uniqueRetailerList}
                            value={values.retailerId}
                            withAsterisk
                            onChange={(value) => {
                              const id = String(
                                Array.isArray(value) ? value[0] : value
                              );
                              setFieldValue("retailerId", id);
                            }}
                            error={
                              touched.retailerId && errors.retailerId
                                ? errors.retailerId
                                : ""
                            }
                            disabled={!values.distributorId}
                            className="w-max"
                          />
                        </div>
                      )}
                      <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(20%-16px)]">
                        <DropdownComponent
                          label="Status"
                          data={[
                            { value: "COMMISSION", label: "COMMISSION" },
                            { value: "CHARGE", label: "CHARGE" },
                          ]}
                          value={values.status}
                          withAsterisk
                          onChange={(value) => setFieldValue("status", value)}
                          error={
                            touched.status && errors.status ? errors.status : ""
                          }
                          className="w-max"
                        />
                      </div>
                    </div>
                    <div className="flex  items-center justify-end w-full">
                      <ButtonComponent
                        title="View"
                        variant="filled"
                        onClick={() => {
                          setFieldValue("download", false);
                          handleSubmit();
                        }}
                        radius={29}
                        width={100}
                      />
                    </div>
                  </div>
                </div>
                {isNetworkTransactionReportList &&
                  isNetworkTransactionReportList.length > 0 && (
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
                          <ExportSvgIcon color={theme.palette.red.DEFAULT} />{" "}
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
                      Array.isArray(isNetworkTransactionReportList)
                        ? isNetworkTransactionReportList
                        : [isNetworkTransactionReportList]
                    }
                    columns={filteredTableColumns}
                    showSearch={isSeacrh}
                    page={currentPage}
                    size={itemsPerPage}
                    onSearch={(columnKey, value) =>
                      handleSearchWithValues(columnKey, value, values)
                    }
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      const updatedValues = {
                        ...values,
                        page,
                        size: itemsPerPage,
                      };
                      handleReportSubmit(updatedValues);
                    }}
                    onPageSizeChange={(size) => {
                      setItemsPerPage(size);
                      setCurrentPage(1);
                      const updatedValues = {
                        ...values,
                        page: 1,
                        size,
                      };
                      handleReportSubmit(updatedValues);
                    }}
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

export default NetworkTransaction;
