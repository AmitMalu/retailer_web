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
import { Card, Grid, Stack, Group, Center, Box } from "@mantine/core";
import { useEffect, useState } from "react";
import PlanDrawer from "./components/PlanDrawer";
import SubscriberCard from "./components/SubscriberCard";
import { Recharge_Fetch_Operator, Recharge_Transaction } from "@/Services/api";
import { showErrorNotification, showSuccessNotification } from "@/Utils/notifications";
import { handleCustomError } from "@/Utils/handleCustomError";
import { RechargeOperatorListType, RechargeTransactionType } from "@/Common/interface";
import { useAppSelector } from "@/Redux/hooks";
import { decryptData } from "@/Utils/helper";

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
        ${active ? "border-red-500 bg-red-50" : "border-gray-200 bg-white"}`}
        >
            <Group>
                <Center className="w-[42px] h-[42px] rounded-full bg-red-100 text-xl">
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
    const [subscriber, setSubscriber] = useState<any>(null);
    const [operators, setOperators] = useState<RechargeOperatorListType[]>([])
    const [mobileOperators, setMobileOperators] = useState<any[]>([]);
    const [dthOperators, setDthOperators] = useState<any[]>([]);
    const [plans, setPlans] = useState([
        {
            id: 1,
            amount: 199,
            validity: "28 days",
            desc: "1GB/day + Unlimited Calls"
        },
        {
            id: 2,
            amount: 239,
            validity: "28 days",
            desc: "1.5GB/day + Unlimited Calls"
        },
        {
            id: 3,
            amount: 299,
            validity: "28 days",
            desc: "2GB/day + Unlimited Calls"
        }
    ]);

    const { responses } = useAppSelector(state => state.apiResponse)

    const loginData = responses?.loginData
        ? decryptData(responses.loginData)
        : null;

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

    const handleCheck = () => {
        if (subscriber) {
            setSubscriber(null)
        } else {
            setSubscriber({
                name: "Rahul Sharma",
                balance: 20,
                status: "Active",
                lastRecharge: 299
            });
        }
    };

    useEffect(() => {
        const fetchOperatorList = async () => {
            try {
                setIsLoading(true)
                const response = await Recharge_Fetch_Operator()
                if (response?.data && response?.data?.statusCode == 200) {
                    const list = response?.data?.data || []
                    setOperators(list)
                    const mobile = list
                        .filter((op: any) => op.type === "MOBILE" && op.active)
                        .map((op: any) => ({
                            value: String(op.id),
                            label: op.name.trim(),
                            data: op
                        }))
                    const dth = list
                        .filter((op: any) => op.type === "DTH" && op.active)
                        .map((op: any) => ({
                            value: String(op.id),
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

        fetchOperatorList();

    }, [])

    const handleSubmit = async (values: RechargeFormValues) => {
        try {
            setIsLoading(true)

            const isMobile = values.rechargeType === "mobile"

            const operatorId = isMobile
                ? values.mobileOperator
                : values.dthOperator

            const selectedOperator = operators.find(
                (op: RechargeOperatorListType) => String(op.id) === operatorId
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

            if (response?.data?.statusCode === 200) {
                showSuccessNotification(response?.data?.message || "Recharge Processed")
            } else {
                showErrorNotification(response?.data?.message || "Failed to Process Recharge")
            }

        } catch (err) {
            await handleCustomError(err)
        } finally {
            setIsLoading(false)
        }
    }

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
                        <BackSvgIcon color={theme.palette.red.DEFAULT} />
                    </UnstyledButton>

                    <TextComponent
                        fontSize={28}
                        fontWeight={600}
                        color={theme.palette.red.DEFAULT}
                    >
                        Recharge
                    </TextComponent>
                </div>

                <Formik<RechargeFormValues>
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        handleSubmit(values)
                    }}
                >
                    {({ values, setFieldValue, resetForm }) => {
                        const isMobile = values.rechargeType === "mobile";
                        const canViewPlans =
                            isMobile && values.mobileOperator;
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
                                                            borderColor={theme.palette.red.DEFAULT}
                                                            textColor={theme.palette.red.DEFAULT}
                                                            radius={8}
                                                            fontSize="14"
                                                            fw="500"
                                                            disabled={isMobile ? !canViewPlans : !canCheckSubscriber}
                                                            onClick={() => {
                                                                if (isMobile) {
                                                                    setPlansDrawer(true)
                                                                } else {
                                                                    handleCheck()
                                                                }
                                                            }}
                                                        >
                                                            {isMobile ? "View Plans" : "Check"}
                                                        </NewButtonComponent>

                                                        <NewButtonComponent
                                                            type="submit"
                                                            bgColor={theme.palette.red.DEFAULT}
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
                                                    setFieldValue={setFieldValue}
                                                />
                                            </Form>
                                        </Card>
                                    </Grid.Col>

                                    {!isMobile && subscriber && (
                                        <Grid.Col span={{ base: 12, md: 3 }}>
                                            <SubscriberCard subscriber={subscriber} />
                                        </Grid.Col>
                                    )}
                                </Grid>
                            </Container>
                        );
                    }}
                </Formik>
            </div >
        </>
    );
};

export default Recharge;
