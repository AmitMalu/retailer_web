import { PartnerRegistrationModalProps } from "@/Common/interface";
import { Group, Modal } from "@mantine/core";
import { useState } from "react";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import { handleCustomError } from "@/Utils/handleCustomError";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import { Payout_Delete_Payout_BankDetails } from "@/Services/api";
import { useTheme } from "@mui/system";
import { DeleteSvgIcon } from "@/assets/svg";

const PayoutBankDeleteModal = ({
  opened,
  onClose,
  rowData,
  //   openedAs,
}: PartnerRegistrationModalProps) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const PayoutDeleteSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await Payout_Delete_Payout_BankDetails([rowData?.id]);
      if (response?.data?.statusCode === 200) {
        showSuccessNotification(response?.data?.data);
        onClose();
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
    <Modal
      opened={opened}
      onClose={onClose}
      title="Delete Beneficiary"
      size="md"
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
          padding: "20px",
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
        <DeleteSvgIcon color={theme.palette.primary.main} />
        <Group justify="center" mt="xl" className="flex h-full items-center">
          <div className="flex w-max self-center">
            <ButtonComponent
              title="Cancel"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              radius={10}
              width={100}
            />
          </div>

          <div className="flex w-max self-center">
            <ButtonComponent
              title="Delete"
              variant="filled"
              onClick={() => PayoutDeleteSubmit()}
              disabled={isLoading}
              radius={10}
              width={100}
            />
          </div>
        </Group>
      </div>
    </Modal>
  );
};

export default PayoutBankDeleteModal;
