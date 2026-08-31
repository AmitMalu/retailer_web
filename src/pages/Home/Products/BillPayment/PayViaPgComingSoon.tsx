import { useTheme } from "@mui/system";
import { UnstyledButton } from "@mantine/core";
import TextComponent from "@/components/Atoms/TextComponent";
import { BackSvgIcon } from "@/assets/svg";

const PayViaPgComingSoon = ({ onBack }: { onBack: () => void }) => {
    const theme = useTheme();

    return (
        <div className="flex flex-col gap-6">
            <UnstyledButton onClick={onBack}>
                <BackSvgIcon color={theme.palette.primary.main} />
            </UnstyledButton>

            <div className="flex pt-3 min-h-64 flex-col items-center justify-start gap-4 overflow-hidden">
                <TextComponent
                    fontSize={28}
                    fontWeight={600}
                    color={theme.palette.primary.main}
                >
                    Pay via PG
                </TextComponent>
                <TextComponent fontSize={30} fontWeight={500} color="primary.main">
                    Coming Soon!
                </TextComponent>
            </div>
        </div>
    );
};

export default PayViaPgComingSoon;
