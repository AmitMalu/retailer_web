import { FilterSvgIcon } from "@/assets/svg";
import ButtonComponent from "@/components/Atoms/ButtonComponent";
import Loader from "@/components/Atoms/Loader";
import TextComponent from "@/components/Atoms/TextComponent";
import ColumsSelectionModal from "@/components/Molecules/ColumsSelectionModal";
import TableComponent from "@/components/Molecules/TableComponent";
import { RootState } from "@/Redux/Store";
import {
    //  fetch_raised_tickets,
    Fetch_Sub_User
} from "@/Services/api";
import { handleCustomError } from "@/Utils/handleCustomError";
import { decryptData } from "@/Utils/helper";
import { showErrorNotification } from "@/Utils/notifications";
import { UnstyledButton } from "@mantine/core";
import { Refresh } from "@mui/icons-material";
import { useTheme } from "@mui/system";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ViewSubUser = () => {

    const theme = useTheme();
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false);
    const [subUserList, setSubUserList] = useState([]);
    const [showColumnModal, setShowColumnModal] = useState(false);
    const [searchValues, setSearchValues] = useState<Record<string, string>>({});
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [isSeacrh, setIsSeacrh] = useState(false);

    const apiResponses = useSelector(
        (state: RootState) => state.apiResponse.responses
    );
    const loginData = apiResponses?.loginData
        ? decryptData(apiResponses?.loginData)
        : null;


    const tableColumns = [
        {
            key: "retailerUserId",
            label: "Retailer User ID",
            searchKey: "retailerUserId",
            sortable: false,
        },
        {
            key: "parentAccount",
            label: "Parent Account",
            searchKey: "parentAccount",
            sortable: false,
        },
        {
            key: "abbreviation",
            label: "Abbreviation",
            searchKey: "abbreviation",
            sortable: false,
        },
        {
            key: "name",
            label: "Name",
            searchKey: "name",
            sortable: false,
        },
        {
            key: "mobileNumber",
            label: "Mobile Number",
            searchKey: "mobileNumber",
            sortable: false,
            type: "number" as const,
        },
        {
            key: "username",
            label: "Username",
            searchKey: "username",
            sortable: false,
        },
        {
            key: "emailId",
            label: "Email ID",
            searchKey: "emailId",
            sortable: false,
        },
        {
            key: "emailVerified",
            label: "Email Verified",
            render: (row: boolean) => (
                <TextComponent
                    color={row ? "green" : "red"}
                    fontSize={12}
                    fontWeight={500}
                >
                    {row ? "Yes" : "No"}
                </TextComponent>
            ),
            searchKey: "emailVerified",
            type: "boolean" as const,
            sortable: false,
        },
        {
            key: "dob",
            label: "Date of Birth",
            render: (row: any) => (
                <TextComponent
                    color={theme.palette.background.default}
                    fontSize={12}
                    fontWeight={400}
                >
                    {row ? moment(row).format("YYYY-MM-DD") : "-"}
                </TextComponent>
            ),
            searchKey: "dob",
            type: "date" as const,
            sortable: false,
        },
        {
            key: "status",
            label: "Status",
            render: (row: boolean) => (
                <TextComponent
                    color={row ? "green" : "red"}
                    fontSize={12}
                    fontWeight={500}
                >
                    {row ? "Active" : "Inactive"}
                </TextComponent>
            ),
            searchKey: "status",
            sortable: false,
        },
        {
            key: "createdOn",
            label: "Created On",
            render: (row: any) => (
                <TextComponent
                    color={theme.palette.background.default}
                    fontSize={12}
                    fontWeight={400}
                >
                    {row ? moment(row).format("YYYY-MM-DD") : "-"}
                </TextComponent>
            ),
            searchKey: "createdOn",
            type: "date" as const,
            sortable: false,
        },
        {
            key: "createdBy",
            label: "Created By",
            searchKey: "createdBy",
            sortable: false,
        },
        {
            key: "lastEditedOn",
            label: "Edited On",
            render: (row: any) => (
                <TextComponent
                    color={theme.palette.background.default}
                    fontSize={12}
                    fontWeight={400}
                >
                    {row ? moment(row).format("YYYY-MM-DD") : "-"}
                </TextComponent>
            ),
            searchKey: "lastEditedOn",
            type: "date" as const,
            sortable: false,
        },
        {
            key: "editedBy",
            label: "Edited By",
            searchKey: "editedBy",
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
        tableColumns.find((col) => col.key === "action")!,
    ];

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

    const handleRefresh = () => {
        setIsSeacrh(false)
        setPage(1)
        setSize(10)
        setSearchValues({});
    }

    useEffect(() => {
        const fetchSubUsers = async () => {
            try {
                setIsLoading(true);
                const params = {
                    page: (page - 1).toString(), // API is 0-indexed
                    size: size.toString(),
                    ...searchValues,
                };
                const response = await Fetch_Sub_User(loginData?.hierarchyId, params);
                if (response.data.statusCode == 200) {
                    setSubUserList(response?.data?.data?.content || []);
                    setTotalRecords(response?.data?.data?.totalElements || 0)
                } else {
                    showErrorNotification(response?.data?.message);
                    setSubUserList([]);
                    setTotalRecords(0);
                }
            } catch (error) {
                console.error("Error fetching sub-users:", error);
                await handleCustomError(error);
                setSubUserList([]);
                setTotalRecords(0);
            } finally {
                setIsLoading(false);
            }
        };

        if (loginData?.hierarchyId) fetchSubUsers();
    }, [page, size, searchValues]);

    return (
        <>
            {isLoading && <Loader />}
            {/* Main Div */}
            <div className="flex w-full flex-col flex-wrap items-start justify-start">
                {/* Toolbar and Filter Section Contianer Div */}
                <div className="w-full items-start justify-start">
                    {/* Heading and Filter Section Container Div */}
                    <div className="flex items-center justify-between">
                        {/* Heading & Sub Heading */}
                        <div>
                            <TextComponent
                                fontSize={30}
                                fontWeight={500}
                                color={theme.palette.red.DEFAULT}
                            >
                                Sub Users
                            </TextComponent>
                            <TextComponent
                                fontSize={18}
                                fontWeight={500}
                                color={theme.palette.gray.DEFAULT}
                            >
                                Your most recent Created Sub Users
                            </TextComponent>
                        </div>

                        {/* Refresh, Filter and Create New Ticket button */}
                        <div className="flex items-center justify-between gap-3">

                            <div className="flex items-center justify-end gap-2">
                                {/* Refresh Button */}
                                <div className="flex w-max items-center mt-6 justify-center gap-2 rounded-lg border-2 border-midNeutral bg-whiteColor px-2 py-[6px] ">
                                    <UnstyledButton
                                        onClick={handleRefresh}
                                        className="flex w-max items-center justify-center gap-2 "
                                    >
                                        <Refresh color="error" />
                                    </UnstyledButton>
                                </div>

                                {/* Filter Button */}
                                <div className="flex w-max items-center mt-6 justify-center gap-2 rounded-lg border-2 border-midNeutral bg-whiteColor px-2 py-[6px] ">
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
                            </div>

                            {/* Create New Sub User Button */}
                            <div className="mt-5">
                                <ButtonComponent
                                    fullWidth
                                    title="Create New Sub User"
                                    variant="filled"
                                    onClick={() => {
                                        navigate("/settings/subUser")
                                    }}
                                    radius={4}
                                // width={150}
                                />
                            </div>

                        </div>

                    </div>

                    {/* Table */}
                    <div className="w-full mt-5">
                        {/* <div className="shadow-black-900/100 bg-transparent shadow-lg"> */}
                        <TableComponent
                            data={Array.isArray(subUserList) ? subUserList : [subUserList]}
                            columns={filteredTableColumns}
                            showSearch={isSeacrh}
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
                        {/* </div> */}
                        <ColumsSelectionModal
                            open={showColumnModal}
                            onClose={() => setShowColumnModal(false)}
                            data={tableColumns}
                            visibleColumns={visibleColumns}
                            setVisibleColumns={setVisibleColumns}
                        />
                    </div>

                </div>
            </div>
        </>
    )
}

export default ViewSubUser
