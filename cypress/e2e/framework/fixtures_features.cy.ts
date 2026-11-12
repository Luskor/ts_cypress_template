import FrameworkPage from "../../pages/Framework/FrameworkPage";

describe(
  "Fixture features",
  { tags: ["@Framework", "@Fixtures"] },
  function () {
    const frameworkPage = new FrameworkPage();

    it("loads a deterministic product fixture", function () {
      frameworkPage.verifyProductFixture();
    });

    it("stubs a successful products response with a fixture", function () {
      frameworkPage.verifyProductsApiFixture();
    });

    it("stubs an error response with a fixture", function () {
      frameworkPage.verifyProductsApiErrorFixture();
    });
  },
);
