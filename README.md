
# ts_cypress_template
A template solution / boilerplate code for a cypress+ts framework
=======
# QE Cypress Template

Reusable Cypress and TypeScript end-to-end framework for multi-environment, multi-product test suites. It follows source-project conventions: feature-oriented specs, product and user variants, page objects, shared setup, tagged execution, and generated reports.

## What It Provides

- Typed page objects with locators separated from actions.
- A reusable `Page` base class for common UI interactions.
- Product registry with environment-specific base URLs.
- Product-aware tests through `isProductSupported()`.
- Session-cached authentication profiles: `standard`, `admin`, `guest`, `teacher`, and `student`.
- Typed factories for generated users and products.
- Centralized API access through `ApiClient`.
- API test-data creation with automatic reverse-order cleanup.
- Fixtures for deterministic data and API stubs.
- Custom Cypress commands and assertions.
- Cypress grep tags for focused execution.
- Mochawesome HTML, JSON, video, and screenshot artifacts.
- ESLint, Prettier, TypeScript, setup validation, and Husky support.

## How It Works

```text
Spec
  -> Page object
      -> Page.ts reusable UI helpers
      -> ApiClient for API setup
          -> cy.request()
      -> Cypress commands and assertions
  -> Cypress runner
      -> Mochawesome report and failure media
```

| Layer                          | Responsibility                                                |
| ------------------------------ | ------------------------------------------------------------- |
| `cypress/e2e`                  | Describes scenarios and expected behavior.                    |
| `cypress/pages`                | Encapsulates page-specific selectors and business actions.    |
| `cypress/pages/Common/Page.ts` | Provides protected, reusable UI mechanics to page classes.    |
| `cypress/support/api`          | Encapsulates product, user, order, and API resource requests. |
| `cypress/support/factories`    | Generates typed, unique test payloads.                        |
| `cypress/support` commands     | Provides cross-page operations such as login and cleanup.     |
| `cypress/fixtures`             | Stores deterministic data and stub responses.                 |
| `reports`                      | Stores generated test artifacts and reports.                  |

Keep business language in specs and concrete page classes. Put reusable mechanics in `Page.ts`, API clients, factories, or Cypress commands according to their boundary.

## Getting Started

```bash
npm install
cp cypress.env.json.example cypress.env.json
npm run validate-setup
```

The included smoke tests target Cypress Kitchen Sink:

```bash
ENV=dev TARGET=cypress-kitchen-sink npm run cy:run
```

For a real application, set its URL explicitly:

```bash
CYPRESS_BASE_URL=https://qa.example.com \
ENV=qa TARGET=checkout npm run cy:run
```

Do not commit `cypress.env.json`, credentials, or generated reports.

## Daily Commands

```bash
npm run cy:open
npm run cy:run
npm run cy:debug
npm run cy:record
npm run test:smoke
npm run test:navigation
npm run test:spec
npm run test:all
npm run lint
npm run typecheck
```

Variables:

- `ENV`: `dev`, `qa`, `stage`, or `prod`.
- `TARGET`: a product registered in `productRegistry`, or `all` for non-interactive commands.
- `TAGS`: grep tags such as `@Smoke`, `@Regression`, or `@Api`.
- `SPEC`: a spec path or glob for `test:spec` or `cy:run`.

Focused examples:

```bash
ENV=qa TARGET=checkout TAGS=@Smoke npm run cy:open
ENV=qa TARGET=checkout TAGS=@Regression npm run cy:run
ENV=qa SPEC='cypress/e2e/navigation/documentation_links.cy.ts' npm run test:spec
ENV=qa TARGET=all TAGS=@Smoke npm run cy:run
ENV=qa TARGET=all TAGS=@Smoke npm run cy:debug
ENV=qa TARGET=all TAGS=@Smoke npm run cy:record
ENV=qa TARGET=all TAGS=@Smoke npm run test:smoke
ENV=qa TARGET=all TAGS=@Smoke npm run test:navigation
ENV=qa TARGET=all TAGS=@Smoke SPEC='cypress/e2e/framework/factories_features.cy.ts' npm run test:spec
ENV=qa TARGET=all TAGS=@Smoke npm run test:all
```

`TARGET=all` runs non-interactive commands once per registered product. Tags
are applied to every product run. Use one target with `cy:open`, because the
interactive Cypress application can only open one product at a time.

