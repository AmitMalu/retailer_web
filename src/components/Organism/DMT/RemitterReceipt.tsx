import { PartnerRegistrationModalProps } from "@/Common/interface";
import { Modal } from "@mantine/core";
import React, { useRef, useState } from "react";
import theme from "@/theme/ThemeConfig";
import TextComponent from "@/components/Atoms/TextComponent";
import ImFullLogo from "@/assets/svg/ImFullLogo";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import { PrinterSvgIcon } from "@/assets/svg";
import { useReactToPrint } from "react-to-print";

const ReceiptContent = React.forwardRef<
  HTMLDivElement,
  { orientation: "portrait" | "landscape"; isThermal?: boolean }
>(({ orientation, isThermal = false }, ref) => {
  return (
    <div
      ref={ref}
      className={`${isThermal ? "thermal-receipt" : ""} ${orientation === "landscape" ? "landscape-print" : "portrait-print"}`}
      style={{
        padding: isThermal ? "10px" : "20px",
        width: isThermal ? "80mm" : "100%",
        fontFamily: isThermal ? "monospace" : "inherit",
        fontSize: isThermal ? "12px" : "14px",
      }}
    >
      <div className="flex w-full flex-col border-2 border-red-light rounded-xl">
        <div className="flex items-center justify-between border-b-2 border-b-red-light">
          <div className="flex items-center justify-center border-r-2 p-4 border-r-red-light w-[calc(35%-10px)]">
            <ImFullLogo />
          </div>
          <div className="flex p-4 w-[calc(65%-10px)]">
            <TextComponent
              fontSize={16}
              fontWeight={500}
              color={theme.palette.background.default}
              align="left"
            >
              Demo/IM-R-009650/9653192852
            </TextComponent>
          </div>
        </div>
        <div className="flex items-center justify-between pl-4 py-2 border-b-2 border-b-red-light">
          <TextComponent
            fontSize={16}
            fontWeight={500}
            color={theme.palette.background.default}
          >
            Transactions Receipts
          </TextComponent>
        </div>
        <div className="flex w-full items-center justify-between border-b-2 border-b-red-light">
          <div className="flex items-center justify-start border-r-2 px-4 py-2 border-r-red-light w-[calc(45%-10px)]">
            <TextComponent
              fontSize={16}
              fontWeight={500}
              color={theme.palette.background.default}
            >
              Transfer to:
            </TextComponent>
          </div>
          <div className="flex px-4 py-2 w-[calc(65%-10px)]">
            <TextComponent
              fontSize={16}
              fontWeight={400}
              color={theme.palette.background.default}
            >
              Mamata Gawand
            </TextComponent>
          </div>
        </div>
        <div className="flex w-full items-center justify-between border-b-2 border-b-red-light">
          <div className="flex items-center justify-start border-r-2 px-4 py-2 border-r-red-light w-[calc(20%-10px)]">
            <TextComponent
              fontSize={16}
              fontWeight={500}
              color={theme.palette.background.default}
            >
              Date
            </TextComponent>
          </div>
          <div className="flex px-4 py-2 w-[calc(40%-10px)] border-r-2 border-r-red-light">
            <TextComponent
              fontSize={16}
              fontWeight={400}
              color={theme.palette.background.default}
            >
              29-07-2025 05:40 pm
            </TextComponent>
          </div>
          <div className="flex px-4 py-2 w-[calc(30%-10px)] border-r-2 border-r-red-light">
            <TextComponent
              fontSize={16}
              fontWeight={500}
              color={theme.palette.background.default}
            >
              Transaction Mode
            </TextComponent>
          </div>
          <div className="flex px-4 py-2 w-[calc(20%-10px)]">
            <TextComponent
              fontSize={16}
              fontWeight={400}
              color={theme.palette.background.default}
            >
              ACCV
            </TextComponent>
          </div>
        </div>
        <div className="flex w-full items-center justify-between border-b-2 border-b-red-light">
          <div className="flex items-center justify-start border-r-2 px-4 py-2 border-r-red-light w-[calc(20%-10px)]">
            <TextComponent
              fontSize={16}
              fontWeight={500}
              color={theme.palette.background.default}
            >
              Sender Name
            </TextComponent>
          </div>
          <div className="flex px-4 py-2 w-[calc(25%-10px)] border-r-2 border-r-red-light">
            <TextComponent
              fontSize={16}
              fontWeight={400}
              color={theme.palette.background.default}
            >
              Umair
            </TextComponent>
          </div>
          <div className="flex px-4 py-2 w-[calc(25%-10px)] border-r-2 border-r-red-light">
            <TextComponent
              fontSize={16}
              fontWeight={500}
              color={theme.palette.background.default}
            >
              Receiver Bank
            </TextComponent>
          </div>
          <div className="flex px-4 py-2 w-[calc(30%-10px)]">
            <TextComponent
              fontSize={16}
              fontWeight={400}
              color={theme.palette.background.default}
            >
              Chikhli Urben Co-Op Bank
            </TextComponent>
          </div>
        </div>
        <div className="flex w-full items-center justify-between border-b-2 border-b-red-light">
          <div className="flex items-center justify-start border-r-2 px-4 py-2 border-r-red-light w-[calc(20%-10px)]">
            <TextComponent
              fontSize={16}
              fontWeight={500}
              color={theme.palette.background.default}
            >
              IFSC Code
            </TextComponent>
          </div>
          <div className="flex px-4 py-2 w-[calc(80%-10px)] ">
            <TextComponent
              fontSize={16}
              fontWeight={400}
              color={theme.palette.background.default}
            >
              ICIC000000
            </TextComponent>
          </div>
        </div>
        <div className="flex w-full items-center justify-between border-b-2 border-b-red-light">
          <div className="flex items-center justify-start border-r-2 px-4 py-2 border-r-red-light w-[calc(20%-10px)]">
            <TextComponent
              fontSize={16}
              fontWeight={500}
              color={theme.palette.background.default}
            >
              Txn | UTR/RRN
            </TextComponent>
          </div>
          <div className="flex items-center justify-start border-r-2 px-4 py-2 border-r-red-light w-[calc(15%-10px)]">
            <TextComponent
              fontSize={16}
              fontWeight={400}
              color={theme.palette.background.default}
            >
              NA
            </TextComponent>
          </div>
          <div className="flex px-4 py-2 w-[calc(30%-10px)] border-r-2 border-r-red-light">
            <TextComponent
              fontSize={16}
              fontWeight={500}
              color={theme.palette.background.default}
            >
              Transaction Amount:
            </TextComponent>
            <TextComponent
              fontSize={16}
              fontWeight={400}
              color={theme.palette.background.default}
            >
              300
            </TextComponent>
          </div>
          <div className="flex px-4 py-2 w-[calc(25%-10px)] border-r-2 border-r-red-light">
            <TextComponent
              fontSize={16}
              fontWeight={500}
              color={theme.palette.background.default}
            >
              TX ID:
            </TextComponent>
            <TextComponent
              fontSize={16}
              fontWeight={400}
              color={theme.palette.background.default}
            >
              04055051025950040550
            </TextComponent>
          </div>
          <div className="flex px-4 py-2 w-[calc(20%-10px)]">
            <TextComponent
              fontSize={16}
              fontWeight={500}
              color={theme.palette.background.default}
            >
              Transaction Status:
            </TextComponent>
            <TextComponent
              fontSize={16}
              fontWeight={400}
              color={theme.palette.background.default}
            >
              Failed
            </TextComponent>
          </div>
        </div>
      </div>
    </div>
  );
});

