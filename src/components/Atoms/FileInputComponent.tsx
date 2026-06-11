import React, { useRef, useState } from "react";
import {
  Button,
  Box,
  FormHelperText,
  IconButton,
  styled,
  TextField,
} from "@mui/material";
import { customFileinputProps } from "@/Common/interface";
import { CloudUpload, Close } from "@mui/icons-material";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const FileInputComponent: React.FC<customFileinputProps> = ({
  label,
  placeholder = "Choose a file or drag and drop",
  onChange,
  error,
  disabled = false,
  withAsterisk = false,
  accept,
}) => {
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [internalError, setInternalError] = useState<string | undefined>(
    undefined
  );

  const errorText = error || internalError;
  const MAX_FILE_SIZE = 1.5 * 1024 * 1024; // 1.5MB in bytes

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setInternalError(`File size should not exceed 1.5MB`);
      if (onChange) {
        onChange(null);
      }
      event.target.value = ""; // reset input
      return;
    }

    setInternalError(undefined);

    const acceptedTypes = accept
      ? accept.split(",").map((type) => type.trim().toLowerCase())
      : [];
    const fileType = file.type.toLowerCase();
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";

    const isTypeValid = acceptedTypes.some((type) => {
      if (type.includes("/")) {
        return fileType === type;
      }
      if (type.startsWith(".")) {
        return fileExtension === type.substring(1);
      }
      return false;
    });

    if (accept && !isTypeValid) {
      setInternalError(`Please upload a ${getFileTypes(accept)} file`);
      if (onChange) {
        onChange(null);
      }
      event.target.value = ""; // reset input
      return;
    }

    setFileName(file.name);
    if (onChange) {
      onChange(file);
    }

    event.target.value = ""; // reset input
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onChange(null);
    setFileName("");
  };

  const getFileTypes = (accept = "") => {
    if (!accept) return "File";
    const types = Array.from(
      new Set(
        accept
          .split(",")
          .map((t) => t.trim().split("/").pop()?.replace(".", "").toUpperCase())
          .filter(Boolean)
      )
    );
    return types.length ? `${types.join(", ")} files` : "File";
  };

  return (
    <Box sx={{ position: "relative", width: "100%", mt: 0.125, mb: 0.125 }}>
      <TextField
        variant="outlined"
        fullWidth
        label={`${label}${withAsterisk ? " *" : ""}`}
        placeholder={placeholder}
        value={fileName}
        ref={fileInputRef}
        onChange={(e) => e.stopPropagation()}
        error={!!errorText}
        disabled={disabled}
        slotProps={{
          input: {
            readOnly: true,
            endAdornment: (
              <div className="flex items-center justify-end gap-5">
                {fileName && (
                  <IconButton
                    size="small"
                    onClick={handleRemoveFile}
                    sx={{ color: "text.secondary" }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                )}
                <Button
                  component="label"
                  variant="outlined"
                  size="small"
                  startIcon={<CloudUpload />}
                  disabled={disabled}
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textTransform: "none",
                    borderColor: errorText ? "error.main" : "primary.main",
                    color: errorText ? "error.main" : "primary.main",
                    "&:hover": {
                      borderColor: errorText
                        ? "error.main"
                        : "primary.main",
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <VisuallyHiddenInput
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={accept}
                    disabled={disabled}
                  />
                </Button>
              </div>
            ),
          },
        }}
        sx={{
          "& .MuiInputLabel-root": {
            color: "placeholder",
            fontSize: "16px",
            fontWeight: 400,
            "&.Mui-focused": {
              color: error ? "error.main" : "primary.main",
            },
            "&.Mui-error": {
              color: "error.main",
            },
          },
          "& .MuiOutlinedInput-root": {
            borderColor: "gray.DEFAULT",
            borderRadius: "6px !important",

            "&.Mui-error .MuiOutlinedInput-notchedOutline": {
              borderColor: "error.main",
              borderRadius: "6px !important",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: error ? "error.main" : "primary.main",
              borderWidth: "1px",
              borderRadius: "6px !important",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: error ? "error.main" : "primary.main",
            },
            "& fieldset": {
              borderColor: "gray.DEFAULT",
              borderRadius: "6px !important",
            },
            "&:hover fieldset": {
              borderColor: error ? "error.main" : "primary.main",
              borderRadius: "6px !important",
            },
          },
        }}
      />
      <div className="flex items-center justify-between ml-2 mt-1">
        <FormHelperText
          sx={{
            textAlign: "right",
            margin: "4px 0 0 0",
            lineHeight: 1,
          }}
        >
          {getFileTypes(accept)} (max 1.5MB)
        </FormHelperText>
        {errorText && (
          <FormHelperText
            error
            sx={{
              textAlign: "right",
              margin: "4px 0 0 0",
              lineHeight: 1,
            }}
          >
            {errorText}
          </FormHelperText>
        )}
      </div>
    </Box>
  );
};

export default FileInputComponent;
