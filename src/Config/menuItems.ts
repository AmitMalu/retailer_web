import { MenuItem, UserRole } from "@/Common/interface";
import { RootState } from "@/Redux/Store";
import {
  decryptData,
  MENU_PATH_TO_ROLE_PATTERN,
  subRouteMapping,
} from "@/Utils/helper";
import {
  DashboardSvgIcon,
  FundingSvgIcon,
  ManageuserSvgIcon,
  ProductsSvgIcon,
  ReportsSvgIcon,
  SettingsSvgIcon,
  SupportSvgIcon,
  // WebSettingsSvgIcon,
} from "@/assets/svg";
import React from "react";
import { useSelector } from "react-redux";

export const getMenuItems = (role: UserRole): MenuItem[] => {
  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses,
  );
  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses.loginData)
    : null;

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
      roles: ["DT", "SD", "WL", "PT"],
      subItems: [
        {
          name: "Create User ",
          path: "/manageUser/createUser",
          //   icon: <ListIcon />,
          roles: ["DT", "SD", "WL", "PT"],
        },
        // {
        //   name: "Debit and Credit User",
        //   path: "/manageUser/debitAndCreditUser",
        //   //   icon: <PendingIcon />,
        //   roles: ["DT", "SD", "WL", "PT"],
        // },
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
      roles: ["RT", "RU"],
    },
    {
      name: "Funding",
      path: "/funding",
      icon: React.createElement(FundingSvgIcon, { color: "currentColor" }),
      roles: ["RT", "DT", "SD", "WL", "PT", "RU"],
      subItems: [
        {
          name: "Fund Request",
          path: "/funding/walletToBankFund",
          //   icon: <InventoryIcon />,
          roles: ["RT", "DT", "SD", "WL", "PT", "RU"],
        },
        {
          name: "Wallet To Wallet",
          path: "/funding/walletToWallet",
          //   icon: <InventoryIcon />,
          roles: ["RT", "DT", "SD", "WL", "PT", "RU"],
        },
        {
          name: "Move To Bank",
          path: "/funding/walletToBank",
          //   icon: <ShowChartIcon />,
          roles: ["RT", "DT", "SD", "WL", "PT", "RU"],
        },
        {
          name: "Fund Transfer",
          path: "/funding/fundTransfer",
          //   icon: <InventoryIcon />,
          roles: ["DT", "SD", "WL", "PT"],
        },
        {
          name: "Fund Reversal",
          path: "/funding/fundReversal",
          //   icon: <InventoryIcon />,
          roles: ["DT", "SD", "WL", "PT"],
        },
      ],
    },
    {
      name: "Settings",
      path: "/settings",
      icon: React.createElement(SettingsSvgIcon, { color: "currentColor" }),
      roles: ["RT", "DT", "SD", "WL", "PT", "RU"],
      subItems: [
        {
          name: "Create Sub User",
          path: "/settings/ViewSubUser",
          //   icon: <InventoryIcon />,
          roles: ["RT"],
        },
        // {
        //   name: "Change TPIN",
        //   path: "/settings/changeTPIN",
        //   //   icon: <InventoryIcon />,
        //   roles: ["RT", "DT", "SD", "WL", "PT", "RU"],
        // },
        // {
        //   name: "My Certificate",
        //   path: "/settings/myCertificate",
        //   //   icon: <InventoryIcon />,
        //   roles: ["RT", "DT", "SD", "WL", "PT", "RU"],
        // },
        // {
        //   name: "Low balance alert",
        //   path: "/settings/lowBalanceAlert",
        //   //   icon: <InventoryIcon />,
        //   roles: ["RT", "RU"],
        // },
        // {
        //   name: "ID Card",
        //   path: "/settings/idCard",
        //   //   icon: <InventoryIcon />,
        //   roles: ["DT", "SD", "WL", "PT"],
        // },
      ],
    },
    {
      name: "Support",
      path: "/support",
      icon: React.createElement(SupportSvgIcon, { color: "currentColor" }),
      roles: ["RT", "DT", "SD", "WL", "PT", "RU"], // Only System Admin can see this menu
      subItems: [
        // {
        //   name: "Bio Metric Device",
        //   path: "/support/bioMetricDevice",
        //   //   icon: <PeopleIcon />,
        //   roles: ["RT", "RU"],
        // },
        {
          name: "Ticketing System",
          path: "/support/ticketingSystem",
          //   icon: <AdminPanelSettingsIcon />,
          roles: ["RT", "DT", "SD", "WL", "PT", "RU"],
        },
        // {
        //   name: "Contact Us",
        //   path: "/support/contactUs",
        //   //   icon: <AdminPanelSettingsIcon />,
        //   roles: ["RT", "SD", "WL", "RU"],
        // },
        // {
        //   name: "Top Up Request",
        //   path: "/support/topUpRequest",
        //   //   icon: <AdminPanelSettingsIcon />,
        //   roles: ["DT", "SD", "WL", "PT"],
        // },
        // {
        //   name: "Top Up History",
        //   path: "/support/topUpHistory",
        //   //   icon: <AdminPanelSettingsIcon />,
        //   roles: ["DT", "SD", "WL", "PT"],
        // },
        // {
        //   name: "Add Money",
        //   path: "/support/addMoney",
        //   //   icon: <AdminPanelSettingsIcon />,
        //   roles: ["DT", "SD", "WL", "PT"],
        // },
        // {
        //   name: "Payment Request",
        //   path: "/support/paymentRequest",
        //   //   icon: <AdminPanelSettingsIcon />,
        //   roles: ["DT", "SD", "WL", "PT"],
        // },
        // {
        //   name: "Payment History",
        //   path: "/support/paymentHistory",
        //   //   icon: <AdminPanelSettingsIcon />,
        //   roles: ["DT", "SD", "WL", "PT"],
        // },
        // {
        //   name: "Payment Banks",
        //   path: "/support/paymentBanks",
        //   //   icon: <AdminPanelSettingsIcon />,
        //   roles: ["DT", "SD", "WL", "PT"],
        // },
      ],
    },
    // {
    //   name: "Website Settings",
    //   path: "/websiteSettings",
    //   icon: React.createElement(WebSettingsSvgIcon, { color: "currentColor" }),
    //   roles: ["WL"], // Only System Admin can see this menu
    //   subItems: [
    //     {
    //       name: "Website data",
    //       path: "/websiteSettings/websiteData",
    //       //   icon: <PeopleIcon />,
    //       roles: ["WL"],
    //     },
    //     {
    //       name: "Social Media Links",
    //       path: "/websiteSettings/socialMediaLinks",
    //       //   icon: <AdminPanelSettingsIcon />,
    //       roles: ["WL"],
    //     },
    //     {
    //       name: "Web And App Logo Image",
    //       path: "/websiteSettings/webAndAppLogoImage",
    //       //   icon: <AdminPanelSettingsIcon />,
    //       roles: ["WL"],
    //     },
    //     {
    //       name: "Website Page Content",
    //       path: "/websiteSettings/websitePageContent",
    //       //   icon: <AdminPanelSettingsIcon />,
    //       roles: ["WL"],
    //     },
    //   ],
    // },
    {
      name: "Reports",
      path: "/reports",
      icon: React.createElement(ReportsSvgIcon, { color: "currentColor" }),
      roles: ["DT", "RT", "SD", "WL", "PT", "RU"],
      subItems: [
        {
          name: "Transaction Report",
          path: "/reports/transaction-report",
          //   icon: <ListIcon />,
          roles: ["RT", "RU"],
        },
        {
          name: "TXN and Wallet Report",
          path: "/reports/txn-wallet-report",
          //   icon: <ListIcon />,
          roles: ["RT", "RU"],
        },
        {
          name: "Commission and Charges",
          path: "/reports/commissionAndCharges",
          //   icon: <ListIcon />,
          roles: ["DT", "RT", "SD", "WL", "PT", "RU"],
        },
        {
          name: "Wallet Report",
          path: "/reports/WalletReport",
          //   icon: <PendingIcon />,
          roles: ["DT", "RT", "SD", "WL", "PT", "RU"],
        },
        {
          name: "Network Transaction",
          path: "/reports/networkTransaction",
          //   icon: <PendingIcon />,
          roles: ["DT", "SD", "WL", "PT"],
        },
        // {
        //   name: "Account Summary",
        //   path: "/reports/accountSummary",
        //   //   icon: <ListIcon />,
        //   roles: ["DT", "RT", "SD", "WL", "PT", "RU"],
        // },
        {
          name: "Search Transaction",
          path: "/reports/searchTransaction",
          //   icon: <ListIcon />,
          roles: ["DT", "RT", "SD", "WL", "PT", "RU"],
        },
        // {
        //   name: "Download Report",
        //   path: "/reports/downloadReport",
        //   //   icon: <ListIcon />,
        //   roles: ["DT", "RT", "SD", "WL", "PT", "RU"],
        // },
        {
          name: "Fund Loading",
          path: "/reports/fundLoading",
          //   icon: <ListIcon />,
          roles: ["DT", "RT", "SD", "WL", "PT", "RU"],
        },
        // {
        //   name: "Payment Loading",
        //   path: "/reports/paymentLoading",
        //   //   icon: <ListIcon />,
        //   roles: ["DT", "SD", "WL", "PT"],
        // },
        {
          name: "Pending Transaction",
          path: "/reports/pendingTransaction",
          //   icon: <ListIcon />,
          roles: ["RT", "RU"],
        },
        {
          name: "Debit History",
          path: "/reports/debitHistory",
          //   icon: <ListIcon />,
          roles: ["DT", "SD", "WL", "PT"],
        },
        // {
        //   name: "Agent Performance",
        //   path: "/reports/agentPerformance",
        //   //   icon: <ListIcon />,
        //   roles: ["DT", "SD", "WL", "PT"],
        // },
        // {
        //   name: "Bank Withdrawal",
        //   path: "/reports/bankWithdrawal",
        //   //   icon: <ListIcon />,
        //   roles: ["DT", "SD", "WL", "PT"],
        // },
        {
          name: "Down Line Balance",
          path: "/reports/downLineBalance",
          //   icon: <ListIcon />,
          roles: ["DT", "SD", "WL", "PT"],
        },
      ],
    },
  ];

  const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
    if (role === "RU") {
      if (!loginData?.role_id || !loginData?.sub_role_id) {
        return items.filter((item) => item.path === "/dashboard");
      }

      // Get valid sub_roles (remove 0 and empty strings)
      const subRoles = loginData.sub_role_id
        .split(",")
        .map((s: string) => s.trim())
        .filter((s: string) => s !== "0" && s !== "");

      return items
        .filter((item) => {
          if (item.path === "/dashboard") return true;
          if (item.path in MENU_PATH_TO_ROLE_PATTERN) {
            const roleIndex = MENU_PATH_TO_ROLE_PATTERN[item.path];
            const shouldShow = loginData.role_id[roleIndex] === "1";
            return shouldShow;
          }
          return false;
        })
        .map((item) => {
          if (!item.subItems || !(item.path in subRouteMapping)) return item;

          const menuRoutes = subRouteMapping[item.path];
          const filteredSubItems = item.subItems.filter((subItem) => {
            const routeIndex = menuRoutes.findIndex((route) =>
              subItem.path.includes(route),
            );

            if (routeIndex === -1) {
              return false;
            }

            const subRole = `${MENU_PATH_TO_ROLE_PATTERN[item.path] + 1}.${routeIndex + 1}`;
            const shouldShow = subRoles.includes(subRole);

            return shouldShow;
          });

          return {
            ...item,
            subItems: filteredSubItems,
          };
        });
    }

    // Standard role-based filtering for non-RA roles
    return items
      .filter((item) => !item.roles || item.roles.includes(role))
      .filter((item) => !item.hidden)
      .map((item) => ({
        ...item,
        subItems: item.subItems ? filterMenuItems(item.subItems) : undefined,
      }))
      .filter((item) => {
        if (item.subItems && item.subItems.length === 0) {
          return false;
        }
        return true;
      });
  };

  return filterMenuItems(allMenuItems);
};
