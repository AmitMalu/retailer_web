import ButtonComponent from "@/components/Atoms/ButtonComponent";
import { useEffect, useRef, useState } from "react";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";
import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import { ChildMemberListProps, FundReversalProps } from "@/Common/interface";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import { handleCustomError } from "@/Utils/handleCustomError";
import { Child_Member_List, Fund_Reversal } from "@/Services/api";

const FundReversal = () => {
  const [isLoading, setIsLoading] = useState(false);

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const [childMemberList, setChildMemberList] = useState<
    ChildMemberListProps[]
  >([]);
  const isFetchingRef = useRef(false);

  const GetChildList = async () => {
    try {
      setIsLoading(true);
      const response = await Child_Member_List(loginData?.hierarchyId);
      if (
        response?.data?.statusCode === 200 ||
        response?.data?.statusCode === 201
      ) {
        showSuccessNotification(response?.data?.message);
        setChildMemberList(response?.data?.data);
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
      GetChildList();
    }
  }, []);

  const validationSchema = Yup.object().shape({
    childHierarchyId: Yup.string().required("Required"),
    walletType: Yup.string().required("Required"),
    reversalAmount: Yup.string().required("Required"),
    confirmAmount: Yup.string()
      .required("Required")
      .oneOf([Yup.ref("reversalAmount")], "Amounts must match"),
    narration: Yup.string().required("Required"),
  });

  const initialValues: FundReversalProps = {
    parentHierarchyId: loginData?.hierarchyId,
    childHierarchyId: "",
    walletType: "",
    reversalAmount: "",
    confirmAmount: "",
    narration: "",
  };

  const handleFundRequest = async (
    values: FundReversalProps,
    { resetForm }: FormikHelpers<FundReversalProps>
  ) => {
    try {
      setIsLoading(true);

      const bodyData = {
        parentHierarchyId: values.parentHierarchyId || loginData?.hierarchyId,
        childHierarchyId: values.childHierarchyId,
        reversalAmount: values.reversalAmount,
        walletType: values.walletType,
      };
      const response = await Fund_Reversal(bodyData);
      if (response?.status === 200 || response?.status === 201) {
        showSuccessNotification(response?.data);
        resetForm();
      } else {
        showErrorNotification(response?.data);
      }
    } catch (error) {
      await handleCustomError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className=" flex w-full flex-col flex-wrap items-center justify-start gap-1">
        <div className="relative w-[80%]">
          <div className="absolute inset-0 bg-[#D82226] rounded-[20px] blur-[8px] h-full"></div>

          <div className="relative py-1 flex items-center justify-center">
            <TextComponent fontSize={30} fontWeight={500} color="white">
              Fund Transfer
            </TextComponent>
          </div>
        </div>
        <Formik<FundReversalProps>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFundRequest}
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
              <div className="mt-16 w-full flex flex-wrap items-start justify-start gap-6 ">
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <DropdownComponent
                    label="Reverse Account"
                    data={childMemberList.map((item) => item.userId)}
                    value={values.childHierarchyId}
                    withAsterisk
                    onChange={(value) =>
                      setFieldValue("childHierarchyId", value)
                    }
                    error={
                      touched.childHierarchyId && errors.childHierarchyId
                        ? errors.childHierarchyId
                        : ""
                    }
                    className="w-max"
                  />
                </div>
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <DropdownComponent
                    label="Wallet Type"
                    data={[
                      { value: "BOTH", label: "BOTH" },
                      { value: "POSTPAID", label: "POSTPAID" },
                      { value: "PREPAID", label: "PREPAID" },
                    ]}
                    value={values.walletType}
                    withAsterisk
                    onChange={(value) => setFieldValue("walletType", value)}
                    error={
                      touched.walletType && errors.walletType
                        ? errors.walletType
                        : ""
                    }
                    className="w-max"
                  />
                </div>
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <TextInputComponent
                    label={"Amount"}
                    placeholder={"Enter"}
                    value={values.reversalAmount}
                    onChange={handleChange("reversalAmount")}
                    error={
                      touched.reversalAmount && errors.reversalAmount
                        ? errors.reversalAmount
                        : ""
                    }
                    type="number"
                    withAsterisk
                    className="w-max"
                  />
                </div>
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <TextInputComponent
                    label={"Confirm Amount"}
                    placeholder={"Enter"}
                    value={values.confirmAmount}
                    onChange={handleChange("confirmAmount")}
                    error={
                      touched.confirmAmount && errors.confirmAmount
                        ? errors.confirmAmount
                        : ""
                    }
                    type="number"
                    withAsterisk
                    className="w-max"
                  />
                </div>
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <TextInputComponent
                    label={"Narration"}
                    placeholder={"Enter"}
                    value={values.narration}
                    onChange={handleChange("narration")}
                    error={
                      touched.narration && errors.narration
                        ? errors.narration
                        : ""
                    }
                    withAsterisk
                    className="w-max"
                  />
                </div>
              </div>
              <div className="mt-8 flex w-full items-center justify-end ">
                <ButtonComponent
                  title="Submit"
                  variant="filled"
                  onClick={() => handleSubmit()}
                  radius={20}
                />
              </div>
            </>
          )}
        </Formik>
      </div>
    </>
  );
};

export default FundReversal;
