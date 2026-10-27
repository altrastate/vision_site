import { expect, test } from "@playwright/test";

test("registration and login pages validate required fields", async ({ page }) => {
  await page.goto("/auth/register");
  await expect(page.getByRole("heading", { name: "Create an account" })).toBeVisible();
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("alert").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Privacy Policy" })).toBeVisible();
  await expect(page.getByRole("main").getByRole("link", { name: "Terms" })).toBeVisible();

  await page.goto("/auth/login");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("alert").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Forgot password?" })).toBeVisible();
});

test("password recovery is available without claiming email delivery", async ({ page }) => {
  await page.goto("/auth/forgot-password");
  await expect(page.getByRole("heading", { name: "Reset your password" })).toBeVisible();
  await page.getByLabel("Email").fill("seeker@example.com");
  await page.getByRole("button", { name: "Send reset link" }).click();
  await expect(page.getByRole("status")).toBeVisible();
});

test("an unauthenticated visitor is redirected away from profile", async ({ page }) => {
  await page.goto("/seeker/profile");
  await expect(page).toHaveURL(/\/auth\/login/);
});

test("legacy sign-in and sign-up routes redirect", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(page).toHaveURL(/\/auth\/login/);
  await page.goto("/sign-up");
  await expect(page).toHaveURL(/\/auth\/register/);
});
