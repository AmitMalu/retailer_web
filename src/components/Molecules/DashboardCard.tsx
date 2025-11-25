import { useTheme } from "@mui/system";
import TextComponent from "../Atoms/NewComponents/TextComponent";

type DashboardCardProps = {
    label: string;
    value: string | number;
    borderColor: string;
    prefix?: string;  // e.g. ₹ or $ (optional)
    suffix?: string;  // optional (e.g. "transactions")
};

export default function DashboardCard({
    label,
    value,
    borderColor,
    prefix = "",
    suffix = "",
}: DashboardCardProps) {
    const theme = useTheme()
    return (
        <div
            className="p-5 rounded-xl shadow-sm bg-white border"
            style={{ borderColor }}
        >
            <TextComponent fontSize={20} fontWeight={600} color={theme.palette.headLine}>
                {prefix} {value} {suffix}
            </TextComponent>
            <div>
                <TextComponent fontSize={14} fontWeight={500} color={theme.palette.gray.main}>
                    {label}
                </TextComponent>
            </div>
        </div>
    );
}
