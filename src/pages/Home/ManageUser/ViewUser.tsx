import { ViewUserList } from "@/Common/interface";
import TextComponent from "@/components/Atoms/TextComponent";
import { RootState } from "@/Redux/Store";
import { handleCustomError } from "@/Utils/handleCustomError";
import { decryptData } from "@/Utils/helper";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/Utils/notifications";
import { useTheme } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Child_Member_List } from "@/Services/api";
import { Menu, UnstyledButton } from "@mantine/core";
import {
  ColsSvgIcon,
  ExportSvgIcon,
  FilterSvgIcon,
  ViewUserSvgIcon,
} from "@/assets/svg";
import TableComponent from "@/components/Molecules/TableComponent";
import ColumsSelectionModal from "@/components/Molecules/ColumsSelectionModal";
import moment from "moment";
import Loader from "@/components/Atoms/Loader";

const ViewUser = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [isSeacrh, setIsSeacrh] = useState(false);
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const [isUserList, setIsUserList] = useState<ViewUserList[]>([]);
  const [currentPageData, setCurrentPageData] = useState<ViewUserList[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  // const isFetchingRef = useRef<boolean>(false);

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  const tableColumns = [
    {
      key: "network",
      label: "Network",
      render: (_value: any, _index: number, row: ViewUserList) => (
        <div className="flex items-center justify-center">
          <TextComponent
            color={theme.palette.primary.main}
            fontSize={12}
            fontWeight={400}
          >
            {row?.network?.toString() || "-"}
          </TextComponent>
        </div>
      ),
      searchKey: "network",
      sortable: false,
    },
    {
      key: "createdOn",
      label: "Created On",
      render: (_value: any, _index: number, row: ViewUserList) => (
        <div className="flex items-center justify-center">
          <TextComponent
            color={theme.palette.primary.main}
            fontSize={12}
            fontWeight={400}
          >
            {moment(row?.createdOn).format("YYYY-MM-DD") || "-"}
          </TextComponent>
        </div>
      ),
      searchKey: "createdOn",
      type: "date" as const,
      sortable: false,
    },
    {
      key: "userId",
      label: "User ID",
      searchKey: "userId",
      sortable: false,
      // type: "text" as const

    },
    {
      key: "name",
      label: "User Name",
      render: (_value: any, _index: number, row: ViewUserList) => (
        <div className="flex items-center justify-center">
          <TextComponent
            color={theme.palette.primary.main}
            fontSize={12}
            fontWeight={400}
          >
            {row.name.toString() || "-"}
          </TextComponent>
        </div>
      ),
      searchKey: "name",
      sortable: false,
      // type: "text" as const

    },
    {
      key: "mobileNumber",
      label: "Mobile Number",
      searchKey: "mobileNumber",
      sortable: false,
      type: "number" as const

    },
    {
      key: "emailId",
      label: "Email ID",
      searchKey: "emailId",
      sortable: false,
      // type: "text" as const

    },
    {
      key: "status",
      label: "Status",
      render: (_value: any, _index: number, row: ViewUserList) => (
        <div className="flex items-center justify-self-center w-max bg-GreenColor-light px-1 py-1 rounded text-center justify-center">
          <TextComponent
            color={theme.palette.primary.main}
            fontSize={12}
            fontWeight={400}
          >
            {row?.status?.toString() || "-"}
          </TextComponent>
        </div>
      ),
      searchKey: "status",
      sortable: false,
      type: "boolean" as const,
      options: [
        { label: "APPROVED", value: "APPROVED" },
        { label: "PENDING", value: "PENDING" },
        { label: "REJECTED", value: "REJECTED" },
      ]
    },
    {
      key: "remarks",
      label: "Remark",
      searchKey: "remarks",
      sortable: false,
    },
    {
      key: "isBlocked",
      label: "Is Blocked",
      render: (_value: any, _index: number, row: ViewUserList) => (
        <div className="flex items-center justify-center">
          <TextComponent
            color={theme.palette.primary.main}
            fontSize={12}
            fontWeight={400}
          >
            {String(row.isBlocked)}
            {/* {row?.isBlocked === true ? (
              <NotBlockedSvgIcon color={theme.palette.primary.main} />
            ) : (
              <BlockedSvgIcon color={theme.palette.greenColor.DEFAULT} />
            )} */}
          </TextComponent>
        </div>
      ),
      searchKey: "isBlocked",
      sortable: false,
      type: "boolean" as const

    },
  ];

  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    tableColumns.filter((col) => col.key !== "action").map((col) => col.key)
  );

  // Only include visible columns and always add the action column at the end
  const filteredTableColumns = [
    ...tableColumns.filter(
      (col) => visibleColumns.includes(col.key) && col.key !== "action"
    ),
    tableColumns.find((col) => col.key === "action")!,
  ];

  useEffect(() => {
    if (loginData?.hierarchyId) {
      FetchUserList(page, size, searchValues);
    }
  }, [page, size, searchValues]);

  const FetchUserList = async (pageNum = 1, pageSize = size, filters = {}) => {
    try {
      setIsLoading(true);
      const params = {
        page: (pageNum - 1).toString(), // API is 0-indexed
        size: pageSize.toString(),
        ...filters,
      };
      const response = await Child_Member_List(loginData?.hierarchyId, params);
      if (
        response?.data?.statusCode === 200 ||
        response?.data?.statusCode === 201
      ) {
        setIsUserList(response?.data?.data?.content);
        setTotalRecords(response?.data?.data?.totalElements || 0);
      } else {
        showErrorNotification(response?.data?.message);
        setIsUserList([]);
        setTotalRecords(0);
      }
    } catch (error) {
      await handleCustomError(error);
      setIsUserList([]);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (exportType: "all" | "currentPage") => {
    const dataToExport = exportType === "all" ? isUserList : currentPageData;

    if (dataToExport.length === 0) {
      showErrorNotification(
        `No ${exportType === "all" ? "all" : "current page"} data available to export`
      );
      return;
    }
    const columnsToExport = tableColumns
      .filter((col) => col.key !== "action" && visibleColumns.includes(col.key))
      .map((col) => col.key);

    const csvHeader = columnsToExport.map((colKey) => {
      return tableColumns.find((col) => col.key === colKey)?.label || colKey;
    });

    const csvRows = dataToExport.map((row: any) =>
      columnsToExport
        .map((colKey) => {
          const value = row[colKey as keyof ViewUserList];
          return `"${value?.toString().replace(/"/g, '""') || ""}"`; // Escape quotes
        })
        .join(",")
    );
    const csvContent = [csvHeader.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      exportType === "all"
        ? "All_Users_List.csv"
        : "Current_Page_Users_List.csv";
    a.click();
    URL.revokeObjectURL(url);

    showSuccessNotification(
      `Exported ${exportType === "all" ? "all" : "current page"} data successfully`
    );
  };
  // const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchWithValues = (columnKey: string, value: string) => {
    const newSearchValues = { ...searchValues };

    if (value) {
      newSearchValues[columnKey] = value;
    } else {
      delete newSearchValues[columnKey];
    }

    setSearchValues(newSearchValues);
    setPage(1); // ✅ Reset to first page when search changes
  };

  return (
    <div className="">
      {isLoading && <Loader />}
      <div className="mb-4">
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex w-full items-center justify-start gap-2">
            <div className="flex w-max items-center justify-center rounded-lg border gap-2 bg-primary-light p-2 shadow-lg">
              <ViewUserSvgIcon color={theme.palette.primary.main} />
              <TextComponent
                color={theme.palette.primary.main}
                fontSize={14}
                fontWeight={600}
              >
                Members
              </TextComponent>
            </div>
          </div>
          <div className="flex w-full items-center justify-end gap-2">
            <div className="flex w-max items-center justify-center gap-2 rounded-lg border-2 border-divider bg-background-paper px-2 py-[6px] ">
              <UnstyledButton
                onClick={() => setIsSeacrh(!isSeacrh)}
                className="flex w-max items-center justify-center gap-2 "
              >
                <FilterSvgIcon color={theme.palette.primary.main} />
                <TextComponent
                  fontSize={16}
                  fontWeight={400}
                  color={theme.palette.primary.main}
                  align="center"
                >
                  Filter
                </TextComponent>
              </UnstyledButton>
            </div>

            <div
              onClick={() => setShowColumnModal(true)}
              className="flex w-max items-center justify-center gap-2 rounded-lg border-2 border-midNeutral bg-background-paper px-2 py-[6px]"
            >
              <ColsSvgIcon color={theme.palette.primary.main} />
              <TextComponent
                color={theme.palette.primary.main}
                fontSize={16}
                fontWeight={400}
              >
                Cols
              </TextComponent>
            </div>
            <div className="flex w-max items-center justify-center rounded-lg border bg-primary-light p-2 shadow-lg">
              <Menu shadow="md" width={140}>
                <Menu.Target>
                  <div className="flex items-center gap-2">
                    <ExportSvgIcon color={theme.palette.primary.main} />
                    <TextComponent
                      color={theme.palette.primary.main}
                      fontSize={14}
                      fontWeight={600}
                    >
                      Export
                    </TextComponent>
                  </div>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item onClick={() => handleExport("all")}>
                    All Data
                  </Menu.Item>
                  <Menu.Item onClick={() => handleExport("currentPage")}>
                    Current Page Data
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          </div>
        </div>
      </div>
      <div className="shadow-black-900/100 bg-transparent shadow-lg">
        <TableComponent
          data={Array.isArray(isUserList) ? isUserList : [isUserList]}
          columns={filteredTableColumns}
          showSearch={isSeacrh}
          onCurrentPageData={setCurrentPageData}
          onSearch={(columnKey, value) =>
            handleSearchWithValues(columnKey, value)
          }
          page={page}
          size={size}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setSize(newSize);
            setPage(1); // reset to first page when size changes
          }}
          serverSide={true}
          totalRecords={totalRecords}
        />
      </div>
      <ColumsSelectionModal
        open={showColumnModal}
        onClose={() => setShowColumnModal(false)}
        data={tableColumns}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
      />
    </div>
  );
};

export default ViewUser;
