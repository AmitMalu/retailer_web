import moment from "moment";
import { DatesRangeValue } from "@mantine/dates";

export type DateRangeLabel =
  | "Today"
  | "Yesterday"
  | "Last 7 Days"
  | "This Month"
  | "Last Month"
  | "Custom";

// ⛑️ Force safe time (prevents timezone rollback)
const safeDate = (m: moment.Moment) =>
  m.clone().hour(12).minute(0).second(0).millisecond(0);

/**
 * Convert shortcut label → DatesRangeValue
 */
export const getRangeFromLabel = (
  label: DateRangeLabel
): DatesRangeValue => {
  const today = safeDate(moment());
  const yesterday = safeDate(moment().subtract(1, "day"));

  const last7From = safeDate(moment().subtract(6, "day"));

  const thisMonthFrom = safeDate(moment().startOf("month"));

  const lastMonthFrom = safeDate(
    moment().subtract(1, "month").startOf("month")
  );
  const lastMonthTo = safeDate(
    moment().subtract(1, "month").endOf("month")
  );

  switch (label) {
    case "Today":
      return [today.toDate(), today.toDate()];

    case "Yesterday":
      return [yesterday.toDate(), yesterday.toDate()];

    case "Last 7 Days":
      return [last7From.toDate(), today.toDate()];

    case "This Month":
      return [thisMonthFrom.toDate(), today.toDate()];

    case "Last Month":
      return [lastMonthFrom.toDate(), lastMonthTo.toDate()];

    default:
      return [null, null];
  }
};

/**
 * Detect which shortcut matches a selected range
 */
export const getLabelFromRange = (
  range: DatesRangeValue
): DateRangeLabel => {
  if (!range || !range[0] || !range[1]) return "Custom";

  const from = moment(range[0]).startOf("day");
  const to = moment(range[1]).startOf("day");

  const today = moment().startOf("day");
  const yesterday = moment().subtract(1, "day").startOf("day");

  const last7From = moment().subtract(6, "day").startOf("day");

  const thisMonthFrom = moment().startOf("month");

  const lastMonthFrom = moment().subtract(1, "month").startOf("month");
  const lastMonthTo = moment().subtract(1, "month").endOf("month").startOf("day");

  if (from.isSame(today) && to.isSame(today)) return "Today";
  if (from.isSame(yesterday) && to.isSame(yesterday)) return "Yesterday";
  if (from.isSame(last7From) && to.isSame(today)) return "Last 7 Days";
  if (from.isSame(thisMonthFrom) && to.isSame(today)) return "This Month";
  if (from.isSame(lastMonthFrom) && to.isSame(lastMonthTo))
    return "Last Month";

  return "Custom";
};
