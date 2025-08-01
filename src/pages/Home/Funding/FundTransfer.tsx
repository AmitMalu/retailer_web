import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { RootState } from "@/Redux/Store";
import { decryptData } from "@/Utils/helper";
import { ChildMemberListProps, FundTransferProps } from "@/Common/interface";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import { handleCustomError } from "@/Utils/handleCustomError";
import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import DropdownComponent from "@/components/Atoms/DropdownComponent";
import TextInputComponent from "@/components/Atoms/TextInputComponent";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import { Child_Member_List, Fund_Transfer } from "@/Services/api";
const FundTransfer = () => {
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
        setChildMemberList(response?.data?.data?.content);
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
    toHierarchyId: Yup.string().required("Required"),
    amount: Yup.string().required("Required"),
    confirmAmount: Yup.string()
      .required("Required")
      .oneOf([Yup.ref("amount")], "Amounts must match"),
    fromWalletType: Yup.string().required("Required"),
    toWalletType: Yup.string().required("Required"),
    narration: Yup.string().required("Required"),
  });

  const initialValues: FundTransferProps = {
    fromHierarchyId: loginData?.hierarchyId,
    toHierarchyId: "",
    amount: "",
    confirmAmount: "",
    fromWalletType: "",
    toWalletType: "",
    narration: "",
  };

  const handleFundRequest = async (
    values: FundTransferProps,
    { resetForm }: FormikHelpers<FundTransferProps>
  ) => {
    try {
      setIsLoading(true);

      const bodyData = {
        fromHierarchyId: values.fromHierarchyId || loginData?.hierarchyId,
        toHierarchyId: values.toHierarchyId,
        amount: values.amount,
        confirmAmount: values.confirmAmount,
        fromWalletType: values.fromWalletType,
        toWalletType: values.toWalletType,
        narration: values.narration,
      };
      const response = await Fund_Transfer(bodyData);
      if (response?.status === 200 || response?.status === 201) {
        showSuccessNotification(response?.data?.message);
        resetForm();
      } else {
        showErrorNotification(response?.data?.message);
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
        <Formik<FundTransferProps>
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
                    label="To Account"
                    data={childMemberList.map((item) => item.userId)}
                    value={values.toHierarchyId}
                    withAsterisk
                    onChange={(value) => setFieldValue("toHierarchyId", value)}
                    error={
                      touched.toHierarchyId && errors.toHierarchyId
                        ? errors.toHierarchyId
                        : ""
                    }
                    className="w-max"
                  />
                </div>
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <DropdownComponent
                    label="From Wallet Type"
                    data={[
                      { value: "PREPAID", label: "PREPAID" },
                      { value: "POSTPAID", label: "POSTPAID" },
                    ]}
                    value={values.fromWalletType}
                    withAsterisk
                    onChange={(value) => setFieldValue("fromWalletType", value)}
                    error={
                      touched.fromWalletType && errors.fromWalletType
                        ? errors.fromWalletType
                        : ""
                    }
                    className="w-max"
                  />
                </div>
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <DropdownComponent
                    label="To Wallet Type"
                    data={[
                      { value: "PREPAID", label: "PREPAID" },
                      { value: "POSTPAID", label: "POSTPAID" },
                    ]}
                    value={values.toWalletType}
                    withAsterisk
                    onChange={(value) => setFieldValue("toWalletType", value)}
                    error={
                      touched.toWalletType && errors.toWalletType
                        ? errors.toWalletType
                        : ""
                    }
                    className="w-max"
                  />
                </div>
                <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <TextInputComponent
                    label={"Amount"}
                    placeholder={"Enter"}
                    value={values.amount}
                    onChange={handleChange("amount")}
                    error={touched.amount && errors.amount ? errors.amount : ""}
                    withAsterisk
                    className="w-max"
                    type="number"
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
                  width={130}
                />
              </div>
            </>
          )}
        </Formik>
      </div>
    </>
  );
};

export default FundTransfer;
