import { Modal } from "@mantine/core";
import NewButtonComponent from "@/components/Atoms/NewComponents/ButtonComponent";
import { useTheme } from "@mui/system";
import TextComponent from "@/components/Atoms/NewComponents/TextComponent";

export default function AepsOnboardModal({
    opened,
    onClose,
    onOnboard,
    retailerName
}: any) {

    const theme = useTheme()
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            size="lg"
            centered
            closeOnEscape={false}
            closeOnClickOutside={false}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            styles={{
                root: {
                    zIndex: 9999,
                    width: "100%",
                },
                title: {
                    fontSize: "1.5rem",
                    fontWeight: 600,
                },
                body: {
                    padding: "10px",
                },
                content: {
                    borderWidth: "2px",
                    borderRadius: 30,
                    borderColor: theme.palette.red.light,
                    scrollbarWidth: "none",
                },
            }}
            transitionProps={{
                transition: "fade",
                duration: 600,
                timingFunction: "linear",
            }}
        >
            <div className="p-4 text-center">
                <TextComponent fontSize={14} fontWeight={500} style={{ margin: "20px" }}>
                    Dear {retailerName || "User"}, You are not onboarded as an AEPS merchant.
                    Click below to complete onboarding & eKYC
                    to use AEPS services.
                </TextComponent>

                <div className="flex justify-center gap-3 mt-8">
                    <NewButtonComponent
                        bgColor={theme.palette.grey[500]}
                        textColor="white"
                        onClick={onClose}
                    >
                        CLOSE
                    </NewButtonComponent>

                    <NewButtonComponent
                        bgColor={theme.palette.primaryExtra.hover}
                        textColor="white"
                        onClick={onOnboard}
                    >
                        ONBOARD NOW
                    </NewButtonComponent>
                </div>
            </div>
        </Modal>
    );
}
