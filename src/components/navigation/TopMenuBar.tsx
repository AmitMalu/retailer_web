import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { Menu, ScrollArea } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";
import { RootState } from "@/Redux/Store";
import { getMenuItems } from "@/Config/menuItems";
import { MenuItem, UserRole } from "@/Common/interface";
import { decryptData } from "@/Utils/helper";

const normalize = (path?: string) => (path ? (path.startsWith("/") ? path : `/${path}`) : "");

const matchesPath = (pathname: string, path?: string) => {
  const p = normalize(path);
  return !!p && (pathname === p || pathname.startsWith(`${p}/`));
};

const containsPath = (item: MenuItem, pathname: string): boolean =>
  matchesPath(pathname, item.path) || !!item.subItems?.some((sub) => containsPath(sub, pathname));

/** Horizontal menu bar that replaces the old floating sidebar. */
export default function TopMenuBar() {
  const theme = useTheme();
  const { pathname } = useLocation();
  const apiResponses = useSelector((state: RootState) => state.apiResponse.responses);
  const loginData = apiResponses?.loginData ? decryptData(apiResponses.loginData) : null;

  if (!loginData) return null;
  const menuItems = getMenuItems(loginData.role as UserRole);
  const primary = theme.palette.primary.main;

  const renderLeaf = (sub: MenuItem, idx: number) => {
    const active = matchesPath(pathname, sub.path);
    return (
      <Menu.Item
        key={`${sub.name}-${idx}`}
        component={Link}
        to={sub.path || "#"}
        className="!rounded-md !text-[13px]"
        style={{
          color: active ? primary : undefined,
          fontWeight: active ? 600 : 500,
          backgroundColor: active ? primary + "14" : undefined,
        }}
      >
        {sub.name}
      </Menu.Item>
    );
  };

  return (
    <ScrollArea type="never">
      <nav className="flex h-12 items-stretch gap-1 whitespace-nowrap">
        {menuItems.map((item, index) => {
          const active = containsPath(item, pathname);
          const hasSubItems = !!item.subItems?.length;

          const label = (
            <span
              className="relative flex h-full items-center gap-2 px-3 text-[13.5px] font-semibold transition-colors [&_svg]:h-[18px] [&_svg]:w-[18px]"
              style={{ color: active ? primary : "#475569" }}
            >
              {item.icon}
              {item.name}
              {hasSubItems && <IconChevronDown size={14} stroke={2} />}
              <span
                className="absolute inset-x-3 bottom-0 h-[3px] rounded-t-full transition-opacity"
                style={{ backgroundColor: primary, opacity: active ? 1 : 0 }}
              />
            </span>
          );

          if (!hasSubItems) {
            return (
              <Link key={`${item.name}-${index}`} to={item.path || "#"} className="flex hover:bg-slate-50">
                {label}
              </Link>
            );
          }

          return (
            <Menu
              key={`${item.name}-${index}`}
              trigger="click-hover"
              openDelay={60}
              closeDelay={120}
              position="bottom-start"
              offset={2}
              radius="md"
              shadow="lg"
              width={240}
              withinPortal
            >
              <Menu.Target>
                <button type="button" className="flex hover:bg-slate-50">
                  {label}
                </button>
              </Menu.Target>
              <Menu.Dropdown className="!p-2">
                <Menu.Label className="!text-[11px] !font-bold !text-slate-900">{item.name}</Menu.Label>
                {item.subItems?.map((sub, idx) =>
                  sub.subItems?.length ? (
                    <React.Fragment key={`${sub.name}-${idx}`}>
                      <Menu.Label className="!pt-3 !text-[10px] !font-semibold !uppercase !tracking-[0.14em]">
                        {sub.name}
                      </Menu.Label>
                      {sub.subItems.map(renderLeaf)}
                    </React.Fragment>
                  ) : (
                    renderLeaf(sub, idx)
                  )
                )}
              </Menu.Dropdown>
            </Menu>
          );
        })}
      </nav>
    </ScrollArea>
  );
}
