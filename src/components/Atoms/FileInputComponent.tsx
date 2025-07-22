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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onChange(file);
    setFileName(file?.name || "");
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onChange(null);
    setFileName("");
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
        error={!!error}
        disabled={disabled}
        slotProps={{
          input: {
            readOnly: true,
            endAdornment: (
              <div>
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
                    textTransform: "none",
                    borderColor: error ? "error.main" : "gray.DEFAULT",
                    color: error ? "error.main" : "text.primary",
                    "&:hover": {
                      borderColor: error
                        ? "error.main"
                        : "background.blackColor",
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
              color: error ? "error.main" : "text.primary",
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
              borderColor: error ? "error.main" : "background.blackColor",
              borderWidth: "1px",
              borderRadius: "6px !important",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: error ? "error.main" : "background.blackColor",
            },
            "& fieldset": {
              borderColor: "gray.DEFAULT",
              borderRadius: "6px !important",
            },
            "&:hover fieldset": {
              borderColor: error ? "error.main" : "background.blackColor",
              borderRadius: "6px !important",
            },
          },
        }}
      />
      {error && (
        <FormHelperText
          error
          sx={{
            textAlign: "right",
            margin: "4px 0 0 0",
            lineHeight: 1,
          }}
        >
          {error}
        </FormHelperText>
      )}
    </Box>
  );
};

export default FileInputComponent;
