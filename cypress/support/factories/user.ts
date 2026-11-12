export type UserRole = "standard" | "admin";

export interface UserData {
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
}

let userSequence = 0;

export function createUser(overrides: Partial<UserData> = {}): UserData {
  // TODO: Use the real role type, password policy, required fields, and approved test-user domain.
  userSequence += 1;
  const identifier = `${Date.now()}-${userSequence}`;

  return {
    email: `test-user-${identifier}@example.com`,
    password: "Test-password-123!",
    displayName: `Test User ${userSequence}`,
    role: "standard",
    ...overrides,
  };
}


export function invalidCreateUser(overrides: Partial<UserData> = {}): UserData {
  // TODO: Use the real role type, password policy, required fields, and approved test-user domain.
  userSequence += 1;
  const identifier = `${Date.now()}-${userSequence}`;

  return {
    email: `test-user-${identifier}@example.com`,
    password: "Test-password-123!",
    displayName: `Test User ${userSequence}`,
    role: "standard",
    ...overrides,
  };
}
