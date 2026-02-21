import type { UserRole } from "@/Common/interface";
import { BOT_CONFIG, BOT_ROUTE_OPTIONS, type BotOption } from "@/Config/botConfig";
import { MENU_PATH_TO_ROLE_PATTERN, subRouteMapping } from "@/Utils/helper";

type LoginData = {
  role?: UserRole;
  role_id?: string;
  sub_role_id?: string;
};

const normalizeText = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9/\s-]/g, " ").trim();

const hasBasicRoleAccess = (option: BotOption, role?: UserRole) => {
  if (!option.allowedRoles) return true;
  if (!role) return false;
  return option.allowedRoles.includes(role);
};

const hasRUAccess = (path: string, loginData: LoginData) => {
  if (path === "/dashboard") return true;

  if (!loginData.role_id || !loginData.sub_role_id) {
    return false;
  }

  const menuPath = `/${path.split("/")[1]}`;
  if (!(menuPath in MENU_PATH_TO_ROLE_PATTERN)) {
    return false;
  }

  const roleIndex = MENU_PATH_TO_ROLE_PATTERN[menuPath];
  if (roleIndex >= loginData.role_id.length || loginData.role_id[roleIndex] !== "1") {
    return false;
  }

  const subPath = path.split("/").slice(2).join("/");
  if (subPath && menuPath in subRouteMapping) {
    const subRoutes = subRouteMapping[menuPath];
    const routeIndex = subRoutes.findIndex((route) => subPath.startsWith(route));

    if (routeIndex !== -1) {
      const subRole = `${MENU_PATH_TO_ROLE_PATTERN[menuPath] + 1}.${routeIndex + 1}`;
      const subRoles = loginData.sub_role_id
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "0" && s !== "");

      return subRoles.includes(subRole);
    }
  }

  return true;
};

const canAccessRoute = (option: BotOption, loginData?: LoginData | null) => {
  const role = loginData?.role;
  const isLoggedIn = Boolean(role);

  if (option.isAuthRoute && isLoggedIn) {
    return false;
  }

  if (!hasBasicRoleAccess(option, role)) {
    return false;
  }

  if (role === "RU") {
    return hasRUAccess(option.path, loginData ?? {});
  }

  return true;
};

const filterOptionsByAccess = (options: BotOption[], loginData?: LoginData | null) =>
  options.filter((option) => canAccessRoute(option, loginData));

const findRouteMatches = (message: string, loginData?: LoginData | null): BotOption[] => {
  const normalizedMessage = normalizeText(message);
  if (!normalizedMessage) return [];

  const terms = normalizedMessage.split(/\s+/).filter(Boolean);
  const allowedOptions = filterOptionsByAccess(BOT_ROUTE_OPTIONS, loginData);

  return allowedOptions
    .filter((option) => {
      const searchable = `${option.label} ${option.path}`.toLowerCase();
      return terms.every((term) => searchable.includes(term));
    })
    .slice(0, 10);
};

export const findBotResponse = (message: string, loginData?: LoginData | null) => {
  const msg = normalizeText(message);

  for (const item of BOT_CONFIG) {
    if (item.keywords.some((keyword) => msg.includes(normalizeText(keyword)))) {
      const accessibleOptions = filterOptionsByAccess(item.options, loginData);
      return {
        ...item,
        options: accessibleOptions,
        reply:
          accessibleOptions.length > 0
            ? item.reply
            : "No routes are available for your role in this section.",
      };
    }
  }

  const routeMatches = findRouteMatches(message, loginData);
  if (routeMatches.length > 0) {
    return {
      reply: "I found matching pages:",
      options: routeMatches,
    };
  }

  return {
    reply:
      "I didn't understand. Try products, reports, dashboard, funding, settings, support.",
    options: [],
  };
};

export const getSuggestions = (input: string, loginData?: LoginData | null): BotOption[] => {
  const query = normalizeText(input);
  if (!query) return [];

  const allowedOptions = filterOptionsByAccess(BOT_ROUTE_OPTIONS, loginData);
  return allowedOptions
    .filter((option) => {
      const label = normalizeText(option.label);
      const path = normalizeText(option.path);
      return label.includes(query) || path.includes(query);
    })
    .slice(0, 8);
};
