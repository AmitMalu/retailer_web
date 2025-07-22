import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  useTheme,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import ButtonComponent from "./ButtonComponent";
import TextComponent from "./TextComponent";
import { DynamicModalProps } from "@/Common/interface";

const ModalComponent: React.FC<DynamicModalProps> = ({
  opened,
  onClose,
  title,
  content,
  ButtonTitle,
  onClick,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={opened}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: "background.paper",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {title && (
          <TextComponent variant="h6" fontWeight={600}>
            {title}
          </TextComponent>
        )}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: theme.palette.text.secondary,
            "&:hover": {
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {typeof content === "string" ? (
          <TextComponent variant="body1">{content}</TextComponent>
        ) : (
          content
        )}
      </DialogContent>

      {(ButtonTitle || onClick) && (
        <DialogActions
          sx={{
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            justifyContent: "flex-end",
            gap: 1,
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            color="inherit"
            sx={{
              textTransform: "none",
              color: theme.palette.text.primary,
              borderColor: theme.palette.divider,
              "&:hover": {
                borderColor: theme.palette.text.primary,
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            Cancel
          </Button>
          {ButtonTitle && onClick && (
            <ButtonComponent
              title={ButtonTitle}
              variant="filled"
              onClick={onClick}
              radius={10}
            />
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ModalComponent;
