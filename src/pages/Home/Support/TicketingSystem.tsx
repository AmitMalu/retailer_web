import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import React, { useState } from "react";
import { useTheme } from "@mui/material";
import TicketComponent from "@/components/Molecules/TicketComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { TicketingSystemProps } from "@/Common/interface";
import TextareaComponent from "@/components/Atoms/TextareaComponent";

const Ticketing = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isTicketiData, setIsTicketiData] = useState(true);
  const [isCreateTicketForm, setIsCreateTicketForm] = useState(false);

  const initialValues: TicketingSystemProps = {
    transactionId: "",
    issueType: "",
    description: "",
    subProductName: "",
    email: "",
    mobileNumber: "",
  };

  const validationSchema = Yup.object().shape({
    transactionId: Yup.string().required("Required"),
    issueType: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    subProductName: Yup.string().required("Required"),
    email: Yup.string().required("Required"),
    mobileNumber: Yup.string().required("Required"),
  });

  const handleTicketRequest = (
    values: TicketingSystemProps,
    actions: FormikHelpers<TicketingSystemProps>
  ) => {
    setIsLoading(true);
    actions.setSubmitting(true);
    setTimeout(() => {
      setIsLoading(false);
      actions.setSubmitting(false);
      setIsCreateTicketForm(false);
    }, 2000);
  };

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
              <div>
                <div className="mt-5">
                  <ButtonComponent
                    title="Raise ticket"
                    variant="outline"
                    onClick={() => setIsTicketiData(false)}
                    radius={5}
                  />
                </div>
              </div>
            </div>
            <div className="w-full mt-5">
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
              <TicketComponent />
              <TicketComponent />
            </div>
          </div>
        ) : (
          <div className="w-full items-start justify-start">
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
            <div className="mt-5">
              <ButtonComponent
                title="Create ticket"
                variant="outline"
                onClick={() => setIsCreateTicketForm(true)}
                radius={5}
              />
            </div>
            {isCreateTicketForm && (
              <div>
                <Formik<TicketingSystemProps>
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleTicketRequest}
                >
                  {({
                    handleChange,
                    setFieldValue,
                    errors,
                    touched,
                    values,
                    handleSubmit,
                  }) => (
                    <div className="flex flex-col gap-3 mt-5">
                      <TextInputComponent
                        label={"Transaction ID"}
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
                      />
                      <TextInputComponent
                        label={"Issue Type"}
                        placeholder={"Enter"}
                        value={values.issueType}
                        onChange={handleChange("issueType")}
                        error={
                          touched.issueType && errors.issueType
                            ? errors.issueType
                            : ""
                        }
                        withAsterisk
                        className="w-max"
                      />
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
                      <TextInputComponent
                        label={"Sub Product Name"}
                        placeholder={"Enter"}
                        value={values.subProductName}
                        onChange={handleChange("subProductName")}
                        error={
                          touched.subProductName && errors.subProductName
                            ? errors.subProductName
                            : ""
                        }
                        withAsterisk
                        className="w-max"
                      />
                      <div className="mt-5 ">
                        <ButtonComponent
                          title="Submit"
                          variant="filled"
                          onClick={() => handleSubmit()}
                          radius={10}
                        />
                      </div>
                    </div>
                  )}
                </Formik>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Ticketing;
