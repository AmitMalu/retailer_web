import { createTheme, type MantineColorsTuple } from "@mantine/core";

// Emerald scale used as Mantine's primary colour (buttons, focus rings, checkboxes, tabs)
const emerald: MantineColorsTuple = [
  "#ecfdf5",
  "#d1fae5",
  "#a7f3d0",
  "#6ee7b7",
  "#34d399",
  "#10b981",
  "#059669",
  "#047857",
  "#065f46",
  "#064e3b",
];

export const mantineTheme = createTheme({
  primaryColor: "emerald",
  primaryShade: 6,
  colors: { emerald },
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  headings: { fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: "700" },
  defaultRadius: "md",
  components: {
    Card: { defaultProps: { radius: "lg", shadow: "xs", withBorder: true } },
    Paper: { defaultProps: { radius: "lg" } },
    Modal: { defaultProps: { radius: "lg", centered: true } },
    TextInput: { defaultProps: { radius: "md" } },
    PasswordInput: { defaultProps: { radius: "md" } },
    Select: { defaultProps: { radius: "md" } },
    Tabs: { defaultProps: { color: "emerald" } },
  },
});
