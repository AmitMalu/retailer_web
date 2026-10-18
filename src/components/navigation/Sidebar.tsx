import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import {
  Box,
  NavLink,
  Text,
  ScrollArea,
  Menu,
} from "@mantine/core";
import { IconChevronRight, IconLogout } from "@tabler/icons-react";
import { getMenuItems } from "@/Config/menuItems";
import { MenuItem, SidebarProps, UserRole } from "@/Common/interface";
import { useTheme } from "@mui/material/styles";
import { decryptData } from "@/Utils/helper";
import { useLogoutHandling } from "@/Utils/CustomLogout";
import { useBranding } from "@/Config/branding";
import { getCompanyNameLines } from "@/Utils/helper";
import { SIDEBAR_WIDTH_COMPACT, SIDEBAR_WIDTH_FULL } from "../layouts/variants/BaseLayout";

export default function Sidebar({ onClose }: SidebarProps) {
  const theme = useTheme();
  const branding = useBranding();
  const [nameLine1, nameLine2] = getCompanyNameLines(branding?.companyName);
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
  const drawerWidth = isCompact ? SIDEBAR_WIDTH_COMPACT : SIDEBAR_WIDTH_FULL;

  const menuItems = getMenuItems(loginData.role as UserRole);

  const isActive = (
    path: string | undefined,
    subItems?: MenuItem[]
  ): boolean => {
    if (!path) {
      return false;
    }

    const currentPath = path.startsWith("/") ? path : `/${path}`;
    const selectedPath = selectedRoute.startsWith("/")
      ? selectedRoute
      : `/${selectedRoute}`;

    const isPathActive =
      selectedPath === currentPath ||
      selectedPath.startsWith(`${currentPath}/`);

    let isSubItemActive = false;
    if (subItems?.length) {
      isSubItemActive = subItems.some((subItem) => {
        if (!subItem.path) {
          return false;
        }

        const subPath = subItem.path.startsWith("/")
          ? subItem.path
          : `/${subItem.path}`;
        const isSubActive =
          selectedPath === subPath || selectedPath.startsWith(`${subPath}/`);

        if (isSubActive) return true;

        if (subItem.subItems?.length) {
          const hasActiveNested = subItem.subItems.some((subSubItem) => {
            if (!subSubItem.path) {
              return false;
            }
            const subSubPath = subSubItem.path.startsWith("/")
              ? subSubItem.path
              : `/${subSubItem.path}`;
            const isNestedActive =
              selectedPath === subSubPath ||
              selectedPath.startsWith(`${subSubPath}/`);

            return isNestedActive;
          });
          if (hasActiveNested) return true;
        }
        return false;
      });
    }

    return isPathActive || isSubItemActive;
  };

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item, index) => {
      const hasSubItems = item.subItems && item.subItems.length > 0;
      const active = isActive(item.path, item.subItems);

      const accent = theme.palette.primary.main;
      const navLinkStyles = {
        root: {
          borderRadius: 10,
          padding: "9px 12px",
          color: active ? "#ffffff" : "var(--sidebar-text)",
          backgroundColor: active ? accent : "transparent",
          boxShadow: active ? `0 6px 16px ${accent}55` : "none",
          transition: "background-color 150ms ease, color 150ms ease",
        },
        label: { fontSize: 14, fontWeight: active ? 600 : 500 },
        section: { width: 24, color: active ? "#ffffff" : "var(--sidebar-text-muted)" },
      };

      return (
        <div
          key={`${item.name}-${index}`}
          className="sidebar-item"
          style={{ marginBottom: "2px", scrollbarWidth: "none" }}
        >
          {hasSubItems ? (
            <Menu
              trigger="hover"
              position="right-start"
              shadow="lg"
              width={220}
              offset={14}
              radius="md"
              withinPortal
            >
              <Menu.Target>
                <NavLink
                  label={!isCompact && item.name}
                  leftSection={item.icon}
                  rightSection={!isCompact && <IconChevronRight size={15} />}
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
                      color: isActive(subItem.path) ? theme.palette.primary.main : "inherit",
                      fontWeight: isActive(subItem.path) ? 600 : 500,
                      backgroundColor: isActive(subItem.path) ? theme.palette.primary.main + "14" : "transparent",
                      borderRadius: 8,
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
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--sidebar-bg)",
        scrollbarWidth: "none",
      }}
    >
      {/* Brand */}
      <div
        className={`flex items-center gap-3 ${isCompact ? "justify-center px-2" : "px-4"} py-4`}
        style={{ borderBottom: "1px solid var(--sidebar-border)", minHeight: 72 }}
      >
        {branding?.logo ? (
          <div className="flex h-11 shrink-0 items-center justify-center rounded-xl bg-white px-2" style={{ width: isCompact ? 44 : 64 }}>
            <img src={branding.logo} alt={branding?.companyName} className="max-h-9 max-w-full object-contain" />
          </div>
        ) : null}
        {!isCompact && (
          <div className="min-w-0 leading-tight">
            <div className="truncate text-[14px] font-bold text-white">{nameLine1}</div>
            {nameLine2 && <div className="truncate text-[11px] text-[var(--sidebar-text-muted)]">{nameLine2}</div>}
          </div>
        )}
      </div>

      {!isCompact && (
        <div className="px-5 pt-5 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--sidebar-text-muted)]">
          Menu
        </div>
      )}

      <ScrollArea
        style={{ flex: 1, padding: "4px 12px", scrollbarWidth: "none" }}
        type="never"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {renderMenuItems(menuItems)}
        </div>
      </ScrollArea>

      <Box p="sm" style={{ borderTop: "1px solid var(--sidebar-border)" }}>
        <button
          type="button"
          onClick={async () => {
            if (onClose) onClose();
            await logout();
          }}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-[var(--sidebar-text)] transition-colors hover:bg-red-500/15 hover:text-red-300"
        >
          <IconLogout size={18} />
          {!isCompact && <Text size="sm" fw={600} inherit>Logout</Text>}
        </button>
      </Box>
    </div>
  );
}
