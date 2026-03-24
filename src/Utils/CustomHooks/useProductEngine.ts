import { useMemo } from "react";
import { validateProduct, validateSubProduct } from "../validators";

export const useProductEngine = (loginData: any) => {
  // Product Map
  const productStatusMap = useMemo(() => {
    const map: Record<string, any> = {};

    loginData?.products?.forEach((p: any) => {
      map[p.productName.toUpperCase()] = {
        ...p,
        subProducts: p.subProducts || [],
      };
    });

    return map;
  }, [loginData]);

  // Get Product
  const getProduct = (productKey: string) => {
    const normalizedKey = productKey.toUpperCase();
    const product = productStatusMap[normalizedKey];
    const error = validateProduct(product);

    if (error) return { error };

    return { product };
  };

  // Get SubProduct
  const getSubProduct = (productKey: string, subProductName: string) => {
    const { product, error } = getProduct(productKey);

    if (error) return { error };

    const subProduct = product.subProducts.find(
      (sp: any) =>
        sp.subProductName.toUpperCase() === subProductName.trim().toUpperCase(),
    );

    const subError = validateSubProduct(subProduct);

    if (subError) return { error: subError };

    return { product, subProduct };
  };

  return {
    productStatusMap,
    getProduct,
    getSubProduct,
  };
};
