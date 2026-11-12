import Page from "../Common/Page";
import { ApiClient } from "../../support/api/ApiClient";
import { createProduct, createUser } from "../../support/factories";
import {
  getConfiguredProduct,
  type ProductConfig,
} from "../../support/products";

export default class FrameworkPage extends Page {
  public readonly url: string;
  public readonly elements = {};
  private readonly api = new ApiClient();

  public constructor(product: ProductConfig = getConfiguredProduct()) {
    super(product);
    this.url = `${this.baseUrl}/`;
  }

  public verifyProductFixture(): void {
    // TODO: Replace sample fixture assertions with the real domain fixture contract.
    cy.fixture("products/catalog").then((product) => {
      expect(product).to.deep.include({
        id: "product-001",
        name: "Example Product",
        available: true,
      });
    });
  }

  public verifyStandardUserFixtureIsSafe(): void {
    cy.fixture("users/standard").then((user) => {
      expect(user).to.include({
        displayName: "Test User",
        role: "standard",
      });
      expect(user.email).to.equal("");
      expect(user.password).to.equal("");
    });
  }

  public verifyProductsApiFixture(): void {
    // TODO: Replace the stubbed sample endpoint and response with the real API contract.
    cy.intercept("GET", "/api/products", {
      fixture: "api/products-success.json",
    }).as("getProducts");

    this.visit();
    cy.window()
      .then((window) => window.fetch("/api/products"))
      .then((response) => response.json())
      .then((body) => {
        expect(body.data).to.have.length(1);
        expect(body.data[0].id).to.equal("product-001");
      });
    cy.wait("@getProducts").its("response.statusCode").should("eq", 200);
  }

  public verifyProductsApiErrorFixture(): void {
    cy.intercept("GET", "/api/products", {
      statusCode: 503,
      fixture: "api/products-error.json",
    }).as("getProductsError");

    cy.request({
      method: "GET",
      url: "/api/products",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(503);
      expect(response.body.error.code).to.equal("PRODUCTS_UNAVAILABLE");
    });

    cy.wait("@getProductsError").its("response.statusCode").should("eq", 503);
  }

  public verifyApiClientAndCleanup(): void {
    // TODO: Replace the opt-in demo flow with real API setup and cleanup scenarios.
    if (String(Cypress.env("RUN_API_EXAMPLE")).toLowerCase() !== "true") {
      return;
    }

    cy.intercept("POST", "/api/products", {
      statusCode: 201,
      body: { id: "temporary-product-001" },
    }).as("createProduct");
    cy.intercept("DELETE", "/api/products/temporary-product-001", {
      statusCode: 204,
    }).as("deleteProduct");

    this.api
      .createProduct(createProduct({ name: "Temporary Product" }))
      .then((createdProduct) => {
        expect(createdProduct.id).to.equal("temporary-product-001");
      });
    cy.wait("@createProduct").its("response.statusCode").should("eq", 201);
  }

  public verifyProductFactory(): void {
    // TODO: Keep this only if factory behavior is infrastructure coverage; otherwise test real domain setup.
    const firstProduct = createProduct();
    const unavailableProduct = createProduct({
      price: 29.99,
      available: false,
    });

    expect(firstProduct.id).to.not.equal(unavailableProduct.id);
    expect(unavailableProduct.price).to.equal(29.99);
    expect(unavailableProduct.available).to.equal(false);
  }

  public verifyUserFactory(): void {
    // TODO: Replace sample user assertions with real identity and authorization requirements.
    const teacher = createUser({ role: "admin" });
    expect(teacher.email).to.match(/@example\.com$/);
    expect(teacher.password.length).to.be.greaterThan(0);
    expect(teacher.role).to.equal("admin");
  }
}
