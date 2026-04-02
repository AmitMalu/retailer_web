import { useTheme } from "@mui/material";
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
            className="p-5 rounded-xl shadow-sm border"
            style={{ 
                borderColor: borderColor || theme.palette.divider,
                backgroundColor: theme.palette.background.paper 
            }}
        >
            <TextComponent fontSize={20} fontWeight={600} color={theme.palette.text.primary}>
                {prefix} {value} {suffix}
            </TextComponent>
            <div>
                <TextComponent fontSize={14} fontWeight={500} color={theme.palette.text.secondary}>
                    {label}
                </TextComponent>
            </div>
        </div>
    );
}
