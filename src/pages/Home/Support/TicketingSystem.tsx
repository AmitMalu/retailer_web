import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material";
// import TicketComponent from "@/components/Molecules/TicketComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  RaisedTicketParams,
  TicketingSystemProps,
  // TransactionDetailsData,
} from "@/Common/interface";
import TextareaComponent from "@/components/Atoms/TextareaComponent";
import {
  fetch_raised_tickets,
  Issue_Type_Dropdown,
  Raise_Ticket,
  // Transaction_Details,
} from "@/Services/api";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import { handleCustomError } from "@/Utils/handleCustomError";
import { decryptData } from "@/Utils/helper";
import { RootState } from "@/Redux/Store";
import { useSelector } from "react-redux";
import {
  BackSvgIcon, FilterSvgIcon,
  // SearchSvgIcon
} from "@/assets/svg";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import FileInputComponent from "@/components/Atoms/FileInputComponent";
import { UnstyledButton } from "@mantine/core";
import moment from "moment";
import TableComponent from "@/components/Molecules/TableComponent";
import ColumsSelectionModal from "@/components/Molecules/ColumsSelectionModal";
import { Refresh } from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
// import { maxWidth } from "@mui/system";

const Ticketing = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  // const [isTicketData, setIsTicketData] = useState<TransactionDetailsData>({});
  const [ticketList, setTicketList] = useState([]);
  const [showColumnModal, setShowColumnModal] = useState(false);
  // const [searchValue, setSearchValue] = useState("");

  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isSeacrh, setIsSeacrh] = useState(false);
  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );

  const [searchParams] = useSearchParams();
  const txIdFromQuery = searchParams.get("txId") || "";

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;
    
  const subproductData = apiResponses?.subProductDropdown
    ? decryptData(apiResponses?.subProductDropdown)
    : null;

  const [issueTypeList, setIssueTypeList] = useState([]);
  const isFetchingRef = useRef(false);

  const GetIssueTypeList = async () => {
    try {
      setIsLoading(true);
      const response = await Issue_Type_Dropdown();
      if (
        response?.data?.statusCode === 200 ||
        response?.data?.statusCode === 201
      ) {
        setIssueTypeList(response?.data?.data);
      } else {
        showErrorNotification(response?.data?.message);
      }
    } catch (error) {
      await handleCustomError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isFetchingRef.current) {
      isFetchingRef.current = true;
      GetIssueTypeList();
    }
  }, []);

  // When Search by TxId from Search bar
  // const FetchUserList = async () => {
  //   try {
  //     let bodyRequest = {
  //       transactionId: searchValue,
  //       hierarchyId: loginData?.hierarchyId,
  //     };
  //     const response = await Transaction_Details(bodyRequest);
  //     if (response?.status === 200) {
  //       setIsTicketData(response?.data?.data);
  //     } else {
  //       showErrorNotification(response?.data?.message);
  //     }
  //   } catch (error) {
  //     await handleCustomError(error);
  //   }
  // };

  const initialValues: TicketingSystemProps = {
    // transactionId: isTicketData?.transaction_id
    //   ? isTicketData?.transaction_id
    //   : "",
    transactionId: txIdFromQuery,
    issueType: "",
    description: "",
    subProductName: "",
    email: loginData?.emailId,
    mobileNumber: loginData?.mobileNumber,
    screenshotImage: null,
  };

  const validationSchema = Yup.object().shape({
    transactionId: Yup.string().required("Required"),
    issueType: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    subProductName: Yup.string().required("Required"),
    screenshotImage: Yup.string().required("Required"),
  });

  const handleTicketRequest = async (values: TicketingSystemProps) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      if (values?.screenshotImage instanceof File) {
        formData.append("screenshotImage", values?.screenshotImage);
      }
      const data: any = {
        transactionId: values?.transactionId,
        issueType: values?.issueType,
        description: values?.description,
        subProductName: values?.subProductName,
        email: values?.email,
        mobileNumber: values?.mobileNumber,
      };

      formData.append("data", JSON.stringify(data));

      const response = await Raise_Ticket(formData);
      if (response?.status === 200 || response?.data?.statusCode === "200") {
        showSuccessNotification(response?.data?.message);
        if (txIdFromQuery) {
          navigate("/reports/transaction-report", {
            state: { fromTicket: true }
          }); // your report page route
        } else {
          setShowTicketForm(false);
          FetchRaisedTickets(page, size, searchValues);
        }
      } else {
        showErrorNotification(response?.data?.message || "Unable to raise");
      }
    } catch (error: any) {
      await handleCustomError(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const uniqueIssueTypes = Array.from(
    new Set(issueTypeList.map((item: any) => item.issueType))
  ).map((issueType, index) => ({
    value: issueType,
    label: issueType,
    id: index + 1,
  }));

  const uniqueSubProductTypes =
    subproductData?.map((item: any) => ({
      value: item.subProduct_name,
      label: item.subProduct_name,
    })) || [];


  const tableColumns = [
    {
      key: "transactionId",
      label: "Transaction ID",
      render: (row: any) => {
        return (
          <div className="flex items-center justify-center w-[200]" title={row}>
            <TextComponent
              color="text.primary"
              fontSize={12}
              fontWeight={400}
              truncate
              lineClamp={1}
            >
              {row || "-"}
            </TextComponent>
          </div>
        );
      },
      searchKey: "transactionId",
      sortable: false,
    },
    {
      key: "issueType",
      label: "Issue Type",
      searchKey: "issueType",
      sortable: false,
    },
    {
      key: "description",
      label: "Description",
      render: (row: any) => (
        <div className="flex items-center justify-center w-[200]" title={row}>
          <TextComponent
            color="text.primary"
            fontSize={12}
            fontWeight={400}
            truncate
            lineClamp={2}
          >
            {row || "-"}
          </TextComponent>
        </div>
      ),
      searchKey: "description",
      sortable: false,
    },
    {
      key: "email",
      label: "Email",
      searchKey: "email",
      sortable: false,
    },
    {
      key: "mobileNumber",
      label: "Mobile Number",
      searchKey: "mobileNumber",
      sortable: false,
      type: "number" as const
    },
    {
      key: "subProductName",
      label: "Sub Product",
      searchKey: "subProductName",
      sortable: false,
    },
    {
      key: "status",
      label: "Ticket Status",
      searchKey: "status",
      sortable: false,
    },
    // {
    //   key: "screenshotImage",
    //   label: "Screenshot",
    //   render: (row: any) => (
    //     <div className="flex items-center justify-center">
    //       {row ? (
    //         <img
    //           src={row}
    //           alt="img"
    //           className="h-10 w-10 rounded object-cover"
    //         />
    //       ) : (
    //         "-"
    //       )}
    //     </div>
    //   ),
    //   searchKey: "screenshotImage",
    //   sortable: false,
    // },
    {
      key: "raisedBy",
      label: "Raised By",
      searchKey: "raisedBy",
      sortable: false,
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (row: any) => (
        <div className="flex items-center justify-center">
          <TextComponent
            color="text.primary"
            fontSize={12}
            fontWeight={400}
          >
            {row
              ? moment(row).format("YYYY-MM-DD")
              : "-"}
          </TextComponent>
        </div>
      ),
      searchKey: "createdAt",
      type: "date" as const,
      sortable: false,
    },
    {
      key: "updatedAt",
      label: "Updated At",
      render: (row: any) => (
        <div className="flex items-center justify-center">
          <TextComponent
            color="text.primary"
            fontSize={12}
            fontWeight={400}
          >
            {row
              ? moment(row).format("YYYY-MM-DD")
              : "-"}
          </TextComponent>
        </div>
      ),
      searchKey: "updatedAt",
      type: "date" as const,
      sortable: false,
    },
    {
      key: "tranStatus",
      label: "Transaction Status",
      searchKey: "tranStatus",
      sortable: false,
    },
    {
      key: "remark",
      label: "Remark",
      searchKey: "remark",
      sortable: false,
    },
    {
      key: "balBeforeTran",
      label: "Balance Before",
      searchKey: "balBeforeTran",
      sortable: false,
      type: "number" as const
    },
    {
      key: "balAfterTran",
      label: "Balance After",
      searchKey: "balAfterTran",
      sortable: false,
      type: "number" as const
    },
    {
      key: "dateOfTransaction",
      label: "Transaction Date",
      render: (row: any) => (
        <div className="flex items-center justify-center">
          <TextComponent
            color="text.primary"
            fontSize={12}
            fontWeight={400}
          >
            {row
              ? moment(row).format("YYYY-MM-DD")
              : "-"}
          </TextComponent>
        </div>
      ),
      searchKey: "dateOfTransaction",
      type: "date" as const,
      sortable: false,
    },
    {
      key: "amount",
      label: "Amount",
      searchKey: "amount",
      sortable: false,
      type: "number" as const
    },
  ];

  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    tableColumns.filter((col) => col.key !== "action").map((col) => col.key)
  );

  // Only include visible columns and always add the action column at the end
  const filteredTableColumns = [
    ...tableColumns.filter(
      (col) => visibleColumns.includes(col.key) && col.key !== "action"
    ),
    tableColumns.find((col) => col.key === "action")!,
  ];

  const handleSearchWithValues = (columnKey: string, value: string) => {
    const newSearchValues = { ...searchValues };

    if (value) {
      newSearchValues[columnKey] = value;
    } else {
      delete newSearchValues[columnKey];
    }

    setSearchValues(newSearchValues);
    setPage(1); // Reset to first page when search changes
  };


  const FetchRaisedTickets = async (pageNum = 1, pageSize = 10, filters: Record<string, any> = {}) => {
    const reqParams: RaisedTicketParams = {
      page: pageNum - 1, // API is 0-indexed
      size: pageSize,
      raisedBy: loginData?.hierarchyId,
      ...filters, // dynamic filters
    };

    try {
      const response = await fetch_raised_tickets(reqParams);
      if (response?.data?.statusCode == 200) {
        setTicketList(response?.data?.data?.content);
        setTotalRecords(response?.data?.data?.totalElements || 0);
      } else {
        showErrorNotification(response?.data?.message);
        setTicketList([]);
        setTotalRecords(0);
      }
    } catch (error) {
      await handleCustomError(error);
      setTicketList([]);
      setTotalRecords(0);
    }
  };

  const handleRefresh = () => {
    setIsSeacrh(false)
    setPage(1)
    setSize(10)
    setSearchValues({});
  }

  useEffect(() => {
    FetchRaisedTickets(page, size, searchValues);
  }, [page, size, searchValues])

  useEffect(() => {
    if (txIdFromQuery) {
      setShowTicketForm(true);
    }
  }, [txIdFromQuery]);

  return (
    <>
      {isLoading && <Loader />}
      <div className="flex w-full flex-col flex-wrap items-start justify-start">
        {!showTicketForm ? (
          <div className="w-full items-start justify-start">
            <div className="flex items-center justify-between">
              {/* Heading & Sub Heading */}
              <div>
                <TextComponent
                  fontSize={30}
                  fontWeight={500}
                  color={theme.palette.primary.main}
                >
                  Latest Ticket
                </TextComponent>
                <TextComponent
                  fontSize={18}
                  fontWeight={500}
                  color={theme.palette.gray.DEFAULT}
                >
                  Your most recent account ticket
                </TextComponent>
              </div>

              {/* Search Bar and Create New Ticket button */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center justify-end gap-2">
                  <div className="flex w-max items-center mt-6 justify-center gap-2 rounded-lg border-2 border-divider bg-background-paper px-2 py-[6px] ">
                    <UnstyledButton
                      onClick={handleRefresh}
                      className="flex w-max items-center justify-center gap-2 "
                    >
                      <Refresh color="primary" />
                    </UnstyledButton>
                  </div>

                  <div className="flex w-max items-center mt-6 justify-center gap-2 rounded-lg border-2 border-divider bg-background-paper px-2 py-[6px] ">
                    <UnstyledButton
                      onClick={() => setIsSeacrh(!isSeacrh)}
                      className="flex w-max items-center justify-center gap-2 "
                    >
                      <FilterSvgIcon color={theme.palette.primary.main} />
                      <TextComponent
                        fontSize={16}
                        fontWeight={400}
                        color={theme.palette.primary.main}
                        align="center"
                      >
                        Filter
                      </TextComponent>
                    </UnstyledButton>
                  </div>
                </div>

                {/* Create New Ticket Button */}
                <div className="mt-5">
                  <ButtonComponent
                    title="Create New Ticket"
                    variant="filled"
                    onClick={() => {
                      setShowTicketForm(true);
                      // setSearchValue("");
                    }}
                    radius={4}
                  />
                </div>
              </div>
            </div>

            <div className="w-full mt-5">
              {/* <div className="shadow-black-900/100 bg-transparent shadow-lg"> */}
              <TableComponent
                data={Array.isArray(ticketList) ? ticketList : [ticketList]}
                columns={filteredTableColumns}
                showSearch={isSeacrh}
                onSearch={(columnKey, value) =>
                  handleSearchWithValues(columnKey, value)
                }
                page={page}
                size={size}
                onPageChange={setPage}
                onPageSizeChange={(newSize) => {
                  setSize(newSize);
                  setPage(1); // reset to first page when size changes
                }}
                serverSide={true}
                totalRecords={totalRecords}
              />
              {/* </div> */}
              <ColumsSelectionModal
                open={showColumnModal}
                onClose={() => setShowColumnModal(false)}
                data={tableColumns}
                visibleColumns={visibleColumns}
                setVisibleColumns={setVisibleColumns}
              />
            </div>
          </div>
        ) : (
          // Ticket Form Page
          <div className="w-full items-start justify-start">
            {/* Back Button */}
            <UnstyledButton
              onClick={() => {
                if (txIdFromQuery) {
                  navigate("/reports/transaction-report", {
                    state: { fromTicket: true }
                  }); // your report page route
                } else {
                  setShowTicketForm(false);
                }
              }}
              className="mb-4"
            >
              <BackSvgIcon color={theme.palette.primary.main} />
            </UnstyledButton>

            {/* Heading & Sub Heading */}
            <div>
              <TextComponent
                fontSize={30}
                fontWeight={500}
                color={theme.palette.primary.main}
              >
                Support Ticket
              </TextComponent>
              <TextComponent
                fontSize={18}
                fontWeight={500}
                color={theme.palette.gray.DEFAULT}
              >
                Facing an issue? We're just a ticket away.
              </TextComponent>
            </div>

            {/* //Create New Ticket Form */}
            <div>
              <Formik<TicketingSystemProps>
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleTicketRequest}
                enableReinitialize={true}
              >
                {({
                  handleChange,
                  setFieldValue,
                  errors,
                  touched,
                  values,
                  handleSubmit,
                }) => (
                  <>
                    <div className="flex flex-wrap items-start justify-start gap-6 mt-5">
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextInputComponent
                          // label={
                          //   isTicketData?.transaction_id ? "" : "Transaction ID"
                          // }
                          label="Transaction ID"
                          placeholder={"Enter"}
                          value={values.transactionId}
                          onChange={handleChange("transactionId")}
                          error={
                            touched.transactionId && errors.transactionId
                              ? errors.transactionId
                              : ""
                          }
                          withAsterisk
                          className="w-max"
                        // disabled={isTicketData?.transaction_id && true}
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <DropdownComponent
                          label="Your Concern"
                          data={uniqueIssueTypes}
                          value={values.issueType}
                          withAsterisk
                          onChange={(value) =>
                            setFieldValue("issueType", value)
                          }
                          error={
                            touched.issueType && errors.issueType
                              ? errors.issueType
                              : ""
                          }
                          className="w-max"
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
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

                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <FileInputComponent
                          accept="image/png,image/jpeg, image/jpg,.pdf,application/pdf"
                          label={"Attachment"}
                          onChange={(file) => {
                            setFieldValue("screenshotImage", file);
                          }}
                          placeholder={"Choose"}
                          value={values?.screenshotImage || null}
                          withAsterisk
                          error={
                            touched.screenshotImage && errors.screenshotImage
                              ? errors.screenshotImage
                              : ""
                          }
                        />
                      </div>
                      <div className="w-full sm:w-[calc(50%-12px)] ">
                        <TextareaComponent
                          label={"Description"}
                          placeholder={"Enter"}
                          value={values.description}
                          onChange={handleChange("description")}
                          error={
                            touched.description && errors.description
                              ? errors.description
                              : ""
                          }
                          withAsterisk
                          className="w-max"
                        />
                      </div>
                    </div>
                    <div className="mt-5 flex w-full items-center justify-center">
                      <ButtonComponent
                        title="Submit"
                        variant="filled"
                        onClick={() => handleSubmit()}
                        radius={10}
                        width={130}
                      />
                    </div>
                  </>
                )}
              </Formik>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Ticketing;
