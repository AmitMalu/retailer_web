import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import {
  Box,
  NavLink,
  Text,
  ScrollArea,
  ActionIcon,
  Menu,
} from "@mantine/core";
import { IconChevronRight, IconLogout } from "@tabler/icons-react";
import { getMenuItems } from "@/Config/menuItems";
import { MenuItem, SidebarProps, UserRole } from "@/Common/interface";
import { useTheme } from "@mui/material/styles";
import { decryptData } from "@/Utils/helper";
import { useLogoutHandling } from "@/Utils/CustomLogout";

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const theme = useTheme();
  const { logout } = useLogoutHandling();
  const { sidebarStyle } = useSelector((state: RootState) => state.settings);
  const { responses: apiResponses } = useSelector(
    (state: RootState) => state.apiResponse
  );
  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses.loginData)
    : null;
  const selectedRoute = useSelector(
    (state: RootState) => state.navigation.selectedRoute
  );

  if (!loginData) return null;
  const isCompact = sidebarStyle === "compact";
  const drawerWidth = isCompact ? 60 : 250;

  const menuItems = getMenuItems(loginData.role as UserRole);

  const isActive = (
    path: string | undefined,
    subItems?: MenuItem[]
  ): boolean => {
    if (!path) {
      return false;
    }

    // Ensure the paths are compared without the base URL
    const currentPath = path.startsWith("/") ? path : `/${path}`;
    const selectedPath = selectedRoute.startsWith("/")
      ? selectedRoute
      : `/${selectedRoute}`;

    console.log("isActive - Current menu path:", currentPath);
    console.log("isActive - Selected route:", selectedPath);

    // Check if current path matches exactly or is a parent of the selected route
    const isPathActive =
      selectedPath === currentPath ||
      selectedPath.startsWith(`${currentPath}/`);

    console.log("isActive - isPathActive:", isPathActive);

    // Check subitems
    let isSubItemActive = false;
    if (subItems?.length) {
      console.log("isActive - Checking subitems:", subItems);
      isSubItemActive = subItems.some((subItem) => {
        if (!subItem.path) {
          console.log("isActive - Subitem has no path");
          return false;
        }

        const subPath = subItem.path.startsWith("/")
          ? subItem.path
          : `/${subItem.path}`;
        const isSubActive =
          selectedPath === subPath || selectedPath.startsWith(`${subPath}/`);

        console.log(
          `isActive - Checking subitem ${subPath} - active:`,
          isSubActive
        );

        if (isSubActive) return true;

        // Check nested subitems
        if (subItem.subItems?.length) {
          console.log("isActive - Checking nested subitems");
          const hasActiveNested = subItem.subItems.some((subSubItem) => {
            if (!subSubItem.path) {
              console.log("isActive - Nested subitem has no path");
              return false;
            }
            const subSubPath = subSubItem.path.startsWith("/")
              ? subSubItem.path
              : `/${subSubItem.path}`;
            const isNestedActive =
              selectedPath === subSubPath ||
              selectedPath.startsWith(`${subSubPath}/`);
            console.log(
              `isActive - Checking nested subitem ${subSubPath} - active:`,
              isNestedActive
            );
            return isNestedActive;
          });
          if (hasActiveNested) return true;
        }
        return false;
      });
    }

    console.log("isActive - Final result:", isPathActive || isSubItemActive);
    return isPathActive || isSubItemActive;
  };

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item, index) => {
      const hasSubItems = item.subItems && item.subItems.length > 0;
      const active = isActive(item.path, item.subItems);

      const navLinkStyles = {
        root: {
          borderRadius: "var(--mantine-radius-md)",
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.red.light
                : theme.palette.red.light,
          },
          gap: 10,
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
        },

        section: {
          '&[dataPosition="left"]': {
            marginRight: "var(--mantine-spacing-sm)",
          },
          width: 30,
        },

        ...(active && {
          root: {
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.red.light
                : theme.palette.red.light,
            color: theme.palette.red.DEFAULT,
            borderRadius: 15,
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.red.light
                  : theme.palette.red.light,
            },
          },
        }),
      };

      return (
        <div
          key={`${item.name}-${index}`}
          style={{ marginBottom: "4px", scrollbarWidth: "none" }}
        >
          {hasSubItems ? (
            <Menu
              trigger="hover"
              position="right-start"
              shadow="md"
              width={200}
              withinPortal
            >
              <Menu.Target>
                <NavLink
                  label={!isCompact && item.name}
                  leftSection={item.icon}
                  rightSection={<IconChevronRight size={16} />}
                  active={!!active}
                  variant="filled"
                  styles={navLinkStyles}
                />
              </Menu.Target>

              <Menu.Dropdown>
                {item.subItems?.map((subItem, idx) => (
                  <Menu.Item
                    key={`${subItem.name}-${idx}`}
                    component={Link}
                    to={subItem.path || "#"}
                    onClick={() => {
                      if (onClose) onClose();
                    }}
                    style={{
                      color: isActive(subItem.path)
                        ? theme.palette.red.DEFAULT
                        : "inherit",
                      fontWeight: isActive(subItem.path) ? 600 : "normal",
                    }}
                  >
                    {subItem.name}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          ) : (
            <NavLink
              component={Link}
              to={item.path || "#"}
              label={!isCompact && item.name}
              leftSection={item.icon}
              active={!!active}
              variant="filled"
              styles={navLinkStyles}
            />
          )}
        </div>
      );
    });
  };

  return (
    <div
      style={{
        width: drawerWidth,
        height: "65%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        overflowY: "auto",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        scrollbarWidth: "none",
      }}
    >
      <ScrollArea
        style={{
          flex: 1,
          padding: "16px 8px",
          display: "flex",
          flexDirection: "column",
          scrollbarWidth: "none",
        }}
        type="never"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            margin: "auto 0",
            scrollbarWidth: "none",
          }}
        >
          {renderMenuItems(menuItems)}
        </div>
      </ScrollArea>

      <Box
        p="xs"
        style={{
          borderTop: `1px solid ${theme.palette.divider}`,
          marginTop: "auto",
        }}
      >
        <ActionIcon
          onClick={() => {
            if (onClose) onClose();
            logout();
          }}
          size="lg"
          radius="md"
          variant="light"
          color="red"
          style={{ width: "100%", height: "40px" }}
        >
          <IconLogout size={20} />
          {!isCompact && (
            <Text ml="sm" size="sm">
              Logout
            </Text>
          )}
        </ActionIcon>
      </Box>
    </div>
  );
}
