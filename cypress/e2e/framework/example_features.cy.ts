import ExamplePage from "../../pages/Example/ExamplePage";

describe("Product features", { tags: ["@Framework", "@Smoke"] }, function () {
  // TODO: Replace sample product scenarios with real business workflows.
  const examplePage = new ExamplePage();

  context("Product application", { tags: ["@Product"] }, function () {
    beforeEach("Open the configured product", function () {
      examplePage.visit();
    });

    it("loads successfully", function () {
      examplePage.verifyLoaded();
    });

    it("displays the primary heading in the viewport", function () {
      examplePage.verifyHeadingCount(1);
      examplePage.verifyHeadingIsInViewport();
    });

    it("keeps external documentation links in new tabs", function () {
      examplePage.verifyDocumentationLinksOpenInNewTabs();
    });

    it("supports changing a new-tab link to the same tab", function () {
      examplePage.verifyDocumentationLinkCanBeOpenedInSameTab();
    });
  });

  context("Product targeting", { tags: ["@Targets"] }, function () {
    it("uses the registry-selected product target", function () {
      examplePage.verifyConfiguration();
    });
  });
});
