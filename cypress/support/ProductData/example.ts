import type { ProductConfig } from "../products";

// TODO: Replace this demo product with a real product configuration and real environment URLs.
// Keep product URLs and metadata here so specs only select the product they exercise.
const exampleProduct: ProductConfig = {
  name: "cypress-kitchen-sink",
  baseUrls: {
    dev: "https://example.cypress.io",
    qa: "https://example.cypress.io",
    stage: "https://example.cypress.io",
    prod: "https://example.cypress.io",
  },
};

export default exampleProduct;
