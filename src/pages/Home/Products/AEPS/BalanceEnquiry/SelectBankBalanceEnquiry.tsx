import { Formik } from "formik";
import * as Yup from "yup";
import { useTheme } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MobileNoRegex } from "@/Utils/helper";
import { handleCustomError } from "@/Utils/handleCustomError";
import Loader from "@/components/Atoms/Loader";
import { Checkbox, Radio, UnstyledButton } from "@mantine/core";
import { BackSvgIcon, FingerprintSvgIcon } from "@/assets/svg";
import TextComponent from "@/components/Atoms/TextComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import { AepsFormBodyProps } from "@/Common/interface";
import DropdownComponent from "@/components/Atoms/DropdownComponent";

const SelectBankBalanceEnquiry = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object({
    mobileNumber: Yup.string()
      .max(10, "Enter valid Number")
      .matches(MobileNoRegex, "Please enter valid number")
      .required("Required"),
    aadhaarNumber: Yup.string()
      .matches(/^\d+$/, "Aadhaar number must contain only digits")
      .max(12, "Enter valid Number")
      .min(12, "Enter valid Number")
      .required("Required"),
    amount: Yup.string()
      .matches(/^\d+(\.\d{1,2})?$/, "Amount must be a valid number")
      .required("Required"),
    bank: Yup.string().required("Required"),
    deviceType: Yup.string().required("Required"),
    csp: Yup.string().required("Required"),
    alert: Yup.boolean().required("Required"),
  });

  const initialValues: AepsFormBodyProps = {
    mobileNumber: "",
    aadhaarNumber: "",
    amount: "",
    bank: "",
    deviceType: "",
    csp: "",
    alert: false,
  };

  const handleCashWithdrawalSubmit = async () =>
    // values: FetchCardBinDetailProps,
    // { setFieldValue }: FormikHelpers<PGFormBodyProps>
    {
      try {
        setIsLoading(true);
        //   const data: any = {
        //     cardBinNo: values.cardBinNo,
        //   };

        //   const response = await Fetch_Card_Bin_Detail(data);
        //   if (response?.status === 200 || response?.data?.statusCode === "200") {
        //     showSuccessNotification(response?.data?.message);
        //     setFieldValue("paymentMethod", response?.data?.data?.cardType);
        //     setIsBinDetails(true);
        //   } else {
        //     showErrorNotification(response?.data?.message || "Unable to fetch");
        //   }
      } catch (error: any) {
        await handleCustomError(error);
      } finally {
        setIsLoading(false);
      }
    };
  return (
    <>
      {isLoading && <Loader />}
      <div className="w-full 320px:mt-12 md:mt-0">
        <UnstyledButton
          onClick={() => {
            navigate(`/products/aepsScreen/vendors/balanceEnquiry`);
          }}
        >
          <BackSvgIcon color={theme.palette.red.DEFAULT} />
        </UnstyledButton>
        <div className="w-full mb-6 flex flex-col items-center gap-6 justify-center">
          <TextComponent
            fontSize={28}
            fontWeight={600}
            color={theme.palette.red.DEFAULT}
          >
            Cash Withdrawal
          </TextComponent>
          <div className="w-full">
            <Formik<AepsFormBodyProps>
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleCashWithdrawalSubmit}
            >
              {({ values, handleChange, errors, touched, setFieldValue }) => {
                return (
                  <div className="w-full flex items-start justify-start gap-3">
                    <div className="w-1/3 bg-red-light p-4 items-center justify-center flex flex-col gap-3  rounded-xl border-2 border-red-light ">
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
                      <div className="w-full  sm:w-[calc(70%-10px)]">
                        <TextInputComponent
                          label={"Adhaar Number"}
                          placeholder={"Enter"}
                          value={values.aadhaarNumber}
                          onChange={handleChange("aadhaarNumber")}
                          error={
                            touched.aadhaarNumber && errors.aadhaarNumber
                              ? errors.aadhaarNumber
                              : ""
                          }
                          maxLength={12}
                          minLength={12}
                          withAsterisk
                        />
                      </div>
                      <div className="w-full  sm:w-[calc(70%-10px)]">
                        <TextInputComponent
                          label={"Amount"}
                          placeholder={"Enter"}
                          value={values.amount}
                          onChange={handleChange("amount")}
                          error={
                            touched.amount && errors.amount ? errors.amount : ""
                          }
                          withAsterisk
                        />
                      </div>
                    </div>
                    <div className="w-2/3 p-4 border-2 border-gray-light rounded-xl flex flex-col items-center justify-start">
                      <div className="flex w-full gap-2 items-center justify-between">
                        <div className="flex flex-col gap-2 items-center justify-start justify-self-start">
                          <TextComponent
                            fontSize={20}
                            fontWeight={400}
                            color={theme.palette.red.DEFAULT}
                          >
                            Select Bank
                          </TextComponent>
                          <div>bank logo list</div>
                        </div>
                        <div className="w-full sm:w-[calc(30%-12px)] ">
                          <DropdownComponent
                            label="Bank"
                            data={[
                              { value: "Card", label: "Card" },
                              { value: "Other", label: "Other" },
                            ]}
                            value={values.bank}
                            withAsterisk
                            onChange={(value) => setFieldValue("bank", value)}
                            error={
                              touched.bank && errors.bank ? errors.bank : ""
                            }
                            className="w-max"
                          />
                        </div>
                      </div>
                      <div className="flex w-full gap-2 items-center justify-between mt-6 rounded-xl border-2 border-red-light p-4">
                        <div>
                          <TextComponent
                            fontSize={16}
                            fontWeight={400}
                            color={theme.palette.red.DEFAULT}
                          >
                            Please select a Device
                          </TextComponent>
                          <div>
                            <Radio.Group>
                              <div className="flex gap-4 mt-3 flex-wrap items-center justify-start w-[calc(80%-12px)] ">
                                <Radio
                                  value="Mantra"
                                  label="Mantra"
                                  color={theme.palette.red.DEFAULT}
                                  variant="outline"
                                  checked={false}
                                  onChange={() => {}}
                                  classNames={{
                                    icon: "text-center",
                                    inner:
                                      "text-center flex items-center justify-center",
                                  }}
                                />
                                <Radio
                                  value="Morpho"
                                  label="Morpho"
                                  color={theme.palette.red.DEFAULT}
                                  variant="outline"
                                  checked={false}
                                  onChange={() => {}}
                                />
                                <Radio
                                  value="Precision"
                                  label="Precision"
                                  color={theme.palette.red.DEFAULT}
                                  variant="outline"
                                  checked={false}
                                  onChange={() => {}}
                                />
                                <Radio
                                  value="Startek"
                                  label="Startek"
                                  color={theme.palette.red.DEFAULT}
                                  variant="outline"
                                  checked={false}
                                  onChange={() => {}}
                                />
                                <Radio
                                  value="Tatvik"
                                  label="Tatvik"
                                  color={theme.palette.red.DEFAULT}
                                  variant="outline"
                                  checked={false}
                                  onChange={() => {}}
                                />
                                <Radio
                                  value="SecuGen"
                                  label="SecuGen"
                                  color={theme.palette.red.DEFAULT}
                                  variant="outline"
                                  checked={false}
                                  onChange={() => {}}
                                />
                                <Radio
                                  value="Cogent"
                                  label="Cogent"
                                  color={theme.palette.red.DEFAULT}
                                  variant="outline"
                                  checked={false}
                                  onChange={() => {}}
                                />
                              </div>
                            </Radio.Group>
                            <div className="mt-3">
                              <Checkbox
                                checked={false}
                                onChange={() => {}}
                                label="C.S.P"
                                color={theme.palette.red.DEFAULT}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="w-[90px] h-[90px] mx-6">
                          <FingerprintSvgIcon
                            color={theme.palette.red.DEFAULT}
                          />
                        </div>
                      </div>
                      <div className="mt-3 self-start">
                        <Checkbox
                          checked={false}
                          onChange={() => {}}
                          label="Alert!"
                          color={theme.palette.red.DEFAULT}
                        />
                      </div>
                    </div>
                  </div>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectBankBalanceEnquiry;
