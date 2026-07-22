import { BackSvgIcon } from "@/assets/svg";
import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import NewButtonComponent from "@/components/Atoms/NewComponents/ButtonComponent";
import FormikSelectComponent from "@/components/Molecules/NewComponents/FormikSelectComponent";
import FormikTextInputComponent from "@/components/Molecules/NewComponents/FormikTextInputComponent";
import { Form, Formik } from "formik";
import { Container, UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { Card, Grid, Stack, Group, Center, Box, Drawer } from "@mantine/core";
import React, { useEffect, useState, useRef } from "react";
import PlanDrawer from "./components/PlanDrawer";
import SubscriberCard, { Subscriber } from "./components/SubscriberCard";
import RechargeTransactionReceipt from "./RechargeTransactionReceipt";
import { Recharge_Fetch_Operator, Recharge_Fetch_Plans, Recharge_Mobile_Lookup, Recharge_Transaction, Recharge_DTH_Customer_Info } from "@/Services/api";
import { showErrorNotification, showSuccessNotification } from "@/Utils/notifications";
import { handleCustomError } from "@/Utils/handleCustomError";
import { RechargeOperatorListType, RechargeTransactionType } from "@/Common/interface";
import { useAppSelector } from "@/Redux/hooks";
import { decryptData, useWalletBalance } from "@/Utils/helper";
import ConfirmDialog from "@/components/Atoms/ConfirmDialog";

type CardType = {
    active: boolean;
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    onClick: () => void
}

function TypeCard({ active, icon, title, subtitle, onClick }: CardType) {
    return (
        <Box
            onClick={onClick}
            className={`border rounded-xl p-2 cursor-pointer transition-all
        ${active ? "border-primary-dark bg-background-paper" : "border-gray-200 bg-background-paper"}`}
        >
            <Group>
                <Center className="w-[42px] h-[42px] rounded-full bg-info-light text-xl">
                    {icon}
                </Center>

                <Stack gap={0}>
                    <div className="font-semibold">{title}</div>
                    <div className="text-xs text-gray-500">{subtitle}</div>
                </Stack>
            </Group>
        </Box>
    );
}
type RechargeType = "mobile" | "dth";

type RechargeFormValues = {
    rechargeType: RechargeType;
    mobileNumber: string;
    mobileOperator: string | null;
    amount: string;
    dthOperator: string | null;
    subscriberNumber: string;
};

const Recharge = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { subProductId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [plansDrawer, setPlansDrawer] = useState(false);
    const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
    const [operators, setOperators] = useState<RechargeOperatorListType[]>([])
    const [mobileOperators, setMobileOperators] = useState<any[]>([]);
    const [dthOperators, setDthOperators] = useState<any[]>([]);
    const [plans, setPlans] = useState<any>([]);
    const [lookupInfo, setLookupInfo] = useState<any>(null);
    const [planTypes, setPlanTypes] = useState<string[]>([]);
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState<any>(null);
    const resetFormRef = useRef<any>(null);

    // --- Payment confirmation dialog ---
    const [confirmOpen, setConfirmOpen] = useState(false);
    const pendingSubmitRef = React.useRef<{ values: RechargeFormValues; resetForm: () => void } | null>(null);

    const { responses } = useAppSelector(state => state.apiResponse)

    const loginData = responses?.loginData
        ? decryptData(responses.loginData)
        : null;

    const { WalletBalanceReq } = useWalletBalance();

    const schemeCode = loginData?.products
        ?.flatMap((product: any) => product.subProducts) // Flatten all subProducts into a single array
        ?.find((subProduct: any) => subProduct.subProductId === subProductId) // Find matching subProductId
        ?.schemeCode; // Get the schemeCode


    const initialValues: RechargeFormValues = {
        rechargeType: "mobile",
        mobileNumber: "",
        mobileOperator: null,
        amount: "",
        dthOperator: null,
        subscriberNumber: "",
    };

    const validationSchema = Yup.object({
        rechargeType: Yup.string()
            .oneOf(["mobile", "dth"])
            .required("Recharge type is required"),
        mobileNumber: Yup.string().when("rechargeType", {
            is: "mobile",
            then: (schema) =>
                schema
                    .required("Mobile number is required")
                    .length(10, "Enter valid mobile number"),
            otherwise: (schema) => schema.notRequired(),
        }),
        mobileOperator: Yup.string().nullable().when("rechargeType", {
            is: "mobile",
            then: (schema) => schema.required("Operator is required"),
            otherwise: (schema) => schema.notRequired(),
        }),
        amount: Yup.string()
            .required("Recharge amount is required")
            .matches(/^[1-9][0-9]*$/, "Enter valid amount"),
        dthOperator: Yup.string().nullable().when("rechargeType", {
            is: "dth",
            then: (schema) => schema.required("Operator is required"),
            otherwise: (schema) => schema.notRequired(),
        }),
        subscriberNumber: Yup.string().when("rechargeType", {
            is: "dth",
            then: (schema) =>
                schema
                    .required("Subscriber number is required")
                    .min(6, "Enter valid subscriber number")
                    .max(15, "Enter valid subscriber number"),
            otherwise: (schema) => schema.notRequired(),
        }),
    });

    const handleCheck = async (values: RechargeFormValues) => {
        if (!values.dthOperator || !values.subscriberNumber) return;

        try {
            setIsLoading(true);

            // Find the selected DTH operator to get its spKey
            const selectedOperator = dthOperators.find(
                (op: any) => op.value === values.dthOperator
            );

            if (!selectedOperator) {
                showErrorNotification("Selected operator not found");
                return;
            }

            const response = await Recharge_DTH_Customer_Info({
                subProductId: subProductId || "",
                accountNo: values.subscriberNumber,
                spkey: selectedOperator.value, // spKey from operator list
            });

            // Outer API failed
            if (response?.data?.statusCode !== 200) {
                showErrorNotification(response?.data?.message || "Failed to fetch subscriber info");
                setSubscriber(null);
                return;
            }

            const outerData = response?.data?.data;

            // Wrapper level failed
            if (!outerData || outerData.statusCode !== 1) {
                showErrorNotification(outerData?.msg || "Failed to fetch subscriber info");
                setSubscriber(null);
                return;
            }

            const innerData = outerData?.data;

            // Actual API failed (MOST IMPORTANT)
            if (!innerData || innerData.statusCode !== 1) {
                showErrorNotification(innerData?.msg || "Failed to fetch subscriber info");
                setSubscriber(null);
                return;
            }

            const fields: { key: string; value: string | null; ind: number }[] = innerData?.data || [];

            if (!fields.length) {
                showErrorNotification("No subscriber data found");
                setSubscriber(null);
                return;
            }

            const getValue = (...keys: string[]): string | null => {
                const normalizedKeys = keys.map((k) => k.toLowerCase());
                const field = fields.find((f) => normalizedKeys.includes(f.key?.trim().toLowerCase()));
                const val = field?.value;
                return val ? val.trim() : null;
            };

            // Map key-value array to SubscriberCard shape
            setSubscriber({
                name: getValue("customer name", "csutomer name"),
                status: getValue("status"),
                balance: getValue("balance"),
                lastRechargeAmount: getValue("last recharge amount"),
                lastRechargeDate: getValue("last recharge date"),
                monthlyRecharge: getValue("monthly recharge"),
                planName: getValue("plan name"),
                nextRechargeDate: getValue("next rechargedate", "next recharge date"),
            });

        } catch (err) {
            await handleCustomError(err);
            setSubscriber(null);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPlanWithOperator = async (spKey: string, circleId: string) => {
        try {
            setIsLoading(true);
            if (!circleId) {
                showErrorNotification("Unable to fetch plans");
                setPlans([]);
                return;
            }

            const response = await Recharge_Fetch_Plans({
                circleId: circleId || "",
                subProductId: subProductId || "",
                spkey: spKey
            });

            // Outer API failed
            if (response?.data?.statusCode !== 200) {
                showErrorNotification(response?.data?.message || "Failed to fetch plans");
                setPlans([]);
                return;
            }

            const outerData = response?.data?.data;

            // Wrapper level failed
            if (!outerData || outerData.statusCode !== 1) {
                showErrorNotification(outerData?.msg || "Failed to fetch plans");
                setPlans([]);
                return;
            }

            const innerData = outerData?.data;

            // Actual API failed (MOST IMPORTANT)
            if (!innerData || innerData.statusCode !== 1) {
                showErrorNotification(innerData?.msg || "Failed to fetch plans");
                setPlans([]);
                return;
            }

            const rawTypes = innerData?.data?.types || [];

            // No plans
            if (!rawTypes.length) {
                showErrorNotification("No plans available");
                setPlans([]);
                setPlanTypes([]);
                return;
            }

            // Extract tab names dynamically
            const typesList = rawTypes.map((t: any) => t.pType);
            setPlanTypes(typesList);

            // Flatten plans
            const flatPlans = rawTypes.flatMap((type: any) =>
                (type.pDetails || []).map((plan: any) => ({
                    amount: Number(plan.rs),
                    desc: plan.desc,
                    validity: plan.validity,
                    type: type.pType
                }))
            );

            setPlans(flatPlans);

            // optional auto open
            if (flatPlans.length) {
                setPlansDrawer(true);
            }

        } catch (err) {
            await handleCustomError(err);
            setPlans([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMobileLookup = async (
        mobileNumber: string,
        setFieldValue: (field: string, value: any) => void
    ) => {
        setIsLoading(true)
        try {
            const response = await Recharge_Mobile_Lookup({
                subProductId: subProductId || "",
                mobileNumber
            })

            if (response?.data?.statusCode == 200) {
                const lookupData = response?.data?.data;

                if (!lookupData || lookupData.statusCode !== 1) {
                    showErrorNotification("Unable to Fetch details");
                    return;
                }

                // store full lookup data
                setLookupInfo(lookupData);

                // pass setFieldValue forward
                handleOperatorMatch(
                    lookupData.operator,
                    lookupData.circleCode,
                    setFieldValue
                );

            } else {
                showErrorNotification(response?.data?.message);
            }
        } catch (err) {
            await handleCustomError(err);
        } finally {
            setIsLoading(false);
        }
    }

    const normalize = (str: string) =>
        str.toLowerCase().replace(/\s+/g, "");

    const handleOperatorMatch = (
        operatorNameFromLookup: string,
        circleCode: string,
        setFieldValue: (field: string, value: any) => void
    ) => {
        if (!operatorNameFromLookup || !operators.length) return;

        const matchedOperator = operators?.find((op: any) => {
            return (
                op?.type?.toLowerCase() === "mobile" &&
                normalize(op.name) === normalize(operatorNameFromLookup)
            );
        });

        if (!matchedOperator) {
            showErrorNotification("Operator not supported");
            return;
        }

        // Set operator in form
        setFieldValue("mobileOperator", String(matchedOperator.spKey));

        // Auto fetch plans with correct data
        fetchPlanWithOperator(matchedOperator.spKey, circleCode);
    };

    const fetchOperatorList = async () => {
        try {
            setIsLoading(true)
            const response = await Recharge_Fetch_Operator()
            if (response?.data && response?.data?.statusCode == 200) {
                const list = response?.data?.data || []

                setOperators(list)
                const mobile = list
                    ?.filter((op: any) => op?.type?.toLowerCase() === "mobile")
                    ?.map((op: any) => ({
                        value: String(op.spKey),
                        label: op.name.trim(),
                        data: op
                    }))
                const dth = list
                    ?.filter((op: any) => op?.type?.toLowerCase() === "dth")
                    ?.map((op: any) => ({
                        value: String(op.spKey),
                        label: op.name.trim(),
                        data: op
                    }))
                setMobileOperators(mobile)
                setDthOperators(dth)
            } else {
                showErrorNotification(response?.data?.message);
            }
        } catch (err) {
            await handleCustomError(err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchOperatorList();
    }, [])

    const handleSubmit = async (values: RechargeFormValues, resetForm: any) => {
        // Store resetForm function in ref for later use
        resetFormRef.current = resetForm;
        try {
            setIsLoading(true)

            const isMobile = values.rechargeType === "mobile"

            const operatorId = isMobile
                ? values.mobileOperator
                : values.dthOperator

            const selectedOperator = operators.find(
                (op) => String(op.spKey) === operatorId
            )

            if (!selectedOperator) {
                showErrorNotification("Operator not found")
                return
            }

            const payload: RechargeTransactionType = {
                amount: Number(values.amount),
                operatorCode: selectedOperator.code,
                operatorName: selectedOperator?.name,
                customerNumber: isMobile ? values.mobileNumber : values.subscriberNumber,
                subProductId: subProductId || "",
                schemeCode,
            }

            const response = await Recharge_Transaction(payload)
            const outerData = response?.data

            if (outerData?.statusCode === 200) {
                const innerData = outerData?.data
                // if (innerData?.status == "FAILED") {
                //     showErrorNotification(innerData?.message || "Failed to Process Recharge")
                // } else {
                showSuccessNotification("Recharge Processed")
                WalletBalanceReq(loginData?.hierarchyId);
                // Merge request and response data into single object for receipt
                const mergedData = {
                    ...payload,
                    ...innerData,
                    responseDateTime: innerData?.responseDateTime || new Date().toISOString()
                };
                setReceiptData(mergedData)
                setShowReceipt(true)
                // }
            } else {
                showErrorNotification(response?.data?.message || "Failed to Process Recharge")
            }

        } catch (err) {
            await handleCustomError(err)
        } finally {
            setIsLoading(false)
        }
    }

    const getSelectedOperatorName = (spKey: string) => {
        const op = mobileOperators.find(o => o.value === spKey);
        return op?.label || "";
    };

    const handleReceiptClose = () => {
        setShowReceipt(false);
        setSubscriber(null);
        if (resetFormRef.current) {
            resetFormRef.current();
        }
        setReceiptData(null);
    };

    return (
        <>
            {isLoading && <Loader />}
            <div className="w-full 320px:mt-12 md:mt-0">
                <div className="mb-6 flex items-center justify-start gap-6">
                    <UnstyledButton
                        onClick={() => {
                            navigate("/products/recharge");
                        }}
                    >
                        <BackSvgIcon color={theme.palette.primary.main} />
                    </UnstyledButton>

                    <TextComponent
                        fontSize={28}
                        fontWeight={600}
                        color={theme.palette.primary.main}
                    >
                        Recharge
                    </TextComponent>
                </div>

                <Formik<RechargeFormValues>
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {
                        // handleSubmit(values, resetForm)
                        pendingSubmitRef.current = { values, resetForm };
                        setConfirmOpen(true);
                    }}
                >
                    {({ values, setFieldValue, resetForm }) => {
                        const isMobile = values.rechargeType === "mobile";
                        const canViewPlans =
                            isMobile &&
                            values.mobileNumber?.length === 10
                            && values.mobileOperator;
                        const canCheckSubscriber =
                            !isMobile && values.dthOperator && values.subscriberNumber;
                        const canRecharge = isMobile
                            ? values.mobileNumber && values.mobileOperator && values.amount
                            : values.subscriberNumber && values.dthOperator && values.amount;

                        const handleTypeChange = (type: RechargeType) => {
                            if (values.rechargeType !== type) {
                                setPlansDrawer(false)
                                setSubscriber(null)
                                resetForm({
                                    values: {
                                        ...initialValues,
                                        rechargeType: type,
                                    },
                                });
                            }
                        };

                        return (
                            <Container size="xl">
                                <Grid justify="center" >
                                    <Grid.Col span={{ base: 12, md: 8, lg: 6, }} >
                                        <Card
                                            shadow="xl"
                                            radius="lg"
                                            withBorder
                                            p="xl"
                                        >
                                            <Form>
                                                <Stack gap="sm">
                                                    {/* Recharge Type Selector */}
                                                    <Group grow>
                                                        <TypeCard
                                                            active={isMobile}
                                                            icon="📱"
                                                            title="Mobile"
                                                            subtitle="Recharge"
                                                            onClick={() => handleTypeChange("mobile")}
                                                        />

                                                        <TypeCard
                                                            active={!isMobile}
                                                            icon="📺"
                                                            title="DTH"
                                                            subtitle="Television"
                                                            onClick={() => handleTypeChange("dth")}
                                                        />
                                                    </Group>

                                                    {/* Fields */}
                                                    <Grid>
                                                        {isMobile ? (
                                                            <>
                                                                <Grid.Col span={12}>
                                                                    <FormikTextInputComponent
                                                                        name="mobileNumber"
                                                                        label="Mobile Number"
                                                                        placeholder="Enter mobile number"
                                                                        maxLength={10}
                                                                        allowCharacter={false}
                                                                        allowSpecialChar={false}
                                                                        allowSpace={false}
                                                                        strictSpecialCharBlock
                                                                        withAsterisk
                                                                        size="sm"
                                                                        onChange={(e: any) => {
                                                                            const value = e.target.value;

                                                                            if (value !== values.mobileNumber) {

                                                                                setFieldValue("mobileNumber", value);

                                                                                // If user edits (less than 10 digits) → reset everything
                                                                                if (value.length < 10) {
                                                                                    setFieldValue("mobileOperator", null); // IMPORTANT
                                                                                    setPlans([]);
                                                                                    setLookupInfo(null);
                                                                                }

                                                                                // Call lookup only at 10 digits
                                                                                if (value.length === 10) {
                                                                                    fetchMobileLookup(value, setFieldValue);
                                                                                }
                                                                            }
                                                                        }}
                                                                    />
                                                                </Grid.Col>

                                                                <Grid.Col span={12}>
                                                                    <FormikSelectComponent
                                                                        name="mobileOperator"
                                                                        label="Operator"
                                                                        placeholder="Select operator"
                                                                        data={mobileOperators}
                                                                        searchable
                                                                        withAsterisk
                                                                        size="sm"
                                                                        onChange={(value: any) => {
                                                                            setFieldValue("mobileOperator", value);

                                                                            // Reset old plans (VERY IMPORTANT)
                                                                            setPlans([]);
                                                                        }}
                                                                    />
                                                                </Grid.Col>
                                                                {lookupInfo && values.mobileNumber?.length === 10 && (
                                                                    <Grid.Col span={12}>
                                                                        <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "-12px" }}>
                                                                            {getSelectedOperatorName(String(values.mobileOperator))}, {lookupInfo.circle}
                                                                        </div>
                                                                    </Grid.Col>
                                                                )}
                                                                <Grid.Col span={12}>
                                                                    <FormikTextInputComponent
                                                                        name="amount"
                                                                        label="Amount"
                                                                        placeholder="Enter recharge amount"
                                                                        maxLength={5}
                                                                        allowSpace={false}
                                                                        allowSpecialChar={false}
                                                                        allowCharacter={false}
                                                                        strictSpecialCharBlock
                                                                        withAsterisk
                                                                        size="sm"
                                                                    />
                                                                </Grid.Col>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Grid.Col span={12}>
                                                                    <FormikSelectComponent
                                                                        name="dthOperator"
                                                                        label="Operator"
                                                                        placeholder="Select operator"
                                                                        data={dthOperators}
                                                                        onChange={(value: any) => {
                                                                            setSubscriber(null)
                                                                            setFieldValue("dthOperator", value)
                                                                        }}
                                                                        searchable
                                                                        withAsterisk
                                                                        size="sm"
                                                                    />
                                                                </Grid.Col>

                                                                <Grid.Col span={12}>
                                                                    <FormikTextInputComponent
                                                                        name="subscriberNumber"
                                                                        label="Subscriber Number"
                                                                        placeholder="Enter subscriber number"
                                                                        onChange={(e: any) => {
                                                                            setSubscriber(null)
                                                                            setFieldValue("subscriberNumber", e.target.value)
                                                                        }}
                                                                        maxLength={15}
                                                                        withAsterisk
                                                                        allowSpace={false}
                                                                        allowSpecialChar={false}
                                                                        strictSpecialCharBlock
                                                                        size="sm"
                                                                    />
                                                                </Grid.Col>

                                                                <Grid.Col span={12}>
                                                                    <FormikTextInputComponent
                                                                        name="amount"
                                                                        label="Amount"
                                                                        placeholder="Enter recharge amount"
                                                                        maxLength={5}
                                                                        allowSpace={false}
                                                                        allowSpecialChar={false}
                                                                        allowCharacter={false}
                                                                        strictSpecialCharBlock
                                                                        withAsterisk
                                                                        size="sm"
                                                                    />
                                                                </Grid.Col>
                                                            </>
                                                        )}

                                                    </Grid>

                                                    {/* Buttons */}
                                                    <Group justify="space-between">
                                                        <NewButtonComponent
                                                            type="button"
                                                            variant="outline"
                                                            borderColor={theme.palette.primary.main}
                                                            textColor={theme.palette.primary.main}
                                                            radius={8}
                                                            fontSize="14"
                                                            fw="500"
                                                            disabled={isMobile ? !canViewPlans : !canCheckSubscriber}
                                                            onClick={() => {
                                                                if (isMobile) {

                                                                    // If plans already exist → open
                                                                    if (plans.length) {
                                                                        setPlansDrawer(true);
                                                                        return;
                                                                    }

                                                                    // Validate mobile number first
                                                                    if (!values.mobileNumber || values.mobileNumber.length !== 10) {
                                                                        showErrorNotification("Enter valid mobile number");
                                                                        return;
                                                                    }

                                                                    // Validate operator
                                                                    if (!values.mobileOperator) {
                                                                        showErrorNotification("Select operator");
                                                                        return;
                                                                    }

                                                                    // Use circle from lookup OR fallback
                                                                    const circleId = lookupInfo?.circleCode || "";

                                                                    fetchPlanWithOperator(
                                                                        values.mobileOperator,
                                                                        circleId
                                                                    );

                                                                } else {
                                                                    handleCheck(values);
                                                                }
                                                            }}
                                                        >
                                                            {isMobile ? "View Plans" : "Check"}
                                                        </NewButtonComponent>

                                                        <NewButtonComponent
                                                            type="submit"
                                                            bgColor={theme.palette.primary.main}
                                                            textColor="white"
                                                            radius={8}
                                                            fontSize="16"
                                                            fw="600"
                                                            disabled={!canRecharge}
                                                        >
                                                            Recharge
                                                        </NewButtonComponent>
                                                    </Group>
                                                </Stack>

                                                <PlanDrawer
                                                    opened={plansDrawer}
                                                    onClose={() => setPlansDrawer(false)}
                                                    plans={plans}
                                                    planTypes={planTypes}
                                                    setFieldValue={setFieldValue}
                                                />
                                            </Form>
                                        </Card>
                                    </Grid.Col>

                                    {!isMobile && subscriber && (
                                        <Grid.Col span={{ base: 12, md: 4 }}>
                                            <SubscriberCard subscriber={subscriber} />
                                        </Grid.Col>
                                    )}
                                </Grid>
                            </Container>
                        );
                    }}
                </Formik>
            </div >

            {/* Receipt Modal */}
            <Drawer
                opened={showReceipt}
                onClose={handleReceiptClose}
                size="xl"
                position="right"
                closeOnEscape={false}
                closeOnClickOutside={false}
                className="receipt-modal"
            >
                {receiptData && (
                    <RechargeTransactionReceipt
                        data={receiptData}
                    />
                )}
            </Drawer>

            {/* Payment Confirmation Dialog */}
            <ConfirmDialog
                opened={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={() => {
                    setConfirmOpen(false);
                    if (pendingSubmitRef.current) {
                        const { values, resetForm } = pendingSubmitRef.current;
                        pendingSubmitRef.current = null;
                        handleSubmit(values, resetForm);
                    }
                }}
            />
        </>
    );
};

export default Recharge;
