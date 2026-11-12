export interface LoginCredentials {
  email: string;
  password: string;
}

// TODO: Replace these sample roles with the roles supported by the real application.
export const userRoles = [
  "standard",
  "admin",
  "guest",
  "teacher",
  "student",
] as const;

export type UserRole = (typeof userRoles)[number];

export interface LoginOptions extends LoginCredentials {
  loginUrl: string;
  emailSelector?: string;
  passwordSelector?: string;
  submitSelector?: string;
  successUrl?: string;
}

export function getLoginCredentials(
  role: UserRole = "standard",
): LoginCredentials {
  const users = Cypress.env("users") as
    | Record<string, Partial<LoginCredentials>>
    | undefined;
  const configuredUser = users?.[role];
  const rolePrefix = role.toUpperCase();
  const email =
    configuredUser?.email ||
    Cypress.env(`${rolePrefix}_EMAIL`) ||
    (role === "standard" ? Cypress.env("USER_EMAIL") : undefined);
  const password =
    configuredUser?.password ||
    Cypress.env(`${rolePrefix}_PASSWORD`) ||
    (role === "standard" ? Cypress.env("USER_PASSWORD") : undefined);

  if (!email || !password) {
    throw new Error(
      `Missing credentials for user role "${role}". ` +
        "Set users.<role>.email and users.<role>.password in cypress.env.json or use USER_EMAIL and USER_PASSWORD.",
    );
  }

  return { email, password };
}
