import ExamplePage from "../../pages/Example/ExamplePage";

// TODO: Replace this demonstration smoke test with the real application's critical entry flow.
describe("Example page", { tags: ["@Example", "@Smoke"] }, function () {
  context("Cypress Kitchen Sink", { tags: ["@KitchenSink"] }, function () {
    const examplePage = new ExamplePage();

    beforeEach("Open example page", function () {
      examplePage.visit();
    });

    it("loads successfully", function () {
      examplePage.verifyLoaded();
    });
  });
});
