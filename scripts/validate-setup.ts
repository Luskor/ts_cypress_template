import { existsSync } from "node:fs";

const requiredFiles = [
  // TODO: Add real project-required specs, fixtures, and configuration files.
  "cypress.config.ts",
  "tsconfig.json",
  "cypress/support/e2e.ts",
];

const missingFiles = requiredFiles.filter((file) => !existsSync(file));

// TODO: Validate required environment variables, product registrations, credentials, and reachable services.

if (missingFiles.length > 0) {
  console.error(`Missing required files:\n${missingFiles.join("\n")}`);
  process.exit(1);
}

console.log("Cypress framework setup is valid.");
