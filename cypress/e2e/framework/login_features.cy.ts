import LoginPage from "../../pages/Login/LoginPage";

describe(
  "Authentication profiles",
  { tags: ["@Framework", "@Smoke", "@Auth"] },
  function () {
    // TODO: Add real role, redirect, invalid-credential, session, and logout scenarios.
    const loginPage = new LoginPage();

    it("supports an opt-in standard login session", function () {
      loginPage.loginWhenConfigured();
    });
  },
);
