import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton, Tooltip } from "@mantine/core";
import { DatesRangeValue } from "@mantine/dates";
import moment from "moment";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  IconAlertTriangle,
  IconArrowDownLeft,
  IconArrowRight,
  IconArrowUpRight,
  IconBolt,
  IconCalendar,
  IconChartBar,
  IconClockHour4,
  IconCoin,
  IconListDetails,
  IconReceipt2,
  IconRefresh,
  IconTrendingUp,
  IconTrophy,
  IconUserPlus,
  IconUsersGroup,
} from "@tabler/icons-react";
import CustomDateRangePicker from "@/components/Atoms/NewComponents/CustomDateRangePicker";
import { getMenuItems } from "@/Config/menuItems";
import { UserRole } from "@/Common/interface";

/* ---------------------------------------------------------------- helpers */

const toNumber = (value: unknown): number => {
  if (typeof value === "number") return value;
  const n = Number(String(value ?? "").replace(/[₹,\s]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const formatFull = (n: number, money = true) =>
  `${money ? "₹" : ""}${n.toLocaleString("en-IN", { maximumFractionDigits: money ? 2 : 0 })}`;

/** Short Indian format: ₹10.78 L, ₹1.2 Cr */
const formatShort = (n: number, money = true) => {
  const abs = Math.abs(n);
  const unit: [number, string] | null =
    abs >= 1e7 ? [1e7, " Cr"] : abs >= 1e5 ? [1e5, " L"] : abs >= 1e3 ? [1e3, " K"] : null;
  const text = unit
    ? `${(n / unit[0]).toLocaleString("en-IN", { maximumFractionDigits: 2 })}${unit[1]}`
    : n.toLocaleString("en-IN", { maximumFractionDigits: money ? 2 : 0 });
  return `${money ? "₹" : ""}${text}`;
};

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

type Tone = "emerald" | "sky" | "violet" | "amber" | "rose" | "slate";

const TONES: Record<Tone, string> = {
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/20",
  sky: "bg-sky-50 text-sky-600 ring-sky-100 dark:bg-sky-500/15 dark:text-sky-300 dark:ring-sky-500/20",
  violet: "bg-violet-50 text-violet-600 ring-violet-100 dark:bg-violet-500/15 dark:text-violet-300 dark:ring-violet-500/20",
  amber: "bg-amber-50 text-amber-600 ring-amber-100 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/20",
  rose: "bg-rose-50 text-rose-600 ring-rose-100 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-500/20",
  slate: "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-white/10 dark:text-slate-300 dark:ring-white/10",
};

const CARD_META: Record<string, { title: string; icon: typeof IconCoin; tone: Tone; hint?: string }> = {
  "COMMISSION EARNED": { title: "Commission Earned", icon: IconCoin, tone: "amber", hint: "Your earnings in this period" },
  "PENDING TRANSACTION": { title: "Pending Transactions", icon: IconClockHour4, tone: "amber", hint: "Waiting for a final status" },
  "TOTAL NETWORK": { title: "Total Network", icon: IconUsersGroup, tone: "violet", hint: "Members linked to you" },
  "ACTIVE NETWORK": { title: "Active Network", icon: IconUsersGroup, tone: "emerald", hint: "Members who transacted" },
  "RETAILERS CREATED": { title: "Retailers", icon: IconUserPlus, tone: "violet", hint: "Retailers in your network" },
  "FUND TRANSFERRED": { title: "Fund Transferred", icon: IconArrowUpRight, tone: "sky", hint: "Sent to your network" },
  "FUND RECEIVED": { title: "Fund Received", icon: IconArrowDownLeft, tone: "emerald", hint: "Received into your wallet" },
};

const QUICK_ACTIONS: Record<"retailer" | "network", string[]> = {
  retailer: ["Products", "Request Funds", "Wallet Transfer", "Transfer to Bank", "Transaction History", "Support Tickets"],
  network: ["Add Network Member", "View Network", "Network Fund Transfer", "Request Funds", "Transaction History", "Downline Balances"],
};

const TOP_TITLE: Record<string, string> = {
  WL: "Top Super Distributors",
  SD: "Top Partners",
  PT: "Top Distributors",
  DT: "Top Retailers",
};

const statusClass = (status: string) => {
  const s = status.toUpperCase();
  if (s === "SUCCESS") return "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30";
  if (s === "PENDING" || s === "INITIATED") return "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30";
  if (s === "FAILURE" || s === "FAILED" || s === "REFUNDED") return "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-500/30";
  return "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-white/10 dark:text-slate-300 dark:ring-white/10";
};

const card = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111827]";
const titleText = "text-base font-bold text-slate-900 dark:text-slate-100";
const mutedText = "text-xs text-slate-500 dark:text-slate-400";

/* ------------------------------------------------------------------ page */

interface SmartDashboardProps {
  role: UserRole;
  selectedDate: DatesRangeValue;
  setSelectedDate: (date: DatesRangeValue) => void;
  selectedLabel: string;
  dashboardData: any;
  isLoading: boolean;
  onRefresh: () => void;
}

const SmartDashboard = ({
  role,
  selectedDate,
  setSelectedDate,
  selectedLabel,
  dashboardData,
  isLoading,
  onRefresh,
}: SmartDashboardProps) => {
  const navigate = useNavigate();
  const isRetailer = role === "RT" || role === "RU";
  const menuItems = getMenuItems(role);

  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);

  const loading = isLoading && !dashboardData;
  const profile = dashboardData?.profile || {};
  const cards: { label: string; value: unknown; prefix?: string }[] = dashboardData?.cards || [];
  const cardValue = (label: string) => toNumber(cards.find((c) => c.label === label)?.value);

  const headline = cardValue("TRANSACTION VOLUME");
  const pendingTxn = cardValue("PENDING TRANSACTION");
  // Network counts are always 0 for a retailer, so they are not shown there
  const hiddenTiles = isRetailer ? ["TRANSACTION VOLUME", "TOTAL NETWORK", "ACTIVE NETWORK"] : ["TRANSACTION VOLUME"];
  const tiles = cards.filter((c) => !hiddenTiles.includes(c.label));

  const trend = (dashboardData?.graphData || []).map((r: any) => ({
    month: moment(r.month, "YYYY-MM").isValid() ? moment(r.month, "YYYY-MM").format("MMM YY") : r.month,
    value: toNumber(r.value),
  }));

  // Retailer: service share this month (percentages from API)
  const services: { name: string; value: number }[] = (dashboardData?.servicePieData || [])
    .map((r: any) => ({ name: r.name ?? "Other", value: toNumber(r.value) }))
    .sort((a: any, b: any) => b.value - a.value);

  // Retailer: last 5 transactions / Network: top 5 members
  const tableRows: any[] = dashboardData?.tableData || [];

  const quickActions = useMemo(() => {
    const allowed = new Map<string, string>();
    const walk = (items: any[] = []) =>
      items.forEach((i) => {
        if (i.path && !i.subItems?.length) allowed.set(i.name, i.path);
        walk(i.subItems);
      });
    walk(menuItems as any[]);
    return QUICK_ACTIONS[isRetailer ? "retailer" : "network"]
      .filter((n) => allowed.has(n))
      .map((name) => ({ name, path: allowed.get(name)! }));
  }, [menuItems, isRetailer]);

  const pendingLink = isRetailer ? "/reports/pendingTransaction" : "/reports/transaction-report";

  const heroStats = [
    { label: "Prepaid balance", value: formatShort(toNumber(profile.prepaid)) },
    { label: "Postpaid balance", value: formatShort(toNumber(profile.postpaid)) },
  ];

  return (
    <div className="flex w-full flex-col gap-5 pb-6">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#123b35] to-[#047857] p-6 text-white shadow-lg md:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-teal-300/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            {profile?.image ? (
              <img
                src={profile.image}
                alt=""
                className="hidden h-14 w-14 shrink-0 rounded-xl bg-white object-contain p-1 sm:block"
              />
            ) : null}
            <div>
              <p className="text-sm font-medium text-emerald-200">
                {greeting()}
                {profile?.name ? `, ${profile.name}` : ""}
              </p>
              {(profile?.retailerId || profile?.hierarchyId) && (
                <p className="text-xs text-white/50">{profile.retailerId || profile.hierarchyId}</p>
              )}
              <h1 className="mt-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">
                {isRetailer ? "Your business" : "Network business"} · {selectedLabel}
              </h1>
              {loading ? (
                <Skeleton height={52} width={240} mt={10} radius="md" />
              ) : (
                <Tooltip label={formatFull(headline)} position="bottom-start">
                  <div className="mt-2 text-[44px] font-extrabold leading-none tracking-tight md:text-[56px]">
                    {formatShort(headline)}
                  </div>
                </Tooltip>
              )}
              <p className="mt-3 flex items-center gap-1.5 text-sm text-white/75">
                <IconTrendingUp size={16} className="text-emerald-300" />
                Successful transaction volume in this period
              </p>
            </div>
          </div>

          <div className="flex w-full items-center gap-2 lg:w-auto">
            <div className="w-full rounded-xl bg-white/10 p-1.5 ring-1 ring-white/15 backdrop-blur lg:w-72">
              <CustomDateRangePicker
                placeholder="Select date range"
                size="sm"
                shortcuts
                minDate={sixMonthsAgo}
                maxDate={today}
                value={selectedDate}
                onChange={(val: DatesRangeValue) => setSelectedDate(val)}
                required
                leftIcon={<IconCalendar size={16} />}
              />
            </div>
            <Tooltip label="Refresh">
              <button
                type="button"
                onClick={onRefresh}
                aria-label="Refresh dashboard"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 transition hover:bg-white/20"
              >
                <IconRefresh size={18} className={isLoading ? "animate-spin" : ""} />
              </button>
            </Tooltip>
          </div>
        </div>

        <div className="relative mt-6 grid grid-cols-2 gap-3 md:max-w-xl">
          {heroStats.map((s) => (
            <div key={s.label} className="rounded-xl bg-white/[0.07] px-4 py-3 ring-1 ring-white/10">
              <div className="text-[11px] font-medium uppercase tracking-wide text-white/60">{s.label}</div>
              <div className="mt-0.5 text-lg font-bold">{loading ? "…" : s.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* NEEDS ATTENTION */}
      {pendingTxn > 0 && (
        <button
          type="button"
          onClick={() => navigate(pendingLink)}
          className="group flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left transition hover:bg-amber-100/70 dark:border-amber-500/30 dark:bg-amber-500/10 dark:hover:bg-amber-500/15"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300">
            <IconAlertTriangle size={18} />
          </span>
          <span className="flex-1">
            <span className="block text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Needs attention</span>
            <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
              {pendingTxn} transaction{pendingTxn > 1 ? "s" : ""} pending
            </span>
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-amber-700 dark:text-amber-300">
            Review <IconArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </button>
      )}

      {/* KPI TILES */}
      <section className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${tiles.length > 2 ? "xl:grid-cols-3" : ""}`}>
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={118} radius="lg" />)
          : tiles.map((c) => {
              const meta = CARD_META[c.label] ?? {
                title: c.label.toLowerCase().replace(/\b\w/g, (x) => x.toUpperCase()),
                icon: IconReceipt2,
                tone: "slate" as Tone,
              };
              const money = c.prefix === "₹";
              const n = toNumber(c.value);
              const TileIcon = meta.icon;
              return (
                <div key={c.label} className={`${card} flex items-start gap-4`}>
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ${TONES[meta.tone]}`}>
                    <TileIcon size={24} stroke={1.75} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-medium text-slate-500 dark:text-slate-400">{meta.title}</span>
                    <Tooltip label={formatFull(n, money)} disabled={!money || n < 1000}>
                      <span className="mt-0.5 block truncate text-[26px] font-bold leading-tight text-slate-900 dark:text-white">
                        {money ? formatShort(n) : n.toLocaleString("en-IN")}
                      </span>
                    </Tooltip>
                    {meta.hint && <span className="mt-1 block text-xs text-slate-400">{meta.hint}</span>}
                  </span>
                </div>
              );
            })}
      </section>

      {/* TREND + SIDE */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className={`${card} xl:col-span-2`}>
          <h2 className={titleText}>Business trend</h2>
          <p className={mutedText}>Last 4 months</p>
          {trend.length === 0 ? (
            <div className="flex h-56 flex-col items-center justify-center gap-2 text-sm text-slate-400">
              <IconChartBar size={32} stroke={1.5} />
              {loading ? "Loading…" : "No data yet"}
            </div>
          ) : (
            <div className="mt-4 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rtTrendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="currentColor" className="text-slate-200 dark:text-white/10" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} width={64} tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(v) => formatShort(v)} />
                  <ChartTooltip
                    formatter={(v: any) => [formatFull(toNumber(v)), "Business"]}
                    contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13 }}
                    cursor={{ stroke: "#94a3b8", strokeDasharray: "4 4" }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#059669" strokeWidth={2} fill="url(#rtTrendFill)" dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Retailer: service mix · Network: top members */}
        <div className={card}>
          {isRetailer ? (
            <>
              <h2 className={titleText}>Service mix</h2>
              <p className={mutedText}>Share of business this month</p>
              {services.length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center gap-2 text-sm text-slate-400">
                  <IconChartBar size={32} stroke={1.5} />
                  {loading ? "Loading…" : "No transactions this month"}
                </div>
              ) : (
                <ul className="mt-5 flex flex-col gap-4">
                  {services.map((s) => (
                    <li key={s.name}>
                      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{s.name}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{s.value.toFixed(1)}%</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                        <div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{ width: `${Math.min(s.value, 100)}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <>
              <h2 className={`${titleText} flex items-center gap-2`}>
                <IconTrophy size={18} className="text-amber-500" /> {TOP_TITLE[role] ?? "Top performers"}
              </h2>
              <p className={mutedText}>By business · {selectedLabel}</p>
              {tableRows.length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center gap-2 text-sm text-slate-400">
                  <IconUsersGroup size={32} stroke={1.5} />
                  {loading ? "Loading…" : "No business in this period"}
                </div>
              ) : (
                <ul className="mt-3 divide-y divide-slate-100 dark:divide-white/10">
                  {tableRows.map((m, i) => (
                    <li key={m.id ?? i} className="flex items-center justify-between py-2.5 text-sm">
                      <span className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-200">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 dark:bg-white/10 dark:text-slate-300">{i + 1}</span>
                        {m.id}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">{m.totalBusiness}</span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </section>

      {/* RECENT + QUICK ACTIONS */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {isRetailer && (
          <div className={`${card} xl:col-span-2`}>
            <div className="flex items-center justify-between">
              <h2 className={`${titleText} flex items-center gap-2`}>
                <IconListDetails size={18} className="text-emerald-500" /> Recent transactions
              </h2>
              <button
                type="button"
                onClick={() => navigate("/reports/transaction-report")}
                className="flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              >
                View all <IconArrowRight size={14} />
              </button>
            </div>
            {tableRows.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-sm text-slate-400">
                {loading ? "Loading…" : "No transactions yet"}
              </div>
            ) : (
              <ul className="mt-3 divide-y divide-slate-100 dark:divide-white/10">
                {tableRows.map((t, i) => (
                  <li key={i} className="flex items-center gap-3 py-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300">
                      <IconReceipt2 size={20} stroke={1.75} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{t.product || "Transaction"}</span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400">
                        {t.dateTime}
                        {t.wallet ? ` · ${String(t.wallet).toLowerCase()}` : ""}
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="block text-sm font-bold text-slate-900 dark:text-white">{formatFull(toNumber(t.amount))}</span>
                      <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${statusClass(String(t.status ?? ""))}`}>
                        {t.status || "-"}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {quickActions.length > 0 && (
          <div className={`${card} ${isRetailer ? "" : "xl:col-span-3"}`}>
            <h2 className={`${titleText} flex items-center gap-2`}>
              <IconBolt size={18} className="text-emerald-500" /> Quick actions
            </h2>
            <div className={`mt-3 grid grid-cols-2 gap-2 ${isRetailer ? "" : "md:grid-cols-3 xl:grid-cols-6"}`}>
              {quickActions.map((a) => (
                <button
                  key={a.name}
                  type="button"
                  onClick={() => navigate(a.path)}
                  className="flex items-center justify-between gap-1 rounded-xl border border-slate-200 px-3 py-2.5 text-left text-[13px] font-semibold text-slate-700 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 dark:border-white/10 dark:text-slate-200 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300"
                >
                  {a.name}
                  <IconArrowRight size={14} className="shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default SmartDashboard;
