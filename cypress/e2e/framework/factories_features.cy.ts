import FrameworkPage from "../../pages/Framework/FrameworkPage";

describe(
  "Factory features",
  { tags: ["@Framework", "@Smoke", "@Factories"] },
  function () {
    // TODO: Retain this spec only if factory behavior is part of the project's infrastructure coverage.
    const frameworkPage = new FrameworkPage();

    it("generates unique products with controlled overrides", function () {
      frameworkPage.verifyProductFactory();
    });

    it("generates users with role overrides", function () {
      frameworkPage.verifyUserFactory();
    });
  },
);