`cy:run` and `cy:debug` run locally without Cypress Cloud recording. `cy:record` and the `test:*` commands use Cypress Cloud and require `CYPRESS_RECORD_KEY`.

## Adding A Product

1. Create a typed module:

```ts
// cypress/support/ProductData/checkout.ts
import type { ProductConfig } from "../products";

const checkoutProduct: ProductConfig = {
  name: "checkout",
  baseUrls: {
    dev: "https://checkout.dev.example.com",
    qa: "https://checkout.qa.example.com",
    stage: "https://checkout.stage.example.com",
    prod: "https://checkout.example.com",
  },
};

export default checkoutProduct;
```

2. Export it from `cypress/support/ProductData/index.ts`:

```ts
export { default as checkoutProduct } from "./checkout";
```

3. Register it in `cypress/support/products.ts`:

```ts
import { checkoutProduct, exampleProduct } from "./ProductData";

export const productRegistry = {
  [exampleProduct.name]: exampleProduct,
  [checkoutProduct.name]: checkoutProduct,
} satisfies Record<string, ProductConfig>;
```

Run it with:

```bash
ENV=qa TARGET=checkout npm run cy:run
```

Set `TARGET=all` to run the suite once for every product registered in
`productRegistry`:

The runs execute sequentially and share the same report run directory. A
non-zero exit code is returned if any product run fails.

Default page objects resolve the selected product automatically. Explicit injection is still available when a test must ignore `TARGET`:

```ts
const page = new ExamplePage(checkoutProduct);
```

## Writing Specs

Organize specs by feature or execution purpose:

```text
cypress/e2e/
  smoke/
  navigation/
  api/
  checkout/
```

Keep specs focused on behavior:

```ts
describe("Checkout", { tags: ["@Checkout", "@Regression"] }, function () {
  beforeEach("Open checkout", function () {
    checkoutPage.visit();
  });

  it("completes a purchase", function () {
    checkoutPage.completePurchase();
  });
});
```

Selectors and low-level Cypress interactions belong in page classes or shared helpers, not in every spec.

### Product-specific tests

Cypress discovers the spec normally, but unsupported products can skip a test:

```ts
import { isProductSupported } from "../../support/productTarget";

it("uses checkout-specific behavior", function () {
  if (!isProductSupported(["checkout"])) {
    this.skip();
  }

  checkoutPage.verifyPaymentOptions();
});
```

Use the same guard in a named `beforeEach` when an entire context belongs to one product.

## Page Objects And `Page.ts`

Create a class and locator file under `cypress/pages/<Domain>`:

```ts
import Page from "../Common/Page";
import locators from "./CheckoutPage.locators";

export default class CheckoutPage extends Page {
  public readonly url = `${this.baseUrl}/checkout`;
  public readonly elements = locators;

  public completePurchase(): void {
    this.clearAndType("cardNumber", "4111111111111111", false);
    this.clickElement("placeOrder");
    this.verifyUrlContains("/confirmation");
  }
}
```

`Page.ts` is the shared UI toolkit. Its protected helpers include `element`, `clickElement`, `clearAndType`, `verifyElementCount`, `verifyUrlContains`, and `clickUntilNavigates`. Add a helper there only when it is reusable across page classes. Keep domain-specific actions in concrete page classes.

## Authentication Profiles

Authentication uses `cy.session()`. Supported profiles are `standard`, `admin`, `guest`, `teacher`, and `student`:

```ts
const loginPage = new LoginPage();
loginPage.loginAs("teacher", "/teacher/dashboard");
loginPage.loginAs("student", "/student/dashboard");
```

The direct command is also available:

```ts
cy.loginAs("student", {
  loginUrl: "/login",
  successUrl: "/student/dashboard",
});
```

Configure profiles in the untracked `cypress.env.json`:

```json
{
  "users": {
    "teacher": { "email": "", "password": "" },
    "student": { "email": "", "password": "" }
  }
}
```

Role-specific environment variables such as `TEACHER_EMAIL` and `TEACHER_PASSWORD` are also supported. Non-standard profiles do not fall back to generic credentials.

## API Client And Test Data

Use `ApiClient` for application API calls:

```ts
import { ApiClient } from "../../support/api";
import { createProduct, createUser } from "../../support/factories";

const api = new ApiClient();
api.getProducts();
api.createUser(createUser());
api.createProduct(createProduct());
api.createOrder({
  userId: "user-id",
  productIds: ["product-id"],
  status: "pending",
});
```

