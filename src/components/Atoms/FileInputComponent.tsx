import React, { useRef, useState } from "react";
import {
  Button,
  Typography,
  Box,
  FormHelperText,
  IconButton,
  useTheme,
  styled,
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
  // value,
  onChange,
  error,
  disabled = false,
  withAsterisk = false,
  // leftSection,
  // rightSection,
  accept,
}) => {
  const theme = useTheme();
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
    <Box>
      {label && (
        <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
          <Typography
            variant="body2"
            color={theme.palette.text.primary}
            fontWeight={600}
          >
            {label}
          </Typography>
          {withAsterisk && (
            <Typography variant="body2" color="error" fontWeight={600}>
              *
            </Typography>
          )}
        </Box>
      )}

      <Button
        component="label"
        variant="outlined"
        color="inherit"
        disabled={disabled}
        fullWidth
        startIcon={<CloudUpload />}
        sx={{
          justifyContent: "flex-start",
          textTransform: "none",
          borderColor: error
            ? theme.palette.error.main
            : theme.palette.gray.DEFAULT,
          color: theme.palette.text.primary,
          "&:hover": {
            borderColor: error
              ? theme.palette.error.main
              : theme.palette.background.blackColor,
            backgroundColor: theme.palette.action.hover,
          },
          "&.Mui-disabled": {
            borderColor: theme.palette.action.disabled,
            color: theme.palette.action.disabled,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
            overflow: "hidden",
          }}
        >
          <Typography
            variant="body2"
            color={
              fileName
                ? theme.palette.text.primary
                : theme.palette.text.secondary
            }
            noWrap
            sx={{
              flex: 1,
              textAlign: "left",
              overflow: "hidden",
              "&.Mui-disabled": {
                color: theme.palette.action.disabled,
              },
            }}
          >
            {fileName || placeholder}
          </Typography>

          {fileName && (
            <IconButton
              size="small"
              onClick={handleRemoveFile}
              sx={{
                ml: 1,
                color: theme.palette.text.secondary,
                "&:hover": {
                  color: theme.palette.background.blackColor,
                  backgroundColor: theme.palette.action.hover,
                },
              }}
              disabled={disabled}
            >
              <Close fontSize="small" />
            </IconButton>
          )}
        </Box>

        <VisuallyHiddenInput
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
        />
      </Button>

      {error && (
        <FormHelperText
          error
          sx={{
            mt: 0.5,
            ml: 1.5,
            color: theme.palette.error.main,
          }}
        >
          {error}
        </FormHelperText>
      )}
    </Box>
  );
};

export default FileInputComponent;
