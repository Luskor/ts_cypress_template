import "./commands";
import "./assertions";
import "cypress-iframe";
import "cypress-real-events/support";
// @ts-expect-error The package's runtime export is not represented by its declarations.
import registerCypressGrep from "@cypress/grep";

registerCypressGrep();

// TODO: Ignore only documented third-party exceptions; do not hide real application failures globally.
Cypress.on("uncaught:exception", () => false);

beforeEach(function blockTelemetryLogs() {
  // TODO: Replace these demo telemetry patterns with real third-party endpoints, or remove them.
  [
    /https:\/\/rum\.browser-intake-datadoghq\.com\/.*/,
    /https:\/\/r\.clarity\.ms\/collect/,
    /https:\/\/www\.google-analytics\.com\/.*/,
  ].forEach((pattern) => cy.intercept(pattern, { log: false }));
});

afterEach(function cleanUpTestData() {
  cy.cleanupTestData();
});
