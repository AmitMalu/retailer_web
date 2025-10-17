import { Tabs, TabsProps } from "@mantine/core";
import { ReactNode } from "react";

interface TabItem {
    value: string;
    label: ReactNode;
    leftSection?: ReactNode;
    rightSection?: ReactNode;
    color?: string; // overrides color per tab
}

interface CustomTabProps extends Omit<TabsProps, "children"> {
    tabList: TabItem[];
    value: string; // controlled from parent
    onChange: (value: string | null) => void;
    grow?: boolean;
    justify?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
    borderColor?: string; // optional border between tabs
    listClassName?: string;
    tabClassName?: string;
    activeBg?: string;
    activeColor?: string;
    inactiveBg?: string;
    inactiveColor?: string;
}

export function CustomTab({
    tabList,
    value,
    onChange,
    defaultValue,
    variant = "default",
    color = "blue",
    radius = "sm",
    orientation = "horizontal",
    grow = false,
    justify = "flex-start",
    borderColor = "#DCDCDC",
    listClassName = "",
    tabClassName = "",
    activeBg = "#ffffff",
    activeColor = "#CA4343",
    inactiveBg = "",
    inactiveColor = "",
    ...rest
}: CustomTabProps) {
    return (
        <Tabs
            value={value}
            onChange={onChange}
            defaultValue={defaultValue}
            variant={variant}
            color={color}
            radius={radius}
            orientation={orientation}
            classNames={{
                tab: `${tabClassName} transition-all px-4 py-2 font-medium text-sm`,
            }}
            {...rest}
        >
            <Tabs.List grow={grow} justify={justify} className={listClassName}>
                {tabList.map((tab, index) => (
                    <Tabs.Tab
                        key={tab.value}
                        value={tab.value}
                        color={tab.color || color}
                        leftSection={tab.leftSection}
                        rightSection={tab.rightSection}
                        style={{
                            ...(index !== tabList.length - 1 && { borderRight: `1px solid ${borderColor}` }),
                            backgroundColor: value === tab.value ? activeBg : inactiveBg,
                            color: value === tab.value ? activeColor : inactiveColor,
                        }}
                        className={tabClassName}
                    >
                        {tab.label}
                    </Tabs.Tab>
                ))}
            </Tabs.List>
            {/* No Panels here — handled by parent */}
        </Tabs>
    );
}
