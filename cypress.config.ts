import { defineConfig } from "cypress";
// @ts-expect-error The reporter does not publish TypeScript declarations.
import installLogsPrinter from "cypress-mochawesome-reporter/plugin";
// @ts-expect-error The plugin entry point does not publish TypeScript declarations.
import registerCypressGrep from "@cypress/grep/src/plugin";

export default defineConfig({
  // TODO: Add the real Cypress Cloud projectId before enabling recorded runs.
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: process.env.REPORT_DIR || "reports/runs/local",
    reportFilename: "[name].json",
    overwrite: false,
    html: false,
    json: true,
    saveJson: true,
    removeJsonsFolderAfterMerge: false,
  },
  e2e: {
    // TODO: Replace the demo fallback with the real application base URL or require it from CI.
    baseUrl: process.env.CYPRESS_BASE_URL || "https://example.cypress.io",
    setupNodeEvents(on, config) {
      registerCypressGrep(config);
      installLogsPrinter(on);
      return config;
    },
  },
  env: {
    grepFilterSpecs: true,
    grepOmitFiltered: true,
  },
  // TODO: Review video retention and screenshot policy for CI storage and privacy requirements.
  video: true,
  screenshotOnRunFailure: true,
  // TODO: Confirm whether the real application requires relaxed browser security.
  chromeWebSecurity: false,
  // TODO: Replace the demo viewport and timeout budgets with supported application profiles.
  viewportWidth: 1440,
  viewportHeight: 900,
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 60000,
});
