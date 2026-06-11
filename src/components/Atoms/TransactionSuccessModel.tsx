import { Modal, Paper } from "@mantine/core";
import React from "react";
import checkSvg from "../../assets/animation/checkIcon.gif"
import TextComponent from "./TextComponent";

interface TransactionSuccessModelProps {
    opened: boolean;
    onClose: () => void;
}

const TransactionSuccessModel: React.FC<TransactionSuccessModelProps> = ({
    opened,
    onClose,
}) => {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            centered
            withCloseButton={false}
            overlayProps={{
                opacity: 0.4,
                blur: 2,
            }}
            padding={"xl"}
            radius="md"
            size="lg"
        >
            <Paper p="xl">
                <div className="flex flex-col items-center justify-center">
                    <img src={checkSvg} alt="Success" className="w-24 h-24" />
                </div>

                <TextComponent
                    component="div"
                    fontFamily="inter"
                    fontSize={32}
                    weight={500}
                    align="center"
                    color="#47AF0C"
                    style={{ margin: "2rem" }}
                >
                    Transaction Successful!
                </TextComponent>

                <TextComponent
                    component="div"
                    fontFamily="inter"
                    fontSize={18}
                    weight={500}
                    align="center"
                    color="#3D3D3D"
                >
                    Your payment has been processed successfully.
                    <br />
                    Thank you for using our service.
                </TextComponent>
            </Paper>
        </Modal>
    );
};

export default TransactionSuccessModel;
