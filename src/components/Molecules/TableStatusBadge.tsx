const statusColorMap: Record<string, string> = {
    SUCCESS: "bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30",
    PENDING: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30",
    FAILED: "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30",
    REJECTED: "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30",
};

const TableStatusBadge = ({ status }: { status: string }) => {
    const classes = statusColorMap[status.toUpperCase()] || "bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-500/30";

    return (
        <span
            className={`px-2 py-[2px] rounded-full text-xs font-medium inline-block whitespace-nowrap ${classes}`}
        >
            {status}
        </span>
    );
};

export default TableStatusBadge;
