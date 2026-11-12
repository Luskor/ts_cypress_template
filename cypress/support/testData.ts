export interface TestDataRequest {
  method: Cypress.HttpMethod;
  url: string;
  body?: Cypress.RequestBody;
  headers?: Record<string, string>;
}

export interface CreateTestDataOptions<T> {
  request: TestDataRequest;
  cleanup?: (createdData: T) => TestDataRequest;
}

const cleanupRequests: TestDataRequest[] = [];

export function registerCleanupRequest(request: TestDataRequest): void {
  cleanupRequests.push(request);
}

export function takeCleanupRequests(): TestDataRequest[] {
  return cleanupRequests.splice(0).reverse();
}
