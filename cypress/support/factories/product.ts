export interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  available: boolean;
}

let productSequence = 0;

export function createProduct(
  overrides: Partial<ProductData> = {},
): ProductData {
  // TODO: Match generated values and validation rules to the real product domain.
  productSequence += 1;

  return {
    id: `product-generated-${productSequence}`,
    name: `Generated Product ${productSequence}`,
    description: "A generated product used by an automated test.",
    price: 19.99,
    currency: "USD",
    available: true,
    ...overrides,
  };
}
