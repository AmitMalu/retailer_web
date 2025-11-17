import { Group, Modal } from "@mantine/core";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import { useTheme } from "@mui/system";
import { DeleteSvgIcon } from "@/assets/svg";
import TextComponent from "@/components/Atoms/NewComponents/TextComponent";

const DeleteBeneficiaryModal = ({
    opened,
    onClose,
    isLoading,
    onDeleteSubmit,
    selectedRow
}: any) => {

    const theme = useTheme();

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Delete Beneficiary"
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
            <div className=" mt-3 flex h-full flex-col justify-center items-center">
                <DeleteSvgIcon height="60" color={theme.palette.red.DEFAULT} />
                <TextComponent fontSize={14} fontWeight={500} style={{ margin: "20px" }}>
                    Are you sure you want to delete this beneficiary?
                    {selectedRow?.accno && (
                        <>
                            <br />
                            <span style={{ fontWeight: 600, color: theme.palette.red.DEFAULT }}>
                                Account No: {selectedRow.accno}
                            </span>
                        </>
                    )}
                </TextComponent>
                <Group justify="center" className="flex h-full items-center">
                    <div className="flex w-max self-center">
                        <ButtonComponent
                            title="Cancel"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                            radius={10}
                            width={100}
                            fontSize={14}
                            height={40}
                        />
                    </div>

                    <div className="flex w-max self-center">
                        <ButtonComponent
                            title="Delete"
                            variant="filled"
                            onClick={() => onDeleteSubmit()}
                            disabled={isLoading}
                            radius={10}
                            width={100}
                            fontSize={14}
                            height={40}
                        />
                    </div>
                </Group>
            </div>
        </Modal>
    );
};

export default DeleteBeneficiaryModal;
