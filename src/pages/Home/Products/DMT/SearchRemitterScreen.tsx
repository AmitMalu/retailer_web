import Loader from "@/components/Atoms/Loader";
import { useEffect, useState } from "react";
import TextComponent from "@/components/Atoms/TextComponent";
import { useTheme } from "@mui/system";
import { UnstyledButton } from "@mantine/core";
import { BackSvgIcon, OpenEyeSvgIcon } from "@/assets/svg";
import { useNavigate } from "react-router-dom";
import TableComponent from "@/components/Molecules/TableComponent";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FindRemitterProps, RemitterData } from "@/Common/interface";
import { MobileNoRegex } from "@/Utils/helper";
import { handleCustomError } from "@/Utils/handleCustomError";
import CustomDateComponent from "@/components/Atoms/CustomDateComponent";
import NewButtonComponent from "@/components/Atoms/NewComponents/ButtonComponent";
import RemitterReceiptModal from "@/components/Organism/DMT/RemitterReceipt";
import FormikTextInputComponent from "@/components/Molecules/NewComponents/FormikTextInputComponent";
import FormikDatePicker from "@/components/Molecules/NewComponents/FormikDatePicker";
import { showErrorNotification } from "@/Utils/notifications";

const SearchRemitterScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  const [isNewRemitter, setIsNewRemitter] = useState(false);
  const [isRemitterReceipt, setIsRemitterReceipt] = useState(false);

  const validationSchema = Yup.object({
    mobileNumber: Yup.string()
      .max(10, "Enter valid Number")
      .matches(MobileNoRegex, "Please enter valid number")
      .required("Mobile Number is Required"),
    ...(isNewRemitter && {
      name: Yup.string().required("Required"),
      dob: Yup.date()
        .max(new Date(), "Date of birth cannot be in the future")
        .required("Date of Birth is required"),
    }),
  });

  const initialValues: FindRemitterProps = {
    mobileNumber: "",
    name: "",
    dob: "",
  };

  const handleFindRemitterSubmit = async (values: FindRemitterProps) => {
    try {
      setIsLoading(true);
      // const response = await findRemitterAPI({ mobileNumber: values.mobileNumber });
      // If found, set remitter details
      // else, set isNewRemitter = true
    } catch (error) {
      // Handle API errors
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterRemitterSubmit = async (values: FindRemitterProps) => {
    try {
      setIsLoading(true);
      const payload = {
        mobileNumber: values.mobileNumber,
        name: values.name,
        dob: values.dob,
      };
      // const response = await registerRemitterAPI(payload);
      // Handle response, like navigation to KYC or success message
    } catch (error) {
      // Handle API errors
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
            onSubmit={(values) => {
              if (!isNewRemitter) {
                handleFindRemitterSubmit(values);
              } else {
                handleRegisterRemitterSubmit(values);
              }
            }}
            enableReinitialize
            validateOnBlur={true}
            validateOnChange={true}
          >
            {(formik) => {

              return (
                <Form className="w-full flex justify-center items-center">
                  <div className="w-full lg:w-1/2 p-2 items-center justify-center flex flex-col gap-4  rounded-xl border-2 border-red-light ">
                    <TextComponent
                      fontSize={28}
                      fontWeight={600}
                      color={theme.palette.red.DEFAULT}
                    >
                      Find Remitter
                    </TextComponent>
                    <div className="w-full  sm:w-[calc(70%-10px)]">
                      <FormikTextInputComponent
                        name="mobileNumber"
                        placeholder="Enter Mobile Number"
                        allowCharacter={false}
                        disabled={isNewRemitter}
                        allowSpace={false}
                        allowSpecialChar={false}
                        maxLength={10}
                        minLength={10}
                        withAsterisk
                      />
                    </div>
                    {isNewRemitter && (
                      <>
                        <div className="w-full  sm:w-[calc(70%-10px)]">
                          <FormikTextInputComponent
                            name="name"
                            placeholder="Enter Remitter Name"
                            allowSpecialChar={false}
                            allowNumber={false}
                            maxLength={30}
                            withAsterisk
                          />
                        </div>

                        <div className="w-full  sm:w-[calc(70%-10px)]">
                          <FormikDatePicker
                            name="dob"
                            placeholder="Enter DOB"
                            maxDate={new Date()}
                            required
                          />
                        </div>
                      </>
                    )}

                    <div className="mt-2 flex w-full items-center justify-end ">
                      <NewButtonComponent
                        fw="500"
                        bgColor={theme.palette.red.DEFAULT}
                        textColor="white"
                        type="submit"
                        style={{
                          padding: "3px 10px",
                          height: "32px",
                          cursor: "pointer",
                          fontSize: "14px",
                          borderRadius: "8px"
                        }}
                      >
                        Submit
                      </NewButtonComponent>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>

        <RemitterReceiptModal
          opened={isRemitterReceipt}
          onClose={() => setIsRemitterReceipt(false)}
        />
      </div>
    </>
  );
};

export default SearchRemitterScreen
