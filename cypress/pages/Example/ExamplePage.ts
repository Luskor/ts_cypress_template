import Page from "../Common/Page";
import examplePageLocators from "./ExamplePage.locators";
import {
  getConfiguredProduct,
  type ProductConfig,
} from "../../support/products";

export default class ExamplePage extends Page {
  public readonly url: string;
  public readonly elements = examplePageLocators;

  public constructor(product: ProductConfig = getConfiguredProduct()) {
    super(product);
    this.url = `${this.baseUrl}/`;
  }

  public verifyLoaded(): void {
    // TODO: Assert the real page identity and critical content for this product.
    this.element("heading")
      .should("be.visible")
      .and("contain.text", "Kitchen Sink");
  }

  public verifyHeadingCount(expectedCount: number): void {
    this.verifyElementCount("heading", expectedCount);
  }

  public verifyHeadingIsInViewport(): void {
    this.element("heading").should("be.visibleInViewport");
  }

  public verifyConfiguration(): void {
    expect(this.product.name).to.not.equal("");
    expect(this.environment).to.be.oneOf(["dev", "qa", "stage", "prod"]);
    expect(this.baseUrl).to.match(/^https?:\/\//);
  }

  public openDocumentation(): void {
    // TODO: Replace this demo navigation action with a real product workflow.
    this.clickElement("documentationLink");
  }

  public verifyDocumentationLinksOpenInNewTabs(): void {
    this.element("documentationLink").each(($link) => {
      cy.wrap($link).should("have.attr", "target", "_blank");
    });
  }

  public getFirstDocumentationLinkTarget(): Cypress.Chainable<
    string | undefined
  > {
    return cy.storeValue(this.elements.documentationLink, 0, "target");
  }

  public openFirstDocumentationLinkInSameTab(): void {
    this.element("documentationLink").first().openInSameTab();
  }

  public verifyFirstDocumentationLinkOpensInSameTab(): void {
    this.element("documentationLink")
      .first()
      .should("have.attr", "target", "_self");
  }

  public verifyDocumentationLinkCanBeOpenedInSameTab(): void {
    this.getFirstDocumentationLinkTarget().should("equal", "_blank");
    this.openFirstDocumentationLinkInSameTab();
    this.verifyFirstDocumentationLinkOpensInSameTab();
  }

  public verifyStoreValueCommand(): void {
    cy.storeValue(this.elements.documentationLink, 0, "target").should(
      "equal",
      "_blank",
    );
  }

  public verifyOpenInSameTabCommand(): void {
    cy.get(this.elements.documentationLink)
      .first()
      .openInSameTab()
      .should("have.attr", "target", "_self");
  }

  public verifyStubWindowOpenSameTabCommand(): void {
    cy.stubWindowOpenSameTab();
    cy.get("@windowOpenSameTab").should("be.a", "function");
  }
}
