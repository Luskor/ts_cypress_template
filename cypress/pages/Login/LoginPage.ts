import Page from "../Common/Page";
import loginPageLocators from "./LoginPage.locators";
import {
  getLoginCredentials,
  type LoginCredentials,
  type LoginOptions,
  type UserRole,
} from "../../support/auth";
import {
  getConfiguredProduct,
  type ProductConfig,
} from "../../support/products";

export default class LoginPage extends Page {
  public readonly url: string;
  public readonly elements = loginPageLocators;

  public constructor(
    product: ProductConfig = getConfiguredProduct(),
    // TODO: Replace the demo route with the real login route or authentication entry point.
    loginPath = "/login",
  ) {
    super(product);
    this.url = `${this.baseUrl}${loginPath}`;
  }

  public login(credentials: LoginCredentials = getLoginCredentials()): void {
    this.clearAndType("email", credentials.email);
    this.clearAndType("password", credentials.password, false);
    this.clickElement("submit");
  }

  public loginWithSession(
    credentials: LoginCredentials = getLoginCredentials(),
    successUrl?: string,
  ): void {
    cy.session(
      [this.product.name, this.environment, credentials.email],
      () => {
        this.visit();
        this.login(credentials);
      },
      {
        validate: () => {
          if (successUrl) {
            this.verifyUrlContains(successUrl);
          }
        },
      },
    );
  }

  public loginWithOptions(
    options: Omit<LoginOptions, "email" | "password"> & LoginCredentials,
  ): void {
    cy.login(options);
  }

  public loginAs(role: UserRole = "standard", successUrl?: string): void {
    cy.loginAs(role, {
      loginUrl: this.url,
      successUrl,
    });
  }

  public loginWhenConfigured(role: UserRole = "standard"): void {
    // TODO: Replace this opt-in demonstration with the real authentication test policy.
    if (String(Cypress.env("RUN_AUTH_EXAMPLE")).toLowerCase() === "true") {
      this.loginAs(role);
    }
  }
}
