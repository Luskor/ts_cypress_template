import FrameworkPage from "../../pages/Framework/FrameworkPage";

describe("Framework features", { tags: ["@Framework", "@Smoke"] }, function () {
  // TODO: Replace framework demonstrations with real application contract and setup coverage.
  const frameworkPage = new FrameworkPage();

  context("Fixtures", { tags: ["@Fixtures"] }, function () {
    it("loads deterministic product data", function () {
      frameworkPage.verifyProductFixture();
    });

    it("keeps credential placeholders out of fixtures", function () {
      frameworkPage.verifyStandardUserFixtureIsSafe();
    });
  });

  context("API client and stubbing", { tags: ["@Api"] }, function () {
    it("maps a stubbed browser API response", function () {
      frameworkPage.verifyProductsApiFixture();
    });

    it("creates and cleans up a product through the API client", function () {
      frameworkPage.verifyApiClientAndCleanup();
    });
  });
});
