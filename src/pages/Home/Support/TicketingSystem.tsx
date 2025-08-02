import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material";
import TicketComponent from "@/components/Molecules/TicketComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  TicketingSystemProps,
  TransactionDetailsData,
} from "@/Common/interface";
import TextareaComponent from "@/components/Atoms/TextareaComponent";
import {
  Issue_Type_Dropdown,
  Raise_Ticket,
  Transaction_Details,
} from "@/Services/api";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import { handleCustomError } from "@/Utils/handleCustomError";
import { decryptData, useSubProductDropdown } from "@/Utils/helper";
import { RootState } from "@/Redux/Store";
import { useSelector } from "react-redux";
import { BackSvgIcon, SearchSvgIcon } from "@/assets/svg";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import FileInputComponent from "@/components/Atoms/FileInputComponent";
import { UnstyledButton } from "@mantine/core";

const Ticketing = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isTicketiData, setIsTicketiData] = useState(true);
  const [isTicketData, setIsTicketData] = useState<TransactionDetailsData>({});
  const [searchValue, setSearchValue] = useState("");
  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );

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

  const FetchUserList = async () => {
    try {
      let bodyRequest = {
        transactionId: searchValue,
        hierarchyId: loginData?.hierarchyId,
      };
      const response = await Transaction_Details(bodyRequest);
      if (response?.status === 200) {
        setIsTicketData(response?.data?.data);
      } else {
        showErrorNotification(response?.data?.message);
      }
    } catch (error) {
      await handleCustomError(error);
    }
  };

  const initialValues: TicketingSystemProps = {
    transactionId: isTicketData?.transaction_id
      ? isTicketData?.transaction_id
      : "",
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
        setIsTicketiData(true);
        setSearchValue("");
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

  return (
    <>
      {isLoading && <Loader />}
      <div className="flex w-full flex-col flex-wrap items-start justify-start">
        {isTicketiData ? (
          <div className="w-full items-start justify-start">
            <div className="flex items-center justify-between">
              <div>
                <TextComponent
                  fontSize={30}
                  fontWeight={500}
                  color={theme.palette.red.DEFAULT}
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
              <div className="flex items-center justify-between gap-3">
                <div className="mt-5">
                  <TextInputComponent
                    placeholder="Search by transaction ID"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    withAsterisk
                    className="w-max font-medium"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        FetchUserList();
                      }
                    }}
                    leftSection={
                      <SearchSvgIcon color={theme.palette.red.DEFAULT} />
                    }
                    isAuth={true}
                  />
                </div>
                <div className="mt-5">
                  <ButtonComponent
                    title="Create New Ticket"
                    variant="filled"
                    onClick={() => {
                      setIsTicketiData(false);
                      setSearchValue("");
                    }}
                    radius={5}
                  />
                </div>
              </div>
            </div>

            <div className="w-full mt-5">
              {isTicketData && Object.keys(isTicketData).length > 0 ? (
                <>
                  <div className="mb-2 flex w-full items-center justify-between ">
                    <div className="flex items-center justify-center w-1/6">
                      <TextComponent
                        fontSize={18}
                        fontWeight={500}
                        color={theme.palette.red.DEFAULT}
                      >
                        Requested By
                      </TextComponent>
                    </div>
                    <div className="flex items-center justify-center w-1/6">
                      <TextComponent
                        fontSize={18}
                        fontWeight={500}
                        color={theme.palette.red.DEFAULT}
                      >
                        Ticket ID No
                      </TextComponent>
                    </div>
                    <div className=" flex items-center justify-center w-1/3">
                      <div>
                        <TextComponent
                          fontSize={18}
                          fontWeight={500}
                          color={theme.palette.red.DEFAULT}
                        >
                          Subject
                        </TextComponent>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-1/12">
                      <TextComponent
                        fontSize={18}
                        fontWeight={500}
                        color={theme.palette.red.DEFAULT}
                      >
                        Status
                      </TextComponent>
                    </div>
                    <div className="flex items-center justify-center w-1/4 ">
                      <TextComponent
                        fontSize={18}
                        fontWeight={500}
                        color={theme.palette.red.DEFAULT}
                      >
                        Created Date
                      </TextComponent>
                    </div>
                  </div>
                  <TicketComponent
                    key={isTicketData.id}
                    name={loginData?.hierarchyId}
                    id={isTicketData.transaction_id}
                    subject={isTicketData.subject}
                    description={isTicketData.remarks}
                    status={isTicketData.tran_status}
                    createdDate={isTicketData.date_of_transaction}
                  />
                </>
              ) : (
                <div>
                  <TextComponent
                    fontSize={24}
                    fontWeight={500}
                    color={theme.palette.red.DEFAULT}
                    align="center"
                  >
                    No Ticket Available
                  </TextComponent>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full items-start justify-start">
            <UnstyledButton
              onClick={() => {
                setIsTicketiData(true);
                setSearchValue("");
              }}
              className="mb-4"
            >
              <BackSvgIcon color={theme.palette.red.DEFAULT} />
            </UnstyledButton>
            <div>
              <TextComponent
                fontSize={30}
                fontWeight={500}
                color={theme.palette.red.DEFAULT}
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
            <div>
              <div className="mt-5 w-[calc(20%-12px)] ">
                <TextInputComponent
                  placeholder="Search by transaction ID"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  withAsterisk
                  className="w-max font-medium"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      FetchUserList();
                    }
                  }}
                  isAuth={true}
                  leftSection={
                    <SearchSvgIcon color={theme.palette.red.DEFAULT} />
                  }
                />
              </div>
              {isTicketData && Object.keys(isTicketData).length > 0 && (
                <div className="mt-4 w-full flex flex-wrap items-start justify-between gap-2 ">
                  <div className="w-full sm:w-[calc(18%-12px)] lg:w-[calc(18%-16px)] gap-2">
                    <TextComponent
                      fontSize={18}
                      fontWeight={600}
                      color={theme.palette.red.DEFAULT}
                    >
                      Transaction ID:
                    </TextComponent>
                    <TextComponent
                      fontSize={18}
                      fontWeight={600}
                      color={theme.palette.gray.DEFAULT}
                    >
                      {isTicketData?.transaction_id || "-"}
                    </TextComponent>
                  </div>
                  <div className="w-full sm:w-[calc(15%-12px)] lg:w-[calc(15%-16px)] gap-2">
                    <TextComponent
                      fontSize={18}
                      fontWeight={600}
                      color={theme.palette.red.DEFAULT}
                    >
                      Created On:
                    </TextComponent>
                    <TextComponent
                      fontSize={18}
                      fontWeight={600}
                      color={theme.palette.gray.DEFAULT}
                    >
                      {isTicketData?.date_of_transaction || "-"}
                    </TextComponent>
                  </div>
                  <div className="w-full sm:w-[calc(15%-12px)] lg:w-[calc(15%-16px)] gap-2">
                    <TextComponent
                      fontSize={18}
                      fontWeight={600}
                      color={theme.palette.red.DEFAULT}
                    >
                      User ID:
                    </TextComponent>
                    <TextComponent
                      fontSize={18}
                      fontWeight={600}
                      color={theme.palette.gray.DEFAULT}
                    >
                      {loginData?.hierarchyId || "-"}
                    </TextComponent>
                  </div>
                  <div className="w-full sm:w-[calc(15%-12px)] lg:w-[calc(15%-16px)] gap-2">
                    <TextComponent
                      fontSize={18}
                      fontWeight={600}
                      color={theme.palette.red.DEFAULT}
                    >
                      Sub Product:
                    </TextComponent>
                    <TextComponent
                      fontSize={18}
                      fontWeight={600}
                      color={theme.palette.gray.DEFAULT}
                    >
                      {isTicketData?.sub_product_name || "-"}
                    </TextComponent>
                  </div>
                  {/* <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] gap-2">
                    <TextComponent
                      fontSize={18}
                      fontWeight={600}
                      color={theme.palette.red.DEFAULT}
                    >
                      Wallet Type:
                    </TextComponent>
                    <TextComponent
                      fontSize={18}
                      fontWeight={600}
                      color={theme.palette.gray.DEFAULT}
                    >
                      {UserProfileData?.address?.pinCode || "-"}
                    </TextComponent>
                  </div> */}
                  <div className="w-full sm:w-[calc(15%-12px)] lg:w-[calc(15%-16px)] gap-2">
                    <TextComponent
                      fontSize={18}
                      fontWeight={600}
                      color={theme.palette.red.DEFAULT}
                    >
                      Amount:
                    </TextComponent>
                    <TextComponent
                      fontSize={18}
                      fontWeight={600}
                      color={theme.palette.gray.DEFAULT}
                    >
                      {isTicketData?.amount || "-"}
                    </TextComponent>
                  </div>
                  <div className="w-full sm:w-[calc(15%-12px)] lg:w-[calc(15%-16px)] gap-2">
                    <TextComponent
                      fontSize={18}
                      fontWeight={600}
                      color={theme.palette.red.DEFAULT}
                    >
                      Status:
                    </TextComponent>
                    <TextComponent
                      fontSize={18}
                      fontWeight={600}
                      color={theme.palette.gray.DEFAULT}
                    >
                      {isTicketData?.tran_status || "-"}
                    </TextComponent>
                  </div>
                </div>
              )}
            </div>
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
                          label={
                            isTicketData?.transaction_id ? "" : "Transaction ID"
                          }
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
                          disabled={isTicketData?.transaction_id && true}
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
                    <div className="mt-5 flex w-full items-center justify-end">
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
