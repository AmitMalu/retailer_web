import { MenuItem, UserRole } from "@/Common/interface";
import React from "react";

export const getMenuItems = (role: UserRole): MenuItem[] => {
  const allMenuItems: MenuItem[] = [
    {
      name: "Dashboard",
      path: "/dashboard",
      //   icon: <DashboardIcon />,
    },
    {
      name: "Products",
      path: "/products",
      //   icon: <ShoppingCartIcon />,
      roles: ["RT", "DT"], // Only visible to Retailer and Distributor
    },
    {
      name: "Wallet To Bank",
      path: "/walletToBank",
      //   icon: <ShoppingCartIcon />,
      roles: ["RT", "DT"], // Only visible to Retailer and Distributor
    },
    {
      name: "Wallet To Bank Fund",
      path: "/walletToBankFund",
      //   icon: <ShoppingCartIcon />,
      roles: ["RT", "DT"], // Only visible to Retailer and Distributor
    },
    {
      name: "Wallet To Wallet",
      path: "/walletToWallet",
      //   icon: <ShoppingCartIcon />,
      roles: ["RT", "DT"], // Only visible to Retailer and Distributor
    },
    {
      name: "Reports",
      path: "/reports",
      //   icon: <ReceiptIcon />,
      roles: ["DT", "WL"],
      subItems: [
        {
          name: "Account Summary",
          path: "/reports/accountSummary",
          //   icon: <ListIcon />,
        },
        {
          name: "Transaction",
          path: "/reports/transaction",
          //   icon: <PendingIcon />,
        },
      ],
    },
    {
      name: "Settings",
      path: "/settings",
      //   icon: <AssessmentIcon />,
      subItems: [
        {
          name: "My Profile",
          path: "/settings/myProfile",
          //   icon: <ShowChartIcon />,
          roles: ["RT", "DT"],
        },
        {
          name: "Change Password",
          path: "/settings/changePassword",
          //   icon: <InventoryIcon />,
          roles: ["RT"],
        },
      ],
    },
    {
      name: "Support",
      path: "/support",
      //   icon: <AdminPanelSettingsIcon />,
      roles: ["SD"], // Only System Admin can see this menu
      subItems: [
        {
          name: "Bio Metric Device",
          path: "/support/bioMetricDevice",
          //   icon: <PeopleIcon />,
        },
        {
          name: "Ticketing",
          path: "/support/ticketing",
          //   icon: <AdminPanelSettingsIcon />,
        },
      ],
    },
  ];

  // Filter menu items based on user role
  const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
    return items
      .filter((item) => !item.roles || item.roles.includes(role)) // Filter by role
      .filter((item) => !item.hidden) // Filter out hidden items
      .map((item) => ({
        ...item,
        // Recursively filter submenus
        subItems: item.subItems ? filterMenuItems(item.subItems) : undefined,
      }))
      .filter((item) => {
        // Remove parent menu if it has no visible submenus
        if (item.subItems && item.subItems.length === 0) {
          return false;
        }
        return true;
      });
  };

  return filterMenuItems(allMenuItems);
};
