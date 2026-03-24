export const validateProduct = (product: any) => {
  if (!product) return "No Product Found";

  if (product.blocked) return "This product is blocked.";

  if (!product.active) {
    return "This product is currently inactive. Please contact support.";
  }

  if (!product.isVisible) return "This Product is not available.";

  if (!product.subProducts || product.subProducts.length === 0) {
    return "No Scheme Found For You for this Service.";
  }

  return null;
};

export const validateSubProduct = (subProduct: any) => {
  if (!subProduct) {
    return "No Scheme Found For You for this Service.";
  }

  if (subProduct.blocked) return "This service is blocked.";

  if (!subProduct.active) {
    return "This service is currently inactive. Please contact support.";
  }

  if (!subProduct.isVisible) return "This service is not available.";

  return null;
};