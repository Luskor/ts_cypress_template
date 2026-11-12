import ExamplePage from "../../pages/Example/ExamplePage";

describe(
  "Custom command features",
  { tags: ["@Framework", "@Commands"] },
  function () {
    const examplePage = new ExamplePage();

    beforeEach("Open the example page", function () {
      examplePage.visit();
    });

    it("reads an element attribute with storeValue", function () {
      examplePage.verifyStoreValueCommand();
    });

    it("changes a link to the same tab with openInSameTab", function () {
      examplePage.verifyOpenInSameTabCommand();
    });

    it("registers the window-open stub command", function () {
      examplePage.verifyStubWindowOpenSameTabCommand();
    });
  },
);
