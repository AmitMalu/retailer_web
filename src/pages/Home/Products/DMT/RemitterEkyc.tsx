import { BackSvgIcon, FingerprintSvgIcon } from "@/assets/svg";
import { RemitterEkycFormProps } from "@/Common/interface";
import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import { handleCustomError } from "@/Utils/handleCustomError";
import { Checkbox, Radio, UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import { Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const RemitterEkyc = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  // const apiResponses = useSelector(
  //   (state: RootState) => state.apiResponse.responses
  // );

  // const loginData = apiResponses?.loginData
  //   ? decryptData(apiResponses?.loginData)
  //   : null;

  const validationSchema = Yup.object().shape({
    device: Yup.string().required("Required"),
    csp: Yup.boolean().required("Required"),
    alert: Yup.boolean().required("Required"),
  });

  const initialValues: RemitterEkycFormProps = {
    device: "",
    csp: false,
    alert: false,
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      //   const data = {
      //     fullName: values?.fullName,
      //     bankName: values?.bankName,
      //     bankAccountNumber: values?.bankAccountNumber,
      //     confirmBankAccountNumber: values?.confirmBankAccountNumber,
      //     ifscCode: values?.ifscCode,
      //   };

      // const response = await Create_Retailer(formData);
      // if (response?.status === 201 || response?.data?.statusCode === "201") {
      //   showSuccessNotification(response?.data?.message);
      //   onClose();
      // } else {
      //   showErrorNotification(response?.data?.message || "Unable to create");
      // }
    } catch (error: any) {
      await handleCustomError(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="w-full 320px:mt-12 md:mt-0">
        <div className="mb-6 flex items-center gap-6 justify-start">
          <UnstyledButton
            onClick={() => {
              navigate(`/products/dmt`);
            }}
          >
            <BackSvgIcon color={theme.palette.primary.main} />
          </UnstyledButton>
          <TextComponent
            fontSize={28}
            fontWeight={600}
            color={theme.palette.primary.main}
          >
            Remitter eKYC
          </TextComponent>
        </div>

        <div className="flex items-center justify-center gap-6">
          <Formik<RemitterEkycFormProps>
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => {
              return (
                <div className="w-full flex-col flex items-start justify-start gap-3">
                  <div className="flex w-full gap-2 items-center justify-between mt-6 rounded-xl border-2 border-primary-light p-4">
                    <div>
                      <TextComponent
                        fontSize={16}
                        fontWeight={400}
                        color={theme.palette.primary.main}
                      >
                        Please select a Device
                      </TextComponent>
                      <div>
                        <Radio.Group
                          name="device"
                          value={values.device}
                          onChange={(value) => setFieldValue("device", value)}
                        >
                          <div className="flex gap-6 mt-3 flex-wrap items-center justify-start w-[calc(80%-12px)] ">
                            <Radio
                              value="Mantra"
                              label="Mantra"
                              color={theme.palette.primary.main}
                              variant="outline"
                              checked={values.device === "Mantra"}
                              classNames={{
                                icon: "text-center",
                                inner:
                                  "text-center flex items-center justify-center",
                              }}
                            />
                            <Radio
                              value="Morpho"
                              label="Morpho"
                              color={theme.palette.primary.main}
                              variant="outline"
                              checked={values.device === "Morpho"}
                            />
                            <Radio
                              value="Precision"
                              label="Precision"
                              color={theme.palette.primary.main}
                              variant="outline"
                              checked={values.device === "Precision"}
                            />
                            <Radio
                              value="Startek"
                              label="Startek"
                              color={theme.palette.primary.main}
                              variant="outline"
                              checked={values.device === "Startek"}
                            />
                            <Radio
                              value="Tatvik"
                              label="Tatvik"
                              color={theme.palette.primary.main}
                              variant="outline"
                              checked={values.device === "Tatvik"}
                            />
                            <Radio
                              value="SecuGen"
                              label="SecuGen"
                              color={theme.palette.primary.main}
                              variant="outline"
                              checked={values.device === "SecuGen"}
                            />
                            <Radio
                              value="Cogent"
                              label="Cogent"
                              color={theme.palette.primary.main}
                              variant="outline"
                              checked={values.device === "Cogent"}
                            />
                          </div>
                        </Radio.Group>
                        <div className="mt-8">
                          <Checkbox
                            checked={values.csp}
                            onChange={(e) =>
                              setFieldValue("csp", e.currentTarget.checked)
                            }
                            label="C.S.P"
                            color={theme.palette.primary.main}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-[90px] h-[90px] mx-6">
                      <FingerprintSvgIcon color={theme.palette.primary.main} />
                    </div>
                  </div>
                  <div className="mt-3 self-start">
                    <Checkbox
                      checked={values.alert}
                      onChange={(e) =>
                        setFieldValue("alert", e.currentTarget.checked)
                      }
                      label="Alert!"
                      color={theme.palette.primary.main}
                    />
                  </div>
                </div>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default RemitterEkyc;
