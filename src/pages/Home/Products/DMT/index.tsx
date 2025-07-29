import Loader from "@/components/Atoms/Loader";
import { useState } from "react";
import TextComponent from "@/components/Atoms/TextComponent";
import { useTheme } from "@mui/system";
import { UnstyledButton } from "@mantine/core";
import { BackSvgIcon, OpenEyeSvgIcon } from "@/assets/svg";
import { useNavigate } from "react-router-dom";
import TableComponent from "@/components/Molecules/TableComponent";
import { Formik } from "formik";
import * as Yup from "yup";
import { FindRemitterProps, RemitterData } from "@/Common/interface";
import { MobileNoRegex } from "@/Utils/helper";
import { handleCustomError } from "@/Utils/handleCustomError";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import CustomDateComponent from "@/components/Atoms/CustomDateComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";

const DMTScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedRowData, setSelectedRowData] = useState<RemitterData | []>([]);
  const [isRemitterList, setIsRemitterList] = useState<RemitterData | []>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isNewRemitter, setIsNewRemitter] = useState(false);

  const validationSchema = Yup.object({
    mobileNumber: Yup.string()
      .max(10, "Enter valid Number")
      .matches(MobileNoRegex, "Please enter valid number")
      .required("Required"),
    ...(isNewRemitter && {
      name: Yup.string().required("Required"),
      dob: Yup.date().required("Required"),
    }),
  });

  const initialValues: FindRemitterProps = {
    mobileNumber: "",
    name: "",
    dob: "",
    page: currentPage,
    size: itemsPerPage,
  };

  const handleFindRemitterSubmit = async (values: FindRemitterProps) => {
    try {
      setIsLoading(true);
      setCurrentPage(values.page);
      setItemsPerPage(values.size);
      // let bodyRequest = {
      //   mobileNumber: values.mobileNumber,
      //   name: values.name,
      //   dob: values.dob,
      // };
      //   const response = await login(bodyRequest);
      //   if (
      //     response?.data?.statusCode === 200 ||
      //     response?.data?.statusCode === "200"
      //   ) {
      //     navigate("/otpInput", {
      //       state: { userName: values.userName, login: true },
      //     });
      //   } else {
      //     showErrorNotification(response?.data?.message || "Unable to login");
      //   }
    } catch (error: any) {
      await handleCustomError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const tableColumns = [
    {
      key: "action",
      label: "Action",
      render: (row: any) => (
        <div className="flex w-max items-center justify-between gap-2 justify-self-center">
          <UnstyledButton
            onClick={() => {
              setSelectedRowData(row);
            }}
          >
            <OpenEyeSvgIcon />
          </UnstyledButton>
        </div>
      ),
    },
    {
      key: "createdOn",
      label: "Date/Time",
      searchKey: "createdOn",
      sortable: false,
      type: "date",
    },
    {
      key: "accountNumber",
      label: "Account Number",
      searchKey: "accountNumber",
      sortable: false,
    },
    {
      key: "beneficiaryName",
      label: "Beneficiary Name",
      searchKey: "beneficiaryName",
      sortable: true,
    },
    {
      key: "bankName",
      label: "Bank Name",
      searchKey: "bankName",
      sortable: false,
    },
    {
      key: "remitterNumber",
      label: "Remitter Number",
      searchKey: "remitterNumber",
      sortable: true,
    },
    {
      key: "amount",
      label: "Amount",
      searchKey: "amount",
      sortable: false,
    },
    {
      key: "status",
      label: "Status",
      searchKey: "status",
      sortable: false,
    },
  ];

  return (
    <>
      {isLoading && <Loader />}
      <div className="w-full 320px:mt-12 md:mt-0">
        <UnstyledButton
          onClick={() => {
            navigate(`/products`);
          }}
        >
          <BackSvgIcon color={theme.palette.red.DEFAULT} />
        </UnstyledButton>
        <div className="mb-6 flex flex-col items-start gap-2 justify-start">
          <TextComponent
            fontSize={28}
            fontWeight={600}
            color={theme.palette.red.DEFAULT}
          >
            Mudra Remit
          </TextComponent>
          <TextComponent
            fontSize={16}
            fontWeight={400}
            color={theme.palette.grey.DEFAULT}
          >
            “As per Government of India and RBI Notification, Please ensure to
            enter COMPLETE & CORRECT NAME of Sender, Mobile Number and Address.
            Retailers not entering correct information of sender may face legal
            issues during Government audits.”
          </TextComponent>
        </div>

        <div className="flex items-center justify-center gap-6">
          <Formik<FindRemitterProps>
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleFindRemitterSubmit}
          >
            {({ values, errors, touched, setFieldValue, handleChange }) => {
              return (
                <>
                  <div className="w-1/2 p-2 items-center justify-center flex flex-col gap-4  rounded-xl border-2 border-red-light ">
                    <TextComponent
                      fontSize={28}
                      fontWeight={600}
                      color={theme.palette.red.DEFAULT}
                    >
                      Find Remitter
                    </TextComponent>
                    <div className="w-full  sm:w-[calc(70%-10px)]">
                      <TextInputComponent
                        label={"Mobile Number"}
                        placeholder={"Enter"}
                        value={values.mobileNumber}
                        onChange={handleChange("mobileNumber")}
                        error={
                          touched.mobileNumber && errors.mobileNumber
                            ? errors.mobileNumber
                            : ""
                        }
                        maxLength={10}
                        minLength={10}
                        withAsterisk
                        type="tel"
                      />
                    </div>
                    {isNewRemitter && (
                      <>
                        <div className="w-full  sm:w-[calc(70%-10px)]">
                          <TextInputComponent
                            label={"Name"}
                            placeholder={"Enter"}
                            value={values.name}
                            onChange={handleChange("name")}
                            error={
                              touched.name && errors.name ? errors.name : ""
                            }
                            maxLength={12}
                            minLength={12}
                            withAsterisk
                          />
                        </div>
                        <div className="w-full  sm:w-[calc(70%-10px)]">
                          <CustomDateComponent
                            label={"Remitter DOB"}
                            placeholder={"00/00/0000"}
                            value={values.dob ? new Date(values.dob) : null}
                            onChange={(value) => {
                              if (value instanceof Date) {
                                const dateOnly = new Date(value);
                                dateOnly.setHours(0, 0, 0, 0);
                                setFieldValue(
                                  "dob",
                                  dateOnly.toISOString().split("T")[0]
                                );
                              } else {
                                setFieldValue("dob", null);
                              }
                            }}
                            error={touched.dob && errors.dob ? errors.dob : ""}
                            withAsterisk
                            dateFormat="YYYY-MM-DD"
                          />
                        </div>
                      </>
                    )}

                    <div className="mt-2 flex w-full items-center justify-end ">
                      <ButtonComponent
                        title="Submit"
                        variant="filled"
                        onClick={() => navigate("/products/dmt/RemitterInfo")}
                        // onClick={() => handleSubmit()}
                        radius={20}
                        width={120}
                      />
                    </div>
                  </div>
                </>
              );
            }}
          </Formik>
        </div>

        <div className="mt-6">
          <TableComponent
            data={
              Array.isArray(isRemitterList) ? isRemitterList : [isRemitterList]
            }
            columns={tableColumns}
            // showSearch={isSeacrh}
            page={currentPage}
            size={itemsPerPage}
            onSelectRow={(row) => setSelectedRowData(row)}
            // onSearch={(columnKey, value) =>
            //   handleSearchWithValues(columnKey, value, values)
            // }
            // onPageChange={(page) => {
            //   setCurrentPage(page);
            //   const updatedValues = {
            //     ...values,
            //     page,
            //     size: itemsPerPage,
            //   };
            //   GetPayoutDataSubmit(updatedValues);
            // }}
            // onPageSizeChange={(size) => {
            //   setItemsPerPage(size);
            //   setCurrentPage(1);
            //   const updatedValues = {
            //     ...values,
            //     page: 1,
            //     size,
            //   };
            //   GetPayoutDataSubmit(updatedValues);
            // }}
          />
        </div>
      </div>
    </>
  );
};

export default DMTScreen;
