import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import { getMenuItems } from "@/Config/menuItems";
import { MenuItem, UserRole } from "@/Common/interface";
import { decryptData } from "@/Utils/helper";
import TextComponent from "../Atoms/TextComponent";

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { sidebarStyle } = useSelector((state: RootState) => state.settings);
  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses.loginData)
    : null;
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (!loginData) return null;

  const isCompact = sidebarStyle === "compact";
  const drawerWidth = isCompact ? 80 : 240;

  // State for submenu popover
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<MenuItem[]>([]);
  const [subMenuPosition, setSubMenuPosition] = useState({ top: 0, left: 0 });

  const menuItems = getMenuItems(loginData.role as UserRole);

  // Update the function signature to accept MenuItem instead of MenuItem[]
  const handleSubMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    item: MenuItem // Changed from subItems: MenuItem[]
  ) => {
    if (
      item.path &&
      item.path !== "#" &&
      (!item.subItems || item.subItems.length === 0)
    ) {
      if (isMobile && onClose) onClose();
      return; // Let the Link handle the navigation
    }

    // If it has subitems, open the submenu
    if (item.subItems && item.subItems.length > 0) {
      event.preventDefault();
      event.stopPropagation();

      // Toggle submenu if clicking the same item
      if (anchorEl === event.currentTarget) {
        handleSubMenuClose();
        return;
      }

      setAnchorEl(event.currentTarget);
      setActiveSubMenu(item.subItems); // Pass the subItems array here
      const rect = event.currentTarget.getBoundingClientRect();
      setSubMenuPosition({
        top: rect.top,
        left: rect.right,
      });
    }
  };

  const handleSubMenuClose = () => {
    setAnchorEl(null);
    setActiveSubMenu([]);
  };

  const isSubMenuOpen = Boolean(anchorEl);

  // Close mobile menu when a menu item is clicked
  const handleMenuItemClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
    handleSubMenuClose();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            border: "none",
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[3],
            borderRadius: "0 16px 16px 0",
            height: "auto",
            position: "relative",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <List sx={{ overflowY: "auto", flexGrow: 1, py: 1 }}>
            {menuItems.map((item, index) => {
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isActive =
                location.pathname === item.path ||
                (item.subItems?.some((subItem) =>
                  location.pathname.startsWith(subItem.path)
                ) ??
                  false);

              const listItem = (
                <ListItemButton
                  onClick={(e) => handleSubMenuOpen(e, item)}
                  selected={isActive}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    mb: 0.5,
                    "&.Mui-selected": {
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.main,
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isActive
                        ? theme.palette.primary.contrastText
                        : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!isCompact && (
                    <ListItemText
                      primary={
                        <TextComponent variant="body2" color="inherit">
                          {item.name}
                        </TextComponent>
                      }
                    />
                  )}
                  {hasSubItems && <ChevronRight fontSize="small" />}
                </ListItemButton>
              );

              return (
                <React.Fragment key={index}>
                  {!hasSubItems ? (
                    <Link
                      to={item.path || "#"}
                      style={{ textDecoration: "none", color: "inherit" }}
                      onClick={() => isMobile && onClose && onClose()}
                    >
                      {listItem}
                    </Link>
                  ) : (
                    <div>{listItem}</div>
                  )}
                </React.Fragment>
              );
            })}
          </List>
        </Box>
      </Drawer>

      {/* Submenu Popover */}
      <Popover
        open={isSubMenuOpen}
        anchorEl={anchorEl}
        onClose={handleSubMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={
          isSubMenuOpen
            ? { top: subMenuPosition.top, left: subMenuPosition.left }
            : undefined
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            width: 240,
            boxShadow: theme.shadows[8],
            borderRadius: 2,
            overflow: "hidden",
            ml: 1,
          },
        }}
        disableRestoreFocus
      >
        <List>
          {activeSubMenu.map((subItem, index) => (
            <ListItemButton
              key={index}
              component={Link}
              to={subItem.path}
              onClick={handleMenuItemClick}
              selected={location.pathname === subItem.path}
              sx={{
                px: 3,
                "&.Mui-selected": {
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                  },
                },
              }}
            >
              <ListItemText
                primary={
                  <TextComponent variant="body2" color="inherit">
                    {subItem.name}
                  </TextComponent>
                }
              />
            </ListItemButton>
          ))}
        </List>
      </Popover>
    </Box>
  );
}
