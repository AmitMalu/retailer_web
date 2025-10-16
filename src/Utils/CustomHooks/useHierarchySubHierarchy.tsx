import { Fetch_Hierarchy_List_Dropdown, Fetch_Hierarchy_Type_Dropdown } from "@/Services/api";
import { useCallback, useEffect, useState } from "react";
import { showErrorNotification } from "../notifications";
import { handleCustomError } from "../handleCustomError";

interface UseHierarchySubHierarchyProps {
    selectedHierarchyCode?: string | null;
    onSubHierarchyReset?: () => void;
}

interface SubHierarchyType {
    id: string;
    displayName: string;
    name: string;
    mobileno: string;
    prepaidAmount: number;
    postpaidAmount: number;
    email: string;
}

export const useHierarchySubHierarchy = ({
    selectedHierarchyCode,
    onSubHierarchyReset,
}: UseHierarchySubHierarchyProps) => {
    const [hierarchyList, setHierarchyList] = useState([]);
    const [loadingHierarchyList, setLoadingHierarchyList] = useState(false);
    const [hierarchyError, setHierarchyError] = useState<string | null>(null);

    const [subHierarchyList, setSubHierarchyList] = useState<SubHierarchyType[]>([]);
    const [loadingSubHierarchyList, setLoadingSubHierarchyList] = useState(false);
    const [subHierarchyError, setSubHierarchyError] = useState<string | null>(null);
    const [subHierarchyKey, setSubHierarchyKey] = useState(Date.now());


    const fetchHierarchyList = useCallback(async () => {
        setLoadingHierarchyList(true);
        setHierarchyError(null)
        try {
            const result = await Fetch_Hierarchy_Type_Dropdown() as any;

            const filteredData = (result?.data?.data || [])?.map((item: any) => ({
                label: item.name,
                value: String(item.code),     // dropdown binds to operatorId
            }));

            setHierarchyList(filteredData);
        } catch (err: any) {
            console.error("Failed to fetch Hierarchy list", err);
            setHierarchyError(err)
            setHierarchyList([]);
            handleCustomError(err)
        } finally {
            setLoadingHierarchyList(false);
        }
    }, []);

    // Always fetch hierarchy list when mounted
    useEffect(() => {
        fetchHierarchyList();
    }, []);

    // Fetch Sub Hierarchy list (only if HierarchyCode is given)
    useEffect(() => {
        if (!selectedHierarchyCode) return;

        // Reset sub-hierarchy state immediately on parent change
        if (onSubHierarchyReset) onSubHierarchyReset();

        const fetchSubHierarchyList = async () => {
            setLoadingSubHierarchyList(true);
            setSubHierarchyError(null)
            try {
                const result = await Fetch_Hierarchy_List_Dropdown(selectedHierarchyCode) as any

                setSubHierarchyList(result?.data?.data);
                setSubHierarchyKey(Date.now());
            } catch (err: any) {
                console.error("Failed to fetch sub-Hierarchy list", err);
                setSubHierarchyError(err)
                setSubHierarchyList([]);
                if (onSubHierarchyReset) onSubHierarchyReset?.();
                handleCustomError(err)
            } finally {
                setLoadingSubHierarchyList(false);
            }
        };

        fetchSubHierarchyList();
    }, [selectedHierarchyCode]);

    return {
        hierarchyList,
        loadingHierarchyList,
        subHierarchyList,
        loadingSubHierarchyList,
        hierarchySubHierarchyError: hierarchyError || subHierarchyError,
        subHierarchyKey,
        refetchHierarchy: fetchHierarchyList,
    };
};
