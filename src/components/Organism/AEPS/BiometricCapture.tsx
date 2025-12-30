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
    Mantra: { 
        discovery: "http://127.0.0.1:11100",
        capture: "http://127.0.0.1:11100/rd/capture"
    },
    Morpho: { 
        discovery: "http://127.0.0.1:8005",
        capture: "http://127.0.0.1:8005/capture"
    },
    Startek: { 
        discovery: "http://127.0.0.1:11102",
        capture: "http://127.0.0.1:11102/capture"
    },
    SecuGen: { 
        discovery: "http://127.0.0.1:8443",
        capture: "http://127.0.0.1:8443/rd/capture"
    },
    Tatvik: { 
        discovery: "http://127.0.0.1:8001",
        capture: "http://127.0.0.1:8001/rd/capture"
    },
    Precision: { 
        discovery: "http://127.0.0.1:11103",
        capture: "http://127.0.0.1:11103/capture"
    },
    Cogent: { 
        discovery: "http://127.0.0.1:8004",
        capture: "http://127.0.0.1:8004/capture"
    },
};

// Create XML body required for Mantra, Morpho, Startek etc.
// const pidOptions = `<?xml version="1.0"?>
// <PidOptions ver="1.0">
//   <Opts fCount="1" fType="2" iCount="0" iType="0" format="0" pidVer="2.0" timeout="20000" otp="" env="P" />
// </PidOptions>`;

// Calculate WADH dynamically based on EKYC options
const calculateWadh = () => {
    const ekycOptions = {
        ver: "2.5",
        ra: "F", // F for fingerprint
        rc: "Y", // Y for consent
        lr: "N", // N for English only
        de: "N", // N for KUA decrypts
        pfr: "N"  // N for no PDF
    };
    
    const optionsString = ekycOptions.ver + ekycOptions.ra + ekycOptions.rc + ekycOptions.lr + ekycOptions.de + ekycOptions.pfr;
    
    // Simple SHA256 + Base64 implementation
    // In production, you should use a proper crypto library
    const encoder = new TextEncoder();
    encoder.encode(optionsString);
    
    // For now, return the working hardcoded value
    // TODO: Implement proper SHA256 + Base64
    return "E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc=";
};

// Generate PID options with proper parameters for fingerprint
const generatePidOptions = () => {
    return `<?xml version="1.0"?>
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
    wadh=""
    posh="UNKNOWN"
  />
</PidOptions>`;
};

// wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc="

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
        PidDatatype: data?.getAttribute("type") || "X",
        Piddata: data?.textContent || "",
        ci: skey?.getAttribute("ci") || "",
        dc: deviceInfo?.getAttribute("dc") || "",
        dpID: deviceInfo?.getAttribute("dpId") || "",
        errCode: resp?.getAttribute("errCode") || "0",
        errInfo: resp?.getAttribute("errInfo") || "",
        fCount: resp?.getAttribute("fCount") || "1",
        fType: resp?.getAttribute("fType") || "0",
        iCount: resp?.getAttribute("iCount") || "0",
        iType: resp?.getAttribute("iType") || "0",
        pCount: resp?.getAttribute("pCount") || "0",
        pType: resp?.getAttribute("pType") || "0",
        hmac: xml.querySelector("Hmac")?.textContent || "",
        mc: xml.querySelector("Mc")?.textContent || deviceInfo?.getAttribute("mc") || "",
        mi: deviceInfo?.getAttribute("mi") || "",
        nmPoints: resp?.getAttribute("nmPoints") || "",
        qScore: resp?.getAttribute("qScore") || "",
        rdsID: deviceInfo?.getAttribute("rdsId") || "",
        rdsVer: deviceInfo?.getAttribute("rdsVer") || "",
        sessionKey: skey?.textContent || "",
    };
};


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

// Check RD service status before capture
const checkDeviceStatus = async (device: string) => {
    const endpoints = AEPS_RD_ENDPOINTS[device];
    if (!endpoints) {
        return { ready: false, error: "Device not supported" };
    }

    try {
        const res = await fetch(endpoints.discovery, {
            method: "RDSERVICE",
            headers: { "Content-Type": "text/xml" }
        });

        const xmlText = await res.text();
        const xml = new DOMParser().parseFromString(xmlText, "text/xml");
        const rdService = xml.querySelector("RDService");
        const status = rdService?.getAttribute("status");

        if (status === "READY") {
            return { ready: true, error: null };
        } else {
            return { ready: false, error: `Device status: ${status}` };
        }
    } catch (err) {
        console.error(`Device discovery failed for ${device}:`, err);
        return { ready: false, error: "Device not connected or RD service not running" };
    }
};

// -------------------------------
// Fingerprint Capture
// -------------------------------
const captureFingerprint = async (device: string) => {
    const endpoints = AEPS_RD_ENDPOINTS[device];

    if (!endpoints) {
        setFieldError("pidData", "Device not supported");
        return null;
    }

    // Check device status first
    const statusCheck = await checkDeviceStatus(device);
    if (!statusCheck.ready) {
        setFieldTouched("pidData", true);
        setFieldError("pidData", statusCheck.error || "Device not ready");
        showErrorNotification(statusCheck.error || "Device not ready");
        return null;
    }

    try {
        const pidOptions = generatePidOptions();
        const res = await fetch(endpoints.capture, {
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

// Export parsePidData for use in other components
export { parsePidData };

export default BiometricCapture
