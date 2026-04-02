import { PartnerRegistrationModalProps } from "@/Common/interface";
import { Modal } from "@mantine/core";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import theme from "@/theme/ThemeConfig";
import TextComponent from "../../Atoms/TextComponent";
import { useNavigate } from "react-router-dom";

const RemitterEkycModal = ({
  opened,
  onClose,
  //   rowData,
  //   openedAs,
}: PartnerRegistrationModalProps) => {
  const navigate = useNavigate();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Remitter eKYC"
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
      <div className=" mt-3 flex h-full items-center justify-center ">
        <div className="border-2 w-full border-gray-dark rounded-lg p-3 gap-6 flex items-center flex-col justify-between">
          <div className="flex items-center justify-center">
            <TextComponent
              fontSize={16}
              fontWeight={500}
              color="text.primary"
            >
              eKYC
            </TextComponent>
          </div>
          <div className="flex w-max self-center">
            <ButtonComponent
              title="EKYC"
              variant="outline"
              onClick={() => {
                navigate("/products/dmt/remitterRegister");
              }}
              radius={10}
              width={120}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RemitterEkycModal;
