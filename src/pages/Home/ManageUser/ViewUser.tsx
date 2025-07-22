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
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDebounce } from "@/Utils/debounce";
import { Child_Member_List } from "@/Services/api";
import { Menu, UnstyledButton } from "@mantine/core";
import {
  BlockedSvgIcon,
  ColsSvgIcon,
  ExportSvgIcon,
  FilterSvgIcon,
  NotBlockedSvgIcon,
  ViewUserSvgIcon,
} from "@/assets/svg";
import TableComponent from "@/components/Molecules/TableComponent";
import ColumsSelectionModal from "@/components/Molecules/ColumsSelectionModal";

const ViewUser = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 800);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [isSeacrh, setIsSeacrh] = useState(false);
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});

  const [isUserList, setIsUserList] = useState<ViewUserList[]>([]);
  const [currentPageData, setCurrentPageData] = useState<ViewUserList[]>([]);
  const isFetchingRef = useRef<boolean>(false);

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );

  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses?.loginData)
    : null;

  useEffect(() => {
    if (!isFetchingRef.current) {
      isFetchingRef.current = true;
      FetchUserList();
    }
  }, []);

  const FetchUserList = async () => {
    try {
      const response = await Child_Member_List({ id: loginData?.hierarchyId });
      if (response?.status === 200) {
        setIsUserList(response?.data?.data?.content);
      } else {
        showErrorNotification(response?.data?.message);
      }
    } catch (error) {
      await handleCustomError(error);
    }
  };

  const tableColumns = [
    {
      key: "parentAccount",
      label: "Network",
      searchKey: "parentAccount",
      sortable: false,
    },
    // {
    //   key: "userId",
    //   label: "User ID",
    //   searchKey: "userId",
    //   sortable: false,
    // },
    {
      key: "name",
      label: "User Name",
      render: (row: ViewUserList) => (
        <div className="flex items-center justify-center">
          <TextComponent
            color={theme.palette.red.DEFAULT}
            fontSize={12}
            fontWeight={400}
          >
            {row.toString() || "-"}
          </TextComponent>
        </div>
      ),
      searchKey: "name",
      sortable: false,
    },
    {
      key: "mobileNumber",
      label: "Mobile Number",
      searchKey: "mobileNumber",
      sortable: false,
    },
    {
      key: "emailId",
      label: "Email ID",
      searchKey: "emailId",
      sortable: false,
    },
    {
      key: "status",
      label: "Status",
      render: (row: ViewUserList) => (
        <div className="flex items-center bg-GreenColor-light px-1 py-1 rounded text-center justify-center">
          <TextComponent
            color={theme.palette.greenColor.DEFAULT}
            fontSize={12}
            fontWeight={400}
          >
            {row.toString() || "-"}
          </TextComponent>
        </div>
      ),
      searchKey: "status",
      sortable: false,
    },
    {
      key: "isBlocked",
      label: "Is Blocked",
      render: (row: ViewUserList) => (
        <div className="flex items-center justify-center">
          <TextComponent
            color={theme.palette.red.DEFAULT}
            fontSize={12}
            fontWeight={400}
          >
            {row.isBlocked === true ? (
              <BlockedSvgIcon color={theme.palette.greenColor.DEFAULT} />
            ) : (
              <NotBlockedSvgIcon color={theme.palette.red.DEFAULT} />
            )}
          </TextComponent>
        </div>
      ),
      searchKey: "isBlocked",
      sortable: false,
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
    tableColumns.find((col) => col.key === "action")!, // Always include action at the end
  ];

  const filteredData = isUserList
    .filter((item: any) => {
      const matchesSearch = debouncedSearchValue
        ? Object.entries(item).some(([key, value]) => {
            const stringValue = value?.toString().toLowerCase() || "";
            const matches =
              key !== "action" &&
              stringValue.includes(debouncedSearchValue.toLowerCase());
            return matches;
          })
        : true;

      return matchesSearch;
    })
    .map((item: any, index: number) => ({
      ...item,
      _rowKey: `${item.userId || ""}__${index}`,
    }));

  const handleExport = (exportType: "all" | "currentPage") => {
    const dataToExport = exportType === "all" ? filteredData : currentPageData;

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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchWithValues = (columnKey: string, value: string) => {
    try {
      const column = tableColumns.find((col) => col.key === columnKey);
      if (!column) return;

      const searchKey = column.searchKey || column.key;
      const newSearchValues = { ...searchValues };

      if (value) {
        newSearchValues[searchKey] = value;
      } else {
        delete newSearchValues[searchKey];
      }

      setSearchValues(newSearchValues);

      if (loginData?.hierarchyId) {
        const bodyRequest = {
          id: loginData?.hierarchyId,
          ...Object.fromEntries(
            Object.entries(newSearchValues).map(([key, value]) => [
              key === columnKey ? searchKey : key,
              value,
            ])
          ),
        };

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          Child_Member_List(bodyRequest)
            .then((response) => {
              if (response?.status === 200) {
                setIsUserList(response?.data?.data?.content);
              } else {
                showErrorNotification(response?.data?.message);
                setIsUserList([]);
              }
            })
            .catch((error) => {
              handleCustomError(error);
              setIsUserList([]);
            })
            .finally(() => {
              setIsLoading(false);
            });
        }, 900);
      }
    } catch (error) {
      handleCustomError(error);
    }
  };

  return (
    <div className="">
      <div className="mb-4">
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex w-[15%] items-center rounded-lg border bg-red-light p-2 shadow-lg">
            <ViewUserSvgIcon color={theme.palette.red.DEFAULT} />
            <TextComponent
              color={theme.palette.red.DEFAULT}
              fontSize={14}
              fontWeight={600}
            >
              View User
            </TextComponent>
          </div>
          <div className="flex w-full items-center justify-end gap-2">
            <div className="flex w-max items-center justify-center gap-2 rounded-lg border-2 border-midNeutral bg-whiteColor px-2 py-[6px] ">
              <UnstyledButton
                onClick={() => setIsSeacrh(!isSeacrh)}
                className="flex w-max items-center justify-center gap-2 "
              >
                <FilterSvgIcon color={theme.palette.red.DEFAULT} />
                <TextComponent
                  fontSize={16}
                  fontWeight={400}
                  color={theme.palette.red.DEFAULT}
                  align="center"
                >
                  Filter
                </TextComponent>
              </UnstyledButton>
            </div>

            <div
              onClick={() => setShowColumnModal(true)}
              className="flex w-max items-center justify-center gap-2 rounded-lg border-2 border-midNeutral bg-whiteColor px-2 py-[6px]"
            >
              <ColsSvgIcon color={theme.palette.red.DEFAULT} />
              <TextComponent
                color={theme.palette.red.DEFAULT}
                fontSize={16}
                fontWeight={400}
              >
                Cols
              </TextComponent>
            </div>
            <div className="flex w-[15%] items-center justify-center rounded-lg border bg-red-light p-2 shadow-lg">
              <Menu shadow="md" width={140}>
                <Menu.Target>
                  <div className="flex items-center gap-2">
                    <ExportSvgIcon color={theme.palette.red.DEFAULT} />
                    <TextComponent
                      color={theme.palette.red.DEFAULT}
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
          data={filteredData}
          columns={filteredTableColumns}
          showSearch={isSeacrh}
          onCurrentPageData={setCurrentPageData}
          onSearch={(columnKey, value) =>
            handleSearchWithValues(columnKey, value)
          }
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
