# Fixtures

<!-- TODO: Replace the sample fixture names, schemas, and API examples with the real domain contract. -->

Fixtures are static test data loaded by Cypress with `cy.fixture()` or the `fixture` option on `cy.intercept()`.

Use this directory for data that should be stable and reviewable in source control. Keep secrets out of fixtures. Put credentials in the untracked `cypress.env.json` file or environment variables instead.

## Directory structure

- `users/standard.json`: A safe placeholder user for tests that need an identity. Replace the empty values through environment variables or a test-data setup step; do not commit real credentials.
- `products/catalog.json`: A representative product object for UI tests and request bodies.
- `api/products-success.json`: A successful list response for API stubs.
- `api/products-error.json`: A predictable error response for negative-path tests.

## Loading a fixture

```ts
cy.fixture("users/standard").then((user) => {
  cy.get("[name=email]").type(user.email);
});
```

## Stubbing an API response

```ts
cy.intercept("GET", "/api/products", {
  fixture: "api/products-success.json",
}).as("getProducts");
```

## Guidelines

1. Use descriptive folders based on the domain, such as `users`, `products`, or `api`.
2. Keep one reusable scenario per file rather than duplicating the same object in multiple specs.
3. Use factories for unique or generated values; fixtures should remain deterministic.
4. Keep response fixtures shaped like the real API contract so stubs catch contract changes.
5. Add a negative response fixture for important error states.

## Data factories

<!-- TODO: Update factory examples and secret-handling guidance for the real test-data strategy. -->

Typed factories are available from `cypress/support/factories` for values that should be unique or easy to customize:

```ts
import { createProduct, createUser } from "../../support/factories";

const product = createProduct({ price: 49.99 });
const user = createUser({ role: "admin" });
```

Factories provide safe example values and accept partial overrides. Replace generated values with API-created data when a test needs records to exist in the application.

## API test-data lifecycle

Use `cy.createTestData()` for records that must exist in the application. Provide the create request and a cleanup request derived from the response:

```ts
cy.createTestData<{ id: string }>({
  request: {
    method: "POST",
    url: "/api/products",
    body: createProduct(),
  },
  cleanup: (product) => ({
    method: "DELETE",
    url: `/api/products/${product.id}`,
  }),
});
```

Registered records are deleted automatically after each test, in reverse creation order. Cleanup uses `failOnStatusCode: false` so a cleanup failure does not replace the original test failure. The global hook is registered in `cypress/support/e2e.ts`.

## API client

<!-- TODO: Document the real API domains, authentication requirements, and cleanup expectations. -->

Use `ApiClient` for application API calls so URLs, methods, response mapping, and cleanup behavior stay in one place:

```ts
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

The client is available from `cypress/support/api`. Add resource methods there when a product introduces a new API domain; page objects should call those methods rather than defining `cy.request()` details.
