import { Card, Group, Stack, Divider, Button } from "@mantine/core";
import TextComponent from "@/components/Atoms/NewComponents/TextComponent";
import { useTheme } from "@mui/system";
import { EditSvgIcon } from "@/assets/svg";
import ButtonComponent from "@/components/Atoms/ButtonComponent";

const RemitterInfoHeader = ({ remitter, onEdit }: any) => {
    const theme = useTheme();

    return (
        <Card
            withBorder
            shadow="sm"
            mb={18}
            radius="md"
            style={{
                backgroundColor: "white",
                borderColor: theme.palette.grey.light,
                padding: "12px 18px",
            }}
        >
            <Group align="center" justify="space-between">
                <TextComponent
                    fontSize={18}
                    fontWeight={600}
                    color={theme.palette.red.DEFAULT}
                >
                    Remitter Details
                </TextComponent>

                <div>
                    <ButtonComponent
                        title="Edit Remitter"
                        variant="filled"
                        // onClick={() => setShowDrawerForm(true)}
                        radius={2}
                        fontSize={14}
                        width={150}
                        height={30}
                        leftIcon={<EditSvgIcon width="18" height="18" color={theme.palette.background.paper} />}
                    />
                </div>
            </Group>

            <Divider my="sm" />

            <Group grow align="center">
                <Stack gap={2}>
                    <TextComponent fontSize={12} fontWeight={400} color="#666">
                        Name
                    </TextComponent>
                    <TextComponent fontSize={12} fontWeight={600} color="#000">
                        {remitter?.name || "N/A"}
                    </TextComponent>
                </Stack>

                <Stack gap={2}>
                    <TextComponent fontSize={12} fontWeight={400} color="#666">
                        Mobile Number
                    </TextComponent>
                    <TextComponent fontSize={12} fontWeight={600} color="#000">
                        {remitter?.mobile || "N/A"}
                    </TextComponent>
                </Stack>

                <Stack gap={2}>
                    <TextComponent fontSize={12} fontWeight={400} color="#666">
                        Current Available Limit
                    </TextComponent>
                    <TextComponent fontSize={12} fontWeight={600} color="#000">
                        ₹{remitter?.availableLimit ?? 0}
                    </TextComponent>
                </Stack>
            </Group>
        </Card>
    );
};

export default RemitterInfoHeader;
