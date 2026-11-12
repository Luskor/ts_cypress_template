export {};

declare global {
  namespace Cypress {
    interface Chainer<Subject> {
      (chainer: "be.audible"): Chainable<Subject>;
      (chainer: "be.visibleInViewport"): Chainable<Subject>;
      (
        chainer: "be.flushWithEdge",
        edge: "top" | "bottom" | "left" | "right",
      ): Chainable<Subject>;
    }
  }
}

chai.Assertion.addMethod("audible", function isElementAudible() {
  const elements = this._obj as JQuery<HTMLMediaElement>;
  Cypress.ensure.isElement(elements, "should", cy);

  const isAudible = Array.from(elements).some(
    (element) => element.duration > 0 && !element.paused && !element.muted,
  );
  this.assert(
    isAudible,
    "expected #{this} to be playing audio",
    "expected #{this} not to be playing audio",
    true,
    isAudible,
  );
});

chai.Assertion.addMethod(
  "visibleInViewport",
  function isElementVisibleInViewport() {
    const element = (this._obj as JQuery<HTMLElement>)[0];
    Cypress.ensure.isElement(this._obj, "should", cy);
    const rect = element.getBoundingClientRect();
    const visible =
      rect.bottom >= 0 &&
      rect.top <= Cypress.config("viewportHeight") &&
      rect.right >= 0 &&
      rect.left <= Cypress.config("viewportWidth");

    this.assert(
      visible,
      "expected #{this} to be within the viewport",
      "expected #{this} not to be within the viewport",
      true,
      visible,
    );
  },
);

chai.Assertion.addMethod(
  "flushWithEdge",
  function isElementFlushWithEdge(edge: "top" | "bottom" | "left" | "right") {
    const element = (this._obj as JQuery<HTMLElement>)[0];
    Cypress.ensure.isElement(this._obj, "should", cy);
    const rect = element.getBoundingClientRect();
    const viewport = {
      top: rect.top === 0,
      bottom: rect.bottom === Cypress.config("viewportHeight"),
      left: rect.left === 0,
      right: rect.right === Cypress.config("viewportWidth"),
    };

    if (!(edge in viewport)) {
      throw new Error(`Invalid viewport edge: ${edge}`);
    }
    this.assert(
      viewport[edge],
      `expected #{this} to be flush with the ${edge} edge`,
      `expected #{this} not to be flush with the ${edge} edge`,
      true,
      viewport[edge],
    );
  },
);
