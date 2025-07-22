import { Box, Paper, Typography, Button, Chip, useTheme } from "@mui/material";
import { themeOptions } from "../../theme/ThemeConfig";
import { ThemePreviewProps } from "@/Common/interface";

export default function ThemePreview({
  themeKey,
  selected,
  onClick,
  darkMode,
}: ThemePreviewProps) {
  const theme = useTheme();
  const colors = themeOptions[themeKey];

  // Use dark theme colors if in dark mode and not the dark theme itself
  const adjustedColors =
    darkMode && themeKey !== "dark"
      ? {
          ...colors,
          background: "#0f172a",
          paper: "#1e293b",
          textPrimary: "#f1f5f9",
          textSecondary: "#cbd5e1",
        }
      : colors;

  // Theme name mapping for display
  const themeNames: Record<string, string> = {
    default: "Default",
    corporate: "Corporate",
    creative: "Creative",
    elegant: "Elegant",
    playful: "Playful",
    minimal: "Minimal",
    dark: "Dark",
    mutedTeal: "mutedTeal",
  };

  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: selected ? "scale(1.05)" : "scale(1)",
        position: "relative",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
    >
      <Paper
        elevation={selected ? 4 : 1}
        sx={{
          overflow: "hidden",
          borderRadius: 2,
          border: selected
            ? `2px solid ${theme.palette.primary.main}`
            : "2px solid transparent",
        }}
      >
        {/* Theme header */}
        <Box
          sx={{
            height: 12,
            background: `linear-gradient(90deg, ${adjustedColors.primary} 0%, ${adjustedColors.secondary} 100%)`,
          }}
        />

        {/* Theme content preview */}
        <Box
          sx={{
            p: 1.5,
            backgroundColor: adjustedColors.paper,
            minHeight: 120,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              color: adjustedColors.textPrimary,
              fontWeight: "bold",
              mb: 1,
            }}
          >
            {themeNames[themeKey]}
          </Typography>

          {/* Color chips */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                bgcolor: adjustedColors.primary,
              }}
            />
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                bgcolor: adjustedColors.secondary,
              }}
            />
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                bgcolor: adjustedColors.success,
              }}
            />
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                bgcolor: adjustedColors.warning,
              }}
            />
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                bgcolor: adjustedColors.error,
              }}
            />
          </Box>

          {/* Button preview */}
          <Button
            size="small"
            sx={{
              backgroundColor: adjustedColors.primary,
              color: "#fff",
              "&:hover": {
                backgroundColor: adjustedColors.primary,
                opacity: 0.9,
              },
              mb: 1,
              fontSize: "0.7rem",
              py: 0.3,
              minWidth: "auto",
            }}
          >
            Button
          </Button>

          {/* Text preview */}
          <Typography
            variant="caption"
            sx={{
              color: adjustedColors.textSecondary,
              display: "block",
              fontSize: "0.65rem",
              lineHeight: 1.2,
            }}
          >
            Sample text
          </Typography>
        </Box>
      </Paper>

      {selected && (
        <Chip
          label="Active"
          size="small"
          color="primary"
          sx={{
            position: "absolute",
            top: -8,
            right: -8,
            fontSize: "0.65rem",
            height: 20,
          }}
        />
      )}
    </Box>
  );
}
