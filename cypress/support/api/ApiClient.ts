import type { ProductData } from "../factories/product";
import type { UserData } from "../factories/user";
import type { TestDataRequest } from "../testData";

export interface ApiResource {
  id: string;
}

export interface OrderData extends ApiResource {
  // TODO: Replace the sample order fields with the real order API contract.
  userId: string;
  productIds: string[];
  status: "pending" | "paid" | "cancelled";
}

interface ProductListResponse {
  data: ProductData[];
}

export class ApiClient {
  // TODO: Replace sample endpoints, payloads, auth headers, and response types with real API contracts.
  public getProducts(): Cypress.Chainable<ProductData[]> {
    return this.request<ProductListResponse>({
      method: "GET",
      url: "/api/products",
    }).then((response) => response.data);
  }

  public createUser(user: UserData): Cypress.Chainable<UserData & ApiResource> {
    return this.createResource<UserData & ApiResource>("/api/users", user);
  }

  public createProduct(
    product: Omit<ProductData, "id"> | ProductData,
  ): Cypress.Chainable<ProductData & ApiResource> {
    return this.createResource<ProductData & ApiResource>(
      "/api/products",
      "id" in product ? this.withoutId(product) : product,
    );
  }

  public createOrder(
    order: Omit<OrderData, "id">,
  ): Cypress.Chainable<OrderData> {
    return this.createResource<OrderData>("/api/orders", order);
  }

  private request<T>(request: TestDataRequest): Cypress.Chainable<T> {
    return cy
      .request(request)
      .then((response) => cy.wrap(response.body as T, { log: false }));
  }

  private createResource<T extends ApiResource>(
    resourceUrl: string,
    body: object,
  ): Cypress.Chainable<T> {
    return cy.createTestData<T>({
      request: {
        method: "POST",
        url: resourceUrl,
        body,
      },
      cleanup: (createdResource) => ({
        method: "DELETE",
        url: `${resourceUrl}/${createdResource.id}`,
      }),
    });
  }

  private withoutId<T extends ApiResource>(resource: T): Omit<T, "id"> {
    const resourceWithoutId = { ...resource } as Omit<T, "id"> & {
      id?: string;
    };
    delete resourceWithoutId.id;
    return resourceWithoutId as Omit<T, "id">;
  }
}
