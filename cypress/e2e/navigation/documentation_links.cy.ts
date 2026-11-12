import ExamplePage from "../../pages/Example/ExamplePage";

// TODO: Replace this demo navigation coverage with the product's critical navigation paths.
describe(
  "Documentation links",
  { tags: ["@Documentation", "@Smoke"] },
  function () {
    context("Cypress Kitchen Sink", { tags: ["@KitchenSink"] }, function () {
      const examplePage = new ExamplePage();

      beforeEach("Open example page", function () {
        examplePage.visit();
      });

      it("open in a new tab", function () {
        examplePage.verifyDocumentationLinksOpenInNewTabs();
      });
    });
  },
);