const RemitterReceiptModal = ({
  opened,
  onClose,
  // rowData,
  //   openedAs,
}: PartnerRegistrationModalProps) => {
  // const apiResponses = useSelector(
  //   (state: RootState) => state.apiResponse.responses
  // );

  // const loginData = apiResponses?.loginData
  //   ? decryptData(apiResponses?.loginData)
  //   : null;

  // const ipAddress = apiResponses?.ipAddress
  //   ? decryptData(apiResponses?.ipAddress)
  //   : null;

  // const [isLoading, setIsLoading] = useState(false);

  // const GetReceipt = async () => {
  //   try {
  //     setIsLoading(true);

  //     // const data: any = {
  //     //   name: values?.name,
  //     //   address: values?.address,
  //     //   otp: values?.otp,
  //     // };

  //     //   const response = await Create_Retailer(data);
  //     //   if (response?.status === 201 || response?.data?.statusCode === "201") {
  //     //     showSuccessNotification(response?.data?.message);
  //     //     onClose();
  //     //   } else {
  //     //     showErrorNotification(response?.data?.message || "Unable to create");
  //     //   }
  //   } catch (error: any) {
  //     await handleCustomError(error);
  //     setIsLoading(false);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const receiptRef = useRef<HTMLDivElement>(null);
  const [printOrientation, setPrintOrientation] = useState<
    "portrait" | "landscape"
  >("portrait");
  const [isThermal, setIsThermal] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: "Receipt",
    pageStyle: `
    @page {
      size: ${isThermal ? "80mm auto" : printOrientation};
      margin: 0mm;
    }
    @media print {
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .no-print {
        display: none !important;
      }
      ${
        isThermal
          ? `
        .thermal-receipt {
          width: 80mm !important;
          margin: 0 !important;
          padding: 0 !important;
          font-family: monospace !important;
          font-size: 12px !important;
        }
      `
          : ""
      }
    }
  `,
  });

  const handlePrintClick = (
    orientation: "portrait" | "landscape",
    thermal: boolean = false
  ) => {
    setPrintOrientation(orientation);
    setIsThermal(thermal);
    // Small timeout to ensure state is updated before printing
    setTimeout(() => {
      handlePrint && handlePrint();
    }, 100);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Receipt"
      size="90%"
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
      <div className="flex flex-col h-full">
        <div className="flex w-max self-start mb-6 gap-4 no-print">
          <ButtonComponent
            title="HORIZONTAL PRINT"
            variant="filled"
            onClick={() => handlePrintClick("landscape")}
            leftIcon={<PrinterSvgIcon color={theme.palette.background.paper} />}
            radius={5}
            width={230}
          />
          <ButtonComponent
            title="THERMAL PRINT"
            variant="filled"
            onClick={() => handlePrintClick("portrait", true)}
            leftIcon={<PrinterSvgIcon color={theme.palette.background.paper} />}
            radius={5}
            width={200}
          />
          <ButtonComponent
            title="VERTICAL PRINT"
            variant="filled"
            onClick={() => handlePrintClick("portrait")}
            leftIcon={<PrinterSvgIcon color={theme.palette.background.paper} />}
            radius={5}
            width={200}
          />
        </div>

        <div className="flex-1 overflow-auto">
          <ReceiptContent
            ref={receiptRef}
            orientation={printOrientation}
            isThermal={isThermal}
          />
        </div>
      </div>
    </Modal>
  );
};

export default RemitterReceiptModal;
