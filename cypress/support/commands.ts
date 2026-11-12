const defaultLoginSelectors = {
  // TODO: Replace defaults with stable selectors from the real login application.
  email: 'input[name="email"]',
  password: 'input[name="password"]',
  submit: 'button[type="submit"]',
} as const;

const knownOverlaySelectors = [
  // TODO: Replace demo overlay selectors with the application's known dismissible overlays.
  '[role="dialog"] [aria-label="Close"]',
  '[aria-label="Close"]',
  '[data-testid="close"]',
];

function fillLoginForm(
  email: string,
  password: string,
  emailSelector: string,
  passwordSelector: string,
): void {
  cy.get(emailSelector).clear();
  cy.get(emailSelector).type(email);
  cy.get(passwordSelector).clear();
  cy.get(passwordSelector).type(password, { log: false });
}

import {
  registerCleanupRequest,
  takeCleanupRequests,
  type CreateTestDataOptions,
} from "./testData";
import { getLoginCredentials, type LoginOptions, type UserRole } from "./auth";

declare global {
  namespace Cypress {
    interface Chainable {
      createTestData<T>(options: CreateTestDataOptions<T>): Chainable<T>;
      cleanupTestData(): Chainable<void>;
      login(options: import("./auth").LoginOptions): Chainable<void>;
      loginAs(
        role: UserRole,
        options: Omit<LoginOptions, "email" | "password">,
      ): Chainable<void>;
      dismissKnownOverlays(): Chainable<void>;
      openInSameTab(): Chainable<void>;
      stubWindowOpenSameTab(): Chainable<void>;
      storeValue(
        selector: string,
        index: number,
        attribute: string,
      ): Chainable<string | undefined>;
    }
  }
}

Cypress.Commands.add(
  "createTestData",
  <T>({ request, cleanup }: CreateTestDataOptions<T>) =>
    cy.request(request).then((response) => {
      const createdData = response.body as T;
      if (cleanup) {
        registerCleanupRequest(cleanup(createdData));
      }
      return cy.wrap(createdData, { log: false });
    }),
);

Cypress.Commands.add("cleanupTestData", () => {
  takeCleanupRequests().forEach((request) => {
    cy.request({ ...request, failOnStatusCode: false, log: false });
  });
});

Cypress.Commands.add("login", (options) => {
  const {
    email,
    password,
    loginUrl,
    emailSelector = defaultLoginSelectors.email,
    passwordSelector = defaultLoginSelectors.password,
    submitSelector = defaultLoginSelectors.submit,
    successUrl,
  } = options;

  cy.session(
    [loginUrl, email],
    () => {
      cy.visit(loginUrl);
      fillLoginForm(email, password, emailSelector, passwordSelector);
      cy.get(submitSelector).click();
    },
    {
      validate: () => {
        if (successUrl) {
          cy.url().should("include", successUrl);
        }
      },
    },
  );
});

Cypress.Commands.add("loginAs", (role, options) => {
  cy.login({
    ...options,
    ...getLoginCredentials(role),
  });
});

Cypress.Commands.add("dismissKnownOverlays", () => {
  cy.get("body").then(($body) => {
    const closeButton = $body
      .find(knownOverlaySelectors.join(","))
      .filter(":visible")
      .first();
    if (closeButton.length > 0) {
      cy.wrap(closeButton).click({ force: true, log: false });
    }
  });
});

Cypress.Commands.add("openInSameTab", { prevSubject: true }, (subject) => {
  cy.wrap(subject)
    .should("have.attr", "target", "_blank")
    .invoke("attr", "target", "_self");
});

Cypress.Commands.add("stubWindowOpenSameTab", () => {
  // TODO: Verify this stub matches the real application's routing and external-link behavior.
  cy.window().then((window) => {
    cy.stub(window, "open")
      .callsFake((url) => {
        if (url) {
          window.location.href = url;
        }
      })
      .as("windowOpenSameTab");
  });
});

Cypress.Commands.add("storeValue", (selector, index, attribute) =>
  cy.get(selector).eq(index).invoke("attr", attribute),
);

export {};
