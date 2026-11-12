// TODO: Align these environment names with the environments used by the real deployment pipeline.
export const testEnvironments = ["dev", "qa", "stage", "prod"] as const;

export type TestEnvironment = (typeof testEnvironments)[number];

export interface ProductConfig {
  name: string;
  baseUrls: Record<TestEnvironment, string>;
}

import { exampleProduct } from "./ProductData";

export const productRegistry = {
  // TODO: Register every supported product and remove the demo entry when real products are added.
  [exampleProduct.name]: exampleProduct,
} satisfies Record<string, ProductConfig>;

export type ProductTarget = keyof typeof productRegistry;

export function getProductTarget(value = Cypress.env("TARGET")): ProductTarget {
  const target = String(value || exampleProduct.name).toLowerCase();
  const matchingTarget = Object.keys(productRegistry).find(
    (productTarget) => productTarget.toLowerCase() === target,
  ) as ProductTarget | undefined;

  if (!matchingTarget) {
    throw new Error(
      `Unsupported TARGET "${target}". Expected one of: ${Object.keys(productRegistry).join(", ")}`,
    );
  }
  return matchingTarget;
}

export function getConfiguredProduct(): ProductConfig {
  return productRegistry[getProductTarget()];
}

export function getTestEnvironment(
  value = Cypress.env("TEST_ENV"),
): TestEnvironment {
  const environment = String(value || "dev").toLowerCase();
  if (!testEnvironments.includes(environment as TestEnvironment)) {
    throw new Error(
      `Unsupported TEST_ENV "${environment}". Expected one of: ${testEnvironments.join(", ")}`,
    );
  }
  return environment as TestEnvironment;
}
