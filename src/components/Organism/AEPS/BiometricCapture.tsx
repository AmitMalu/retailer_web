import { FingerprintSvgIcon } from "@/assets/svg";
import TextComponent from "@/components/Atoms/TextComponent";
import { handleCustomError } from "@/Utils/handleCustomError";
import { showErrorNotification } from "@/Utils/notifications";
import { Checkbox, Grid, Radio, UnstyledButton } from "@mantine/core";
import { useTheme } from "@mui/system";

const DEVICE_LIST = [
    "Mantra",
    "Morpho",
    "Precision",
    "Startek",
    "Tatvik",
    "SecuGen",
    "Cogent",
];

const AEPS_RD_ENDPOINTS: any = {
    Mantra: "http://127.0.0.1:11100/rd/capture",
    Morpho: "http://127.0.0.1:8005/capture",
    Startek: "http://127.0.0.1:11102/capture",
    SecuGen: "http://127.0.0.1:8443/rd/capture",
    Tatvik: "http://127.0.0.1:8001/rd/capture",
    Precision: "http://127.0.0.1:11103/capture",
    Cogent: "http://127.0.0.1:8004/rd/capture",
};

// Create XML body required for Mantra, Morpho, Startek etc.
// const pidOptions = `<?xml version="1.0"?>
// <PidOptions ver="1.0">
//   <Opts fCount="1" fType="2" iCount="0" iType="0" format="0" pidVer="2.0" timeout="20000" otp="" env="P" />
// </PidOptions>`;

const pidOptions = `<?xml version="1.0"?>
<PidOptions ver="1.0" env="P">
  <Opts 
    fCount="1"
    fType="2"
    iCount="0"
    iType="0"
    pCount="0"
    pType="0"
    format="0"
    pidVer="2.0"
    timeout="20000"
    wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc="
    posh="UNKNOWN"
  />
</PidOptions>`;


const BiometricCapture = ({
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateForm,
    requiredFieldsBeforeScan,
    onSuccessScan
}: any) => {
    const theme = useTheme();

    // -------------------------------
    // Fingerprint Capture
    // -------------------------------
    const captureFingerprint = async (device: string) => {
        const url = AEPS_RD_ENDPOINTS[device];

        if (!url) {
            setFieldError("pidData", "Device not supported");
            return null;
        }

        try {
            const res = await fetch(url, {
                method: "CAPTURE",
                headers: { "Content-Type": "text/xml" },
                body: pidOptions
            });

            const xmlText = await res.text();
            if (!xmlText) {
                setFieldTouched("pidData", true);
                setFieldError("pidData", "Failed to capture fingerprint");
                showErrorNotification("Failed to capture fingerprint")
                return null;
            }

            setFieldError("pidData", "");
            return xmlText;
        } catch (err) {
            console.error(err);
            setFieldTouched("pidData", true);
            setFieldError("pidData", "Unable to capture fingerprint");
            handleCustomError(err || "Unable to capture fingerprint");
            return null;
        }
    };

    // -------------------------------
    // Parse PID XML
    // -------------------------------
    const parsePidData = (xmlText: string) => {
        const xml = new DOMParser().parseFromString(xmlText, "text/xml");
        const resp = xml.querySelector("Resp");
        const data = xml.querySelector("Data");
        const skey = xml.querySelector("Skey");
        const deviceInfo = xml.querySelector("DeviceInfo");

        return {
            sessionKey: skey?.textContent || "",
            hmac: xml.querySelector("Hmac")?.textContent || "",
            Piddata: data?.textContent || "",
            PidDatatype: data?.getAttribute("type") || "",
            ci: skey?.getAttribute("ci") || "",
            dc: deviceInfo?.getAttribute("dc") || "",
            rdsID: deviceInfo?.getAttribute("rdsId") || "",
            rdsVer: deviceInfo?.getAttribute("rdsVer") || "",
            dpID: deviceInfo?.getAttribute("dpId") || "",
            mi: deviceInfo?.getAttribute("mi") || "",
            mc: deviceInfo?.getAttribute("mc") || "",
            errCode: resp?.getAttribute("errCode") || "",
            errInfo: resp?.getAttribute("errInfo") || "",
            fCount: resp?.getAttribute("fCount") || "",
            fType: resp?.getAttribute("fType") || "",
            iCount: resp?.getAttribute("iCount") || "",
            iType: resp?.getAttribute("iType") || "",
            pCount: resp?.getAttribute("pCount") || "",
            pType: resp?.getAttribute("pType") || "",
            nmPoints: resp?.getAttribute("nmPoints") || "",
            qScore: resp?.getAttribute("qScore") || "",
        };
    };

    // -------------------------------
    // Handle Scan Button
    // -------------------------------
    const onScan = async () => {
        //1. Mark all required fields as touched
        requiredFieldsBeforeScan?.forEach((field: string) => {
            setFieldTouched(field, true);
        });

        const formErrors = await validateForm();

        //2. STOP if any required field has error
        for (let field of requiredFieldsBeforeScan) {
            if (formErrors[field]) {
                setFieldError(field, formErrors[field]);
                return;
            }
        }

        // 3. Continue with scan
        const xml = await captureFingerprint(values.deviceType);

        if (!xml) {
            // Mark as touched so error appears
            setFieldTouched("pidData", true);
            setFieldError("pidData", "Failed to capture fingerprint");
            return;
        }

        const parsed = parsePidData(xml);

        if (parsed.errCode !== "0") {
            setFieldError("pidData", parsed.errInfo || "Fingerprint failed");
            setFieldTouched("pidData", true);
            showErrorNotification(parsed.errInfo);
            return;
        }

        // Success → Call parent
        onSuccessScan(parsed, xml)
    };


    return (
        <Grid style={{ width: "100%" }}>
            {/* Select Device */}
            <Grid.Col span={{ base: 12, md: 8 }}>
                <div className={`border p-3 rounded-xl border-${touched.deviceType && errors.deviceType ? "red" : "black"}`}>
                    <TextComponent fontSize={20} fontWeight={500}>
                        Select Device
                    </TextComponent>

                    <Radio.Group
                        value={values.deviceType}
                        onChange={(value) => setFieldValue("deviceType", value)}
                        error={touched.deviceType && errors.deviceType}
                        styles={{ error: { marginTop: "10px" } }}
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                            {DEVICE_LIST.map((d) => (
                                <Radio key={d} color="red" size="md" value={d} label={d} />
                            ))}
                        </div>
                    </Radio.Group>

                    <Checkbox
                        className="mt-4"
                        label="C.S.P"
                        size="md"
                        checked={values.csp}
                        onChange={(e) => setFieldValue("csp", e.target.checked)}
                    />
                </div>
            </Grid.Col>

            {/* Scan Fingerprint */}
            <Grid.Col span={{ base: 12, md: 4 }} className="flex flex-col items-center">
                <UnstyledButton
                    onClick={onScan}
                    className="w-[120px] h-full flex justify-center items-center rounded-xl"
                >
                    <FingerprintSvgIcon color={theme.palette.red.DEFAULT} />
                </UnstyledButton>

                {touched.pidData && errors.pidData && (
                    <div className="text-red-600 text-sm mt-2">{errors.pidData}</div>
                )}
            </Grid.Col>
        </Grid>
    )
}

export default BiometricCapture
