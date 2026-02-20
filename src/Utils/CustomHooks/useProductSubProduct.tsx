import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { handleCustomError } from "../handleCustomError";
import { Product_Dropdown, Sub_Product_Dropdown, Sub_Product_Settlement_Dropdown } from "@/Services/api";

interface UseProductSubProductProps {
  selectedProductId?: string | null;
  selectedSubProductId?: string | null;
  onSubProductReset?: () => void;
  isSettlement?: boolean;
}

export const useProductSubProduct = ({
  selectedProductId,
  selectedSubProductId,
  onSubProductReset,
  isSettlement = false,
}: UseProductSubProductProps) => {
  const dispatch = useDispatch();

  const [productDropdownData, setProductDropdownData] = useState([]);
  const [subProductDropdownData, setSubProductDropdownData] = useState([]);
  const [loadingProductList, setLoadingProductList] = useState(false);
  const [loadingSubProductList, setLoadingSubProductList] = useState(false);
  const [subProductKey, setSubProductKey] = useState(Date.now());

  const [productError, setProductError] = useState<string | null>(null);
  const [subProductError, setSubProductError] = useState<string | null>(null);

  const fetchProductList = useCallback(async () => {
    setLoadingProductList(true);
    setProductError(null);

    try {
      const result = await Product_Dropdown() as any;

      const filteredData = (result?.data?.data || [])?.map((item: any) => ({
        label: item.productName,
        value: String(item.id),
      }));

      setProductDropdownData(filteredData);
    } catch (err: any) {
      console.error("Failed to fetch product list", err);
      handleCustomError(err)
      setProductError(err);
      setProductDropdownData([]);
    } finally {
      setLoadingProductList(false);
    }
  }, [dispatch]);

  // Fetch product list (always)
  useEffect(() => {
    fetchProductList();
  }, [fetchProductList]);

  // Fetch sub-product list (only if productId is given)
  useEffect(() => {
    if (!selectedProductId) return;

    const fetchSubProductList = async () => {
      setLoadingSubProductList(true);
      setSubProductError(null);

      try {

        const result = isSettlement
          ? await Sub_Product_Settlement_Dropdown(selectedProductId) as any
          : await Sub_Product_Dropdown(selectedProductId) as any;

        const filteredData = (result?.data?.data || [])?.map((item: any) => ({
          label: item.subProduct_name,
          value: String(item.id),
        }));

        setSubProductDropdownData(filteredData);
        setSubProductKey(Date.now());
        if (
          selectedSubProductId &&
          !filteredData.some((item: any) => item.value === String(selectedSubProductId))
        ) {
          if (onSubProductReset) onSubProductReset();
        }

      } catch (err: any) {
        console.error("Failed to fetch sub-product list", err);
        setSubProductError(err);

        handleCustomError(err)
        setSubProductDropdownData([]);
        if (onSubProductReset) onSubProductReset();
      } finally {
        setLoadingSubProductList(false);
      }
    };

    fetchSubProductList();
  }, [selectedProductId, dispatch, productDropdownData]);

  return {
    productDropdownData,
    loadingProductList,
    subProductDropdownData,
    loadingSubProductList,
    subProductKey,
    productSubproductError: productError || subProductError, // <- combined error
    refetchProducts: fetchProductList
  };
};
