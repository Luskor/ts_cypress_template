import { spawnSync } from "node:child_process";
import { exampleProduct } from "../cypress/support/ProductData/index.js";
import { productRegistry } from "../cypress/support/products.js";

// TODO: Confirm the default target and sequential multi-product strategy match the real CI workflow.
const requestedTarget = process.env.TARGET || process.env.CYPRESS_TARGET;
const targets =
  requestedTarget?.toLowerCase() === "all"
    ? Object.keys(productRegistry)
    : [requestedTarget || exampleProduct.name];

let exitCode = 0;

for (const target of targets) {
  console.log(`\nRunning Cypress for target: ${target}`);

  const result = spawnSync("cypress", process.argv.slice(2), {
    stdio: "inherit",
    env: {
      ...process.env,
      TARGET: target,
      CYPRESS_TARGET: target,
    },
  });

  if (result.error) {
    console.error(result.error.message);
    exitCode = 1;
  } else if (result.status !== 0) {
    exitCode = result.status ?? 1;
  }
}

process.exitCode = exitCode;