Resource creation registers automatic cleanup after each test, in reverse creation order. Add new API domains under `cypress/support/api` rather than putting `cy.request()` calls in specs or page objects.

Use fixtures for stable data and factories for unique or overrideable values:

```ts
cy.fixture("products/catalog");
const product = createProduct({ price: 49.99 });
```

See [cypress/fixtures/README.md](cypress/fixtures/README.md) for detailed conventions.

## Reports And Diagnostics

Mochawesome generates HTML reports after Cypress runs. Local runs use an isolated folder under `reports/runs`, record video, and capture screenshots on failure.

```text
reports/runs/<run-id>/
  <spec>.html
  <spec>.json
  cypress-combined-report.json   # after report:merge
  html/index.html                # after report:generate
  videos/
```

For an existing run:

```bash
REPORT_RUN_ID=local npm run report:merge
REPORT_RUN_ID=local npm run report:generate
```

Generated reports, videos, screenshots, and downloads are ignored by Git. Use Cypress Cloud for run history, parallelization, or team analytics.

## Scaling The Framework

Scale by adding domain modules instead of making shared files larger:

```text
cypress/
  e2e/
    smoke/
    checkout/
    users/
    api/
  pages/
    Common/Page.ts
    Checkout/
    Users/
  support/
    api/
      ProductApi.ts
      UserApi.ts
      OrderApi.ts
    factories/
    auth.ts
    commands.ts
```

Recommended growth path:

1. Register each product and environment.
2. Split `ApiClient` into domain clients when it becomes large.
3. Keep factories independent from API clients.
4. Standardize creation and cleanup for every persistent resource.
5. Use role profiles and `cy.session()` for permission coverage.
6. Group specs by smoke, navigation, API, accessibility, and regression purpose.
7. Use tags and product guards to avoid irrelevant scenarios.
8. Add CI orchestration, artifact upload, browser matrices, and flaky-test tracking when ready.

## Tailoring The Template

TODO: Before adopting this template for a real project, complete the following customization checklist:

- TODO: Rename the package and define the project's versioning and release policy in `package.json`.
- TODO: Replace the demo product, URLs, environments, and registry entries in `cypress/support/ProductData` and `cypress/support/products.ts`.
- TODO: Replace generic page and login selectors with stable application selectors such as `data-testid` or `data-cy`.
- TODO: Replace example page, navigation, fixture, API, factory, and authentication scenarios with real business coverage.
- TODO: Align API endpoints, payloads, response types, authentication headers, and cleanup with the real backend.
- TODO: Align generated factory data, roles, password policy, required fields, and test-user domains with the real system.
- TODO: Configure real credentials through secret storage and keep them out of fixtures and source control.
- TODO: Review uncaught-exception and telemetry interception policies before enabling them in shared environments.
- TODO: Review browser, viewport, timeout, video, screenshot, and report-retention settings for CI.
- TODO: Add the Cypress Cloud `projectId`, secure `CYPRESS_RECORD_KEY`, CI workflows, browser matrices, and artifact upload.
- TODO: Extend setup validation to check required configuration, services, products, credentials, and browser availability.
- TODO: Review `tsconfig.json`, `eslint.config.js`, and npm scripts if the real repository adds source directories or tooling.

- **Selectors:** replace defaults with stable `data-testid` or `data-cy` selectors.
- **Login:** update locators, routes, success URLs, and profile names.
- **Roles:** edit `userRoles` to match the application, such as teacher, student, parent, or administrator.
- **Products:** add only the environments and products the team supports.
- **API:** add domain clients and response types for real contracts.
- **Data:** keep stable scenarios in fixtures and unique records in factories/API setup.
- **Assertions:** add domain assertions when they recur across pages or specs.
- **Reports:** adjust reporter options, retention, video policy, and output naming.
- **Execution:** change package scripts, tags, browsers, and viewport profiles to match the release workflow.
- **Base class:** add only cross-page mechanics to `Page.ts`; keep domain logic elsewhere.

## Quality Checks

```bash
npm run lint
npm run typecheck
npm run validate-setup
npx cypress run --spec cypress/e2e/smoke/example_page.cy.ts --record false --browser chrome
```

The template does not include CI configuration. Add CI separately when environments, secrets, browser matrices, and artifact storage are defined.
>>>>>>> cc1b1c5 (Initial setup)
