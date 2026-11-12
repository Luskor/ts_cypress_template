import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

// TODO: Set report location, title, retention, and artifact naming to the real CI policy.
const reportRoot = "reports";
const runId = process.env.REPORT_RUN_ID || "local";
const reportDir = join(reportRoot, "runs", runId);
const jsonDir = join(reportDir, ".jsons");
const mergedReport = join(reportDir, "cypress-combined-report.json");
const htmlDir = join(reportDir, "html");

function binary(name: string): string {
  return join("node_modules", ".bin", name);
}

function clean(): void {
  rmSync(reportDir, { recursive: true, force: true });
  mkdirSync(jsonDir, { recursive: true });
  console.log(`Report directory ready: ${reportDir}`);
}

function merge(): void {
  if (!existsSync(jsonDir)) {
    throw new Error(`No report JSON directory found: ${jsonDir}`);
  }

  const jsonFiles = readdirSync(jsonDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => join(jsonDir, file));
  if (jsonFiles.length === 0) {
    throw new Error(`No report JSON files found in: ${jsonDir}`);
  }

  execFileSync(
    binary("mochawesome-merge"),
    [...jsonFiles, "-o", mergedReport],
    { stdio: "inherit" },
  );
}

function generate(): void {
  execFileSync(
    binary("marge"),
    [
      mergedReport,
      "-o",
      htmlDir,
      "-f",
      "index",
      "--reportTitle",
      // TODO: Replace the template report title with the real project name.
      "qe-cypress-template",
    ],
    { stdio: "inherit" },
  );
}

const command = process.argv[2];
if (command === "clean") {
  clean();
} else if (command === "merge") {
  merge();
} else if (command === "generate") {
  generate();
} else {
  throw new Error("Expected one of: clean, merge, generate");
}
