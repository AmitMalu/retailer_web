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

  // Original menu names and order. Sub-user (RU) permissions are keyed by path
  // (MENU_PATH_TO_ROLE_PATTERN / subRouteMapping), so paths must not change.
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
        { name: "Create User", path: "/manageUser/createUser", roles: ["DT", "SD", "WL", "PT"] },
        { name: "View User", path: "/manageUser/ViewUser", roles: ["DT", "SD", "WL", "PT"] },
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
        { name: "Fund Request", path: "/funding/walletToBankFund", roles: ["RT", "DT", "SD", "WL", "PT", "RU"] },
        { name: "Wallet To Wallet", path: "/funding/walletToWallet", roles: ["RT", "DT", "SD", "WL", "PT", "RU"] },
        { name: "Move To Bank", path: "/funding/walletToBank", roles: ["RT", "DT", "SD", "WL", "PT", "RU"] },
        { name: "Fund Transfer", path: "/funding/fundTransfer", roles: ["DT", "SD", "WL", "PT"] },
        { name: "Fund Reversal", path: "/funding/fundReversal", roles: ["DT", "SD", "WL", "PT"] },
      ],
    },
    {
      name: "Settings",
      path: "/settings",
      icon: React.createElement(SettingsSvgIcon, { color: "currentColor" }),
      roles: ["RT", "DT", "SD", "WL", "PT", "RU"],
      subItems: [{ name: "Create Sub User", path: "/settings/ViewSubUser", roles: ["RT"] }],
    },
    {
      name: "Support",
      path: "/support",
      icon: React.createElement(SupportSvgIcon, { color: "currentColor" }),
      roles: ["RT", "DT", "SD", "WL", "PT", "RU"],
      subItems: [{ name: "Ticketing System", path: "/support/ticketingSystem", roles: ["RT", "DT", "SD", "WL", "PT", "RU"] }],
    },
    {
      name: "Reports",
      path: "/reports",
      icon: React.createElement(ReportsSvgIcon, { color: "currentColor" }),
      roles: ["DT", "RT", "SD", "WL", "PT", "RU"],
      subItems: [
        { name: "Transaction Report", path: "/reports/transaction-report", roles: ["DT", "RT", "SD", "WL", "PT", "RU"] },
        { name: "TXN and Wallet Report", path: "/reports/txn-wallet-report", roles: ["RT", "RU"] },
        { name: "Commission and Charges", path: "/reports/commissionAndCharges", roles: ["DT", "RT", "SD", "WL", "PT", "RU"] },
        { name: "Wallet Report", path: "/reports/WalletReport", roles: ["DT", "RT", "SD", "WL", "PT", "RU"] },
        { name: "Network Transaction", path: "/reports/networkTransaction", roles: ["DT", "SD", "WL", "PT"] },
        { name: "Search Transaction", path: "/reports/searchTransaction", roles: ["DT", "RT", "SD", "WL", "PT", "RU"] },
        { name: "Fund Loading", path: "/reports/fundLoading", roles: ["DT", "RT", "SD", "WL", "PT", "RU"] },
        { name: "Pending Transaction", path: "/reports/pendingTransaction", roles: ["RT", "RU"] },
        { name: "Debit History", path: "/reports/debitHistory", roles: ["DT", "SD", "WL", "PT"] },
        { name: "Down Line Balance", path: "/reports/downLineBalance", roles: ["DT", "SD", "WL", "PT"] },
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
