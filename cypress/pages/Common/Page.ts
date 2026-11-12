import { getTestEnvironment, type ProductConfig } from "../../support/products";

export default abstract class Page {
  public abstract readonly url: string;
  public abstract readonly elements: Record<string, string>;
  public readonly product: ProductConfig;
  public readonly environment: ReturnType<typeof getTestEnvironment>;
  public readonly baseUrl: string;

  protected constructor(product: ProductConfig) {
    this.product = product;
    this.environment = getTestEnvironment();
    this.baseUrl = product.baseUrls[this.environment].replace(/\/$/, "");
  }

  public visit(url = this.url): void {
    cy.visit(url);
    cy.dismissKnownOverlays();
  }

  protected clickUntilNavigates(
    selector: string,
    targetUrl: string,
    index = 0,
    attempts = 0,
  ): void {
    if (attempts >= 10) {
      throw new Error(`Failed to navigate to "${targetUrl}" after 10 attempts`);
    }

    cy.get(selector).eq(index).click();
    cy.url().then((currentUrl) => {
      if (!currentUrl.includes(targetUrl)) {
        this.clickUntilNavigates(selector, targetUrl, index, attempts + 1);
      }
    });
  }

  protected element(name: string): Cypress.Chainable<JQuery<HTMLElement>> {
    const selector = this.elements[name];
    if (!selector) {
      throw new Error(`No locator registered for "${name}"`);
    }
    return cy.get(selector);
  }

  protected clickElement(name: string, index = 0): void {
    this.element(name).eq(index).click();
  }

  protected clearAndType(name: string, value: string, log = true): void {
    this.element(name).clear();
    this.element(name).type(value, { log });
  }

  protected verifyElementCount(name: string, expectedCount: number): void {
    this.element(name).should("have.length", expectedCount);
  }

  protected verifyUrlContains(path: string): void {
    cy.url().should("include", path);
  }
}
