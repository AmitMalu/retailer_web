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
import { MenuItem, SidebarProps, UserRole } from "@/Common/interface";
import { decryptData } from "@/Utils/helper";
import TextComponent from "../Atoms/TextComponent";
import { styled } from "@mui/material/styles";
import { useLogoutHandling } from "@/Utils/CustomLogout";
import { LogoutSvgIcon } from "@/assets/svg";

const StyledPopover = styled(Popover)(({ theme }) => ({
  "& .MuiPopover-paper": {
    transition: theme.transitions.create(["transform", "opacity"], {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.easeOut,
    }),
    transform: "translateX(8px)",
    opacity: 0,
    "&.MuiPopover-paper-enter": {
      transform: "translateX(0)",
      opacity: 1,
    },
  },
}));

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { logout } = useLogoutHandling();
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
  const drawerWidth = isCompact ? 60 : "auto";

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
            backgroundColor: theme.palette.red.DEFAULT,
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
            py: 1,
          }}
        >
          <List sx={{ overflowY: "auto", flexGrow: 1 }}>
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
                  className="flex items-start justify-start w-auto ml-[0.3px] rounded-s-xl mb-[0.2px] "
                  sx={{
                    color: theme.palette.background.navBackground,
                    "&.Mui-selected": {
                      backgroundColor: theme.palette.background.navBackground,
                      color: theme.palette.red.DEFAULT,
                      "&:hover": {
                        backgroundColor: theme.palette.background.navBackground,
                        color: theme.palette.red.DEFAULT,
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    className="flex items-start self-end justify-self-end  justify-start"
                    sx={{
                      color: isActive ? theme.palette.red.DEFAULT : "inherit",
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
          <div
            onClick={() => logout()}
            className="flex cursor-pointer items-center justify-center gap-4 "
          >
            <LogoutSvgIcon color={theme.palette.background.navBackground} />
          </div>
        </Box>
      </Drawer>

      {/* Submenu Popover */}
      <StyledPopover
        open={isSubMenuOpen}
        anchorEl={anchorEl}
        onClose={handleSubMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          "& .MuiPopover-paper": {
            width: "auto",
            boxShadow: theme.shadows[8],
            borderRadius: 2,
            overflow: "hidden",
            ml: 2,
            backgroundColor: theme.palette.red.light,
            transform: "translateX(8px)",
            opacity: 0,
            transition: theme.transitions.create(["transform", "opacity"], {
              duration: theme.transitions.duration.enteringScreen,
              easing: theme.transitions.easing.easeOut,
            }),
          },
          "& .MuiPopover-paper.MuiPopover-paper-enter": {
            transform: "translateX(0)",
            opacity: 1,
          },
        }}
        TransitionProps={{
          timeout: {
            enter: theme.transitions.duration.enteringScreen,
            exit: theme.transitions.duration.leavingScreen,
          },
        }}
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
                paddingLeft: 2,
                borderTopLeftRadius: 12,
                borderBottomLeftRadius: 12,
                marginLeft: 1,
                "&.Mui-selected": {
                  backgroundColor: theme.palette.background.navBackground,
                  color: theme.palette.red.DEFAULT,
                  "&:hover": {
                    backgroundColor: theme.palette.background.navBackground,
                    color: theme.palette.red.DEFAULT,
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
      </StyledPopover>
    </Box>
  );
}
