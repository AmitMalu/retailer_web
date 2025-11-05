const statusColorMap: Record<string, string> = {
    PENDING: "bg-yellow-200 text-yellow-900",
    SUCCESS: "bg-green-200 text-green-900",
    FAILED: "bg-red-200 text-red-900",
    REJECTED: "bg-red-200 text-red-900",
};

const TableStatusBadge = ({ status }: { status: string }) => {
    const classes = statusColorMap[status.toUpperCase()] || "bg-gray-200 text-gray-900";

    return (
        <span
            className={`px-2 py-[2px] rounded-full text-xs font-medium inline-block whitespace-nowrap ${classes}`}
        >
            {status}
        </span>
    );
};

export default TableStatusBadge;
