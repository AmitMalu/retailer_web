import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  Divider,
  useTheme,
} from "@mui/material";
import { themeOptions } from "../../theme/ThemeConfig";
import { useDispatch } from "react-redux";
import { useNotification } from "../notifications";
import { ThemeComparisonProps, ThemeOption } from "@/Common/interface";
import { setThemeOption } from "@/Redux/Actions/settingsAction";

export default function ThemeComparison({
  currentTheme,
  darkMode,
}: ThemeComparisonProps) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { addNotification } = useNotification();
  const [selectedThemes, setSelectedThemes] = useState<ThemeOption[]>([
    "default",
    "corporate",
  ]);
  const [tabValue, setTabValue] = useState(0);

  // Theme name mapping for display
  const themeNames: Record<string, string> = {
    default: "Default",
    corporate: "Corporate",
    creative: "Creative",
    elegant: "Elegant",
    playful: "Playful",
    minimal: "Minimal",
    dark: "Dark",
  };

  // Theme descriptions
  const themeDescriptions: Record<string, string> = {
    default:
      "A balanced blue theme with a clean, modern look suitable for most applications.",
    corporate:
      "Professional blue and gray tones designed for business applications.",
    creative:
      "Vibrant purple and pink palette ideal for creative and design-focused projects.",
    elegant:
      "Sophisticated teal and gold combination for premium and luxury applications.",
    playful:
      "Energetic orange-based theme with vibrant accents for fun, engaging interfaces.",
    minimal:
      "Monochromatic grayscale design for distraction-free, content-focused interfaces.",
    dark: "Dark mode-optimized theme with blue accents for reduced eye strain in low-light environments.",
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleThemeSelect = (themeKey: ThemeOption) => {
    if (selectedThemes.includes(themeKey)) {
      // If already selected and not the only one left, remove it
      if (selectedThemes.length > 1) {
        setSelectedThemes(selectedThemes.filter((t) => t !== themeKey));
      }
    } else {
      // If not selected and less than 2 selected, add it
      if (selectedThemes.length < 2) {
        setSelectedThemes([...selectedThemes, themeKey]);
      } else {
        // If already have 2, replace the first one
        setSelectedThemes([selectedThemes[1], themeKey]);
      }
    }
  };

  const applyTheme = (themeKey: ThemeOption) => {
    dispatch(setThemeOption(themeKey));
    addNotification({
      message: `Theme changed to ${themeNames[themeKey]}`,
      type: "success",
      autoHideDuration: 3000,
    });
  };

  // Get theme colors based on theme key and dark mode
  const getThemeColors = (themeKey: ThemeOption) => {
    const colors = themeOptions[themeKey];

    // Use dark theme colors if in dark mode and not the dark theme itself
    return darkMode && themeKey !== "dark"
      ? {
          ...colors,
          background: "#0f172a",
          paper: "#1e293b",
          textPrimary: "#f1f5f9",
          textSecondary: "#cbd5e1",
        }
      : colors;
  };

  // Render theme card
  const renderThemeCard = (themeKey: ThemeOption) => {
    const colors = getThemeColors(themeKey);
    const isSelected = selectedThemes.includes(themeKey);
    const isCurrentTheme = currentTheme === themeKey;

    return (
      <Card
        sx={{
          cursor: "pointer",
          border: isSelected
            ? `2px solid ${theme.palette.primary.main}`
            : `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          transition: "all 0.2s",
          transform: isSelected ? "scale(1.02)" : "scale(1)",
          "&:hover": {
            boxShadow: theme.shadows[4],
          },
        }}
        onClick={() => handleThemeSelect(themeKey)}
      >
        <Box sx={{ height: 8, bgcolor: colors.primary }} />
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {themeNames[themeKey]}
            </Typography>
            {isCurrentTheme && (
              <Box
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  fontSize: "0.7rem",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                Active
              </Box>
            )}
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 2 }}
          >
            {themeDescriptions[themeKey]}
          </Typography>

          <Box sx={{ display: "flex", gap: 0.5, mb: 2 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                bgcolor: colors.primary,
              }}
            />
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                bgcolor: colors.secondary,
              }}
            />
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                bgcolor: colors.success,
              }}
            />
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                bgcolor: colors.warning,
              }}
            />
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                bgcolor: colors.error,
              }}
            />
          </Box>

          <Button
            variant="contained"
            size="small"
            fullWidth
            sx={{
              bgcolor: colors.primary,
              color: "#fff",
              "&:hover": {
                bgcolor: colors.primary,
                opacity: 0.9,
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              applyTheme(themeKey);
            }}
          >
            {isCurrentTheme ? "Current Theme" : "Apply Theme"}
          </Button>
        </CardContent>
      </Card>
    );
  };

  // Render comparison section
  const renderComparison = () => {
    if (selectedThemes.length === 0) {
      return <Typography>Select at least one theme to see details</Typography>;
    }

    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: selectedThemes.length === 1 ? "1fr" : "1fr 1fr",
          },
          gap: 3,
        }}
      >
        {selectedThemes.map((themeKey) => {
          const colors = getThemeColors(themeKey);

          return (
            <Paper sx={{ p: 3, height: "100%" }} key={themeKey}>
              <Typography variant="h6" gutterBottom>
                {themeNames[themeKey]}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Primary Colors
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: colors.primary,
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "#fff" }}>
                    Primary
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: colors.secondary,
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "#fff" }}>
                    Secondary
                  </Typography>
                </Box>
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Status Colors
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: colors.success,
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "#fff" }}>
                    Success
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: colors.warning,
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "#fff" }}>
                    Warning
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: colors.error,
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "#fff" }}>
                    Error
                  </Typography>
                </Box>
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Background Colors
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: colors.background,
                    borderRadius: 1,
                    border: `1px solid ${theme.palette.divider}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: colors.textPrimary }}
                  >
                    Background
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: colors.paper,
                    borderRadius: 1,
                    border: `1px solid ${theme.palette.divider}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: colors.textPrimary }}
                  >
                    Paper
                  </Typography>
                </Box>
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Text Colors
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ color: colors.textPrimary }}>
                  Primary Text
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: colors.textSecondary }}
                >
                  Secondary Text
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: colors.primary,
                  color: "#fff",
                  "&:hover": {
                    bgcolor: colors.primary,
                    opacity: 0.9,
                  },
                }}
                onClick={() => applyTheme(themeKey)}
              >
                Apply This Theme
              </Button>
            </Paper>
          );
        })}
      </Box>
    );
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Theme Comparison
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Compare different themes side by side to find the perfect look for your
        application. Select up to two themes to compare their color palettes and
        styles.
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Select Themes" />
        <Tab label="Compare" />
      </Tabs>

      {tabValue === 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {Object.keys(themeOptions).map((themeKey) => (
            <Box key={themeKey}>{renderThemeCard(themeKey as ThemeOption)}</Box>
          ))}
        </Box>
      )}

      {tabValue === 1 && renderComparison()}
    </Box>
  );
}
