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

  // Smart Credit Solution naming. Order is display only: sub-user (RU) permissions are keyed
  // by path (MENU_PATH_TO_ROLE_PATTERN / subRouteMapping), so paths must not change.
  const allMenuItems: MenuItem[] = [
    {
      name: "Home",
      path: "/dashboard",
      icon: React.createElement(DashboardSvgIcon, { color: "currentColor" }),
    },
    {
      name: "Services",
      path: "/products",
      icon: React.createElement(ProductsSvgIcon, { color: "currentColor" }),
      roles: ["RT", "RU"],
    },
    {
      name: "Wallet",
      path: "/funding",
      icon: React.createElement(FundingSvgIcon, { color: "currentColor" }),
      roles: ["RT", "DT", "SD", "WL", "PT", "RU"],
      subItems: [
        { name: "Add Money", path: "/funding/walletToBankFund", roles: ["RT", "DT", "SD", "WL", "PT", "RU"] },
        { name: "Send to Wallet", path: "/funding/walletToWallet", roles: ["RT", "DT", "SD", "WL", "PT", "RU"] },
        { name: "Withdraw to Bank", path: "/funding/walletToBank", roles: ["RT", "DT", "SD", "WL", "PT", "RU"] },
        { name: "Transfer to Network", path: "/funding/fundTransfer", roles: ["DT", "SD", "WL", "PT"] },
        { name: "Reverse Transfer", path: "/funding/fundReversal", roles: ["DT", "SD", "WL", "PT"] },
      ],
    },
    {
      name: "Statements",
      path: "/reports",
      icon: React.createElement(ReportsSvgIcon, { color: "currentColor" }),
      roles: ["DT", "RT", "SD", "WL", "PT", "RU"],
      subItems: [
        { name: "Transactions", path: "/reports/transaction-report", roles: ["DT", "RT", "SD", "WL", "PT", "RU"] },
        { name: "Find a Transaction", path: "/reports/searchTransaction", roles: ["DT", "RT", "SD", "WL", "PT", "RU"] },
        { name: "In-Process", path: "/reports/pendingTransaction", roles: ["RT", "RU"] },
        { name: "Transactions & Wallet", path: "/reports/txn-wallet-report", roles: ["RT", "RU"] },
        { name: "Wallet Statement", path: "/reports/WalletReport", roles: ["DT", "RT", "SD", "WL", "PT", "RU"] },
        { name: "Earnings & Charges", path: "/reports/commissionAndCharges", roles: ["DT", "RT", "SD", "WL", "PT", "RU"] },
        { name: "Money Added", path: "/reports/fundLoading", roles: ["DT", "RT", "SD", "WL", "PT", "RU"] },
        { name: "Network Activity", path: "/reports/networkTransaction", roles: ["DT", "SD", "WL", "PT"] },
        { name: "Network Balances", path: "/reports/downLineBalance", roles: ["DT", "SD", "WL", "PT"] },
        { name: "Debits", path: "/reports/debitHistory", roles: ["DT", "SD", "WL", "PT"] },
      ],
    },
    {
      name: "My Network",
      path: "/manageUser",
      icon: React.createElement(ManageuserSvgIcon, { color: "currentColor" }),
      roles: ["DT", "SD", "WL", "PT"],
      subItems: [
        { name: "Add Member", path: "/manageUser/createUser", roles: ["DT", "SD", "WL", "PT"] },
        { name: "Members", path: "/manageUser/ViewUser", roles: ["DT", "SD", "WL", "PT"] },
      ],
    },
    {
      name: "Account",
      path: "/settings",
      icon: React.createElement(SettingsSvgIcon, { color: "currentColor" }),
      roles: ["RT", "DT", "SD", "WL", "PT", "RU"],
      subItems: [{ name: "Sub Users", path: "/settings/ViewSubUser", roles: ["RT"] }],
    },
    {
      name: "Help",
      path: "/support",
      icon: React.createElement(SupportSvgIcon, { color: "currentColor" }),
      roles: ["RT", "DT", "SD", "WL", "PT", "RU"],
      subItems: [{ name: "Support Tickets", path: "/support/ticketingSystem", roles: ["RT", "DT", "SD", "WL", "PT", "RU"] }],
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
