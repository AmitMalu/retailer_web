import { MenuItem, UserRole } from "@/Common/interface";
import {
  DashboardSvgIcon,
  FundingSvgIcon,
  ManageuserSvgIcon,
  ProductsSvgIcon,
  ReportsSvgIcon,
  SettingsSvgIcon,
  SupportSvgIcon,
  WebSettingsSvgIcon,
} from "@/assets/svg";
import React from "react";

export const getMenuItems = (role: UserRole): MenuItem[] => {
  const allMenuItems: MenuItem[] = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: React.createElement(DashboardSvgIcon, { color: "currentColor" }),
    },
    {
      name: "Manage User",
      path: "/manageUser",
      icon: React.createElement(ManageuserSvgIcon, { color: "currentColor" }),
      roles: ["DT", "SD", "RT", "WL", "PT"],
      subItems: [
        {
          name: "Create User ",
          path: "/manageUser/createUser",
          //   icon: <ListIcon />,
          roles: ["DT", "SD", "WL", "PT"],
        },
        {
          name: "Debit and Credit User",
          path: "/manageUser/debitAndCreditUser",
          //   icon: <PendingIcon />,
          roles: ["DT", "SD", "WL", "PT"],
        },
        {
          name: "View User",
          path: "/manageUser/ViewUser",
          //   icon: <PendingIcon />,
          roles: ["DT", "SD", "WL", "PT"],
        },
      ],
    },
    {
      name: "Products",
      path: "/products",
      icon: React.createElement(ProductsSvgIcon, { color: "currentColor" }),
      roles: ["RT"],
    },
    {
      name: "Funding",
      path: "/funding",
      icon: React.createElement(FundingSvgIcon, { color: "currentColor" }),
      roles: ["RT", "DT", "SD", "WL", "PT"],
      subItems: [
        {
          name: "Wallet To Bank Fund",
          path: "/funding/walletToBankFund",
          //   icon: <InventoryIcon />,
          roles: ["RT", "DT", "SD", "WL", "PT"],
        },
        {
          name: "Wallet To Wallet",
          path: "/funding/walletToWallet",
          //   icon: <InventoryIcon />,
          roles: ["RT", "DT", "SD", "WL", "PT"],
        },
        {
          name: "Fund Transfer",
          path: "/funding/fundTransfer",
          //   icon: <InventoryIcon />,
          roles: ["RT", "DT", "SD", "WL", "PT"],
        },
        {
          name: "Fund Reversal",
          path: "/funding/fundReversal",
          //   icon: <InventoryIcon />,
          roles: ["DT", "SD", "WL", "PT"],
        },
        {
          name: "Wallet To Bank",
          path: "/funding/walletToBank",
          //   icon: <ShowChartIcon />,
          roles: ["RT", "DT", "SD", "WL", "PT"],
        },
      ],
    },

    {
      name: "Settings",
      path: "/settings",
      icon: React.createElement(SettingsSvgIcon, { color: "currentColor" }),
      roles: ["RT", "DT", "SD", "WL", "PT"],
      subItems: [
        {
          name: "Change TPIN",
          path: "/settings/changeTPIN",
          //   icon: <InventoryIcon />,
          roles: ["RT", "DT", "SD", "WL", "PT"],
        },
        {
          name: "My Certificate",
          path: "/settings/myCertificate",
          //   icon: <InventoryIcon />,
          roles: ["RT", "DT", "SD", "WL", "PT"],
        },
        {
          name: "Low balance alert",
          path: "/settings/lowBalanceAlert",
          //   icon: <InventoryIcon />,
          roles: ["RT"],
        },
        {
          name: "ID Card",
          path: "/settings/idCard",
          //   icon: <InventoryIcon />,
          roles: ["DT", "SD", "WL", "PT"],
        },
      ],
    },
    {
      name: "Support",
      path: "/support",
      icon: React.createElement(SupportSvgIcon, { color: "currentColor" }),
      roles: ["RT", "DT", "SD", "WL", "PT"], // Only System Admin can see this menu
      subItems: [
        {
          name: "Bio Metric Device",
          path: "/support/bioMetricDevice",
          //   icon: <PeopleIcon />,
          roles: ["RT"],
        },
        {
          name: "Ticketing System",
          path: "/support/ticketingSystem",
          //   icon: <AdminPanelSettingsIcon />,
          roles: ["RT", "DT", "SD", "WL", "PT"],
        },
        {
          name: "Contact Us",
          path: "/support/contactUs",
          //   icon: <AdminPanelSettingsIcon />,
          roles: ["RT", "SD", "WL"],
        },
        {
          name: "Top Up Request",
          path: "/support/topUpRequest",
          //   icon: <AdminPanelSettingsIcon />,
          roles: ["DT", "SD", "WL", "PT"],
        },
        {
          name: "Top Up History",
          path: "/support/topUpHistory",
          //   icon: <AdminPanelSettingsIcon />,
          roles: ["DT", "SD", "WL", "PT"],
        },
        {
          name: "Add Money",
          path: "/support/addMoney",
          //   icon: <AdminPanelSettingsIcon />,
          roles: ["DT", "SD", "WL", "PT"],
        },
        {
          name: "Payment Request",
          path: "/support/paymentRequest",
          //   icon: <AdminPanelSettingsIcon />,
          roles: ["DT", "SD", "WL", "PT"],
        },
        {
          name: "Payment History",
          path: "/support/paymentHistory",
          //   icon: <AdminPanelSettingsIcon />,
          roles: ["DT", "SD", "WL", "PT"],
        },
        {
          name: "Payment Banks",
          path: "/support/paymentBanks",
          //   icon: <AdminPanelSettingsIcon />,
          roles: ["DT", "SD", "WL", "PT"],
        },
      ],
    },
    {
      name: "Website Settings",
      path: "/websiteSettings",
      icon: React.createElement(WebSettingsSvgIcon, { color: "currentColor" }),
      roles: ["WL"], // Only System Admin can see this menu
      subItems: [
        {
          name: "Website data",
          path: "/websiteSettings/websiteData",
          //   icon: <PeopleIcon />,
          roles: ["WL"],
        },
        {
          name: "Social Media Links",
          path: "/websiteSettings/socialMediaLinks",
          //   icon: <AdminPanelSettingsIcon />,
          roles: ["WL"],
        },
        {
          name: "Web And App Logo Image",
          path: "/websiteSettings/webAndAppLogoImage",
          //   icon: <AdminPanelSettingsIcon />,
          roles: ["WL"],
        },
        {
          name: "Website Page Content",
          path: "/websiteSettings/websitePageContent",
          //   icon: <AdminPanelSettingsIcon />,
          roles: ["WL"],
        },
      ],
    },
    {
      name: "Reports",
      path: "/reports",
      icon: React.createElement(ReportsSvgIcon, { color: "currentColor" }),
      roles: ["DT", "RT", "SD", "WL", "PT"],
      subItems: [
        {
          name: "Commission and Charges",
          path: "/reports/commissionAndCharges",
          //   icon: <ListIcon />,
          roles: ["DT", "RT", "SD", "WL", "PT"],
        },
        {
          name: "Wallet Report",
          path: "/reports/WalletReport",
          //   icon: <PendingIcon />,
          roles: ["DT", "RT", "SD", "WL", "PT"],
        },
        {
          name: "Network Transaction",
          path: "/reports/networkTransaction",
          //   icon: <PendingIcon />,
          roles: ["DT", "RT", "SD", "WL", "PT"],
        },
        {
          name: "Account Summary",
          path: "/reports/accountSummary",
          //   icon: <ListIcon />,
          roles: ["DT", "RT", "SD", "WL", "PT"],
        },
        {
          name: "Search Transaction",
          path: "/reports/searchTransaction",
          //   icon: <ListIcon />,
          roles: ["DT", "RT", "SD", "WL", "PT"],
        },
        {
          name: "Download Report",
          path: "/reports/downloadReport",
          //   icon: <ListIcon />,
          roles: ["DT", "RT", "SD", "WL", "PT"],
        },
        {
          name: "Fund Loading",
          path: "/reports/fundLoading",
          //   icon: <ListIcon />,
          roles: ["RT"],
        },
        {
          name: "Payment Loading",
          path: "/reports/paymentLoading",
          //   icon: <ListIcon />,
          roles: ["DT", "SD", "WL", "PT"],
        },

        {
          name: "Pending Transaction",
          path: "/reports/pendingTransaction",
          //   icon: <ListIcon />,
          roles: ["RT"],
        },
        {
          name: "Debit History",
          path: "/reports/debitHistory",
          //   icon: <ListIcon />,
          roles: ["DT", "SD", "WL", "PT"],
        },
        {
          name: "Agent Performance",
          path: "/reports/agentPerformance",
          //   icon: <ListIcon />,
          roles: ["DT", "SD", "WL", "PT"],
        },
        {
          name: "Bank Withdrawal",
          path: "/reports/bankWithdrawal",
          //   icon: <ListIcon />,
          roles: ["DT", "SD", "WL", "PT"],
        },
        {
          name: "Down Line Balance",
          path: "/reports/downLineBalance",
          //   icon: <ListIcon />,
          roles: ["DT", "SD", "WL", "PT"],
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
