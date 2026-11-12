import { getProductTarget, type ProductTarget } from "./products";

export function isProductSupported(
  products: readonly ProductTarget[],
): boolean {
  return products.includes(getProductTarget());
}
