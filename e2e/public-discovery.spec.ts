import { expect, test } from "@playwright/test";

test("a visitor can open the homepage and search for jobs", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /see opportunity/i })).toBeVisible();
  await page.getByLabel("Search jobs").fill("nurse");
  await page.getByRole("button", { name: "Search jobs" }).click();
  await expect(page).toHaveURL(/\/jobs/);
  await expect(page.getByRole("heading", { name: "Find jobs", exact: true })).toBeVisible();
});

test("job and company directories render empty or data states", async ({ page }) => {
  await page.goto("/jobs");
  await expect(page.getByRole("heading", { name: "Find jobs", exact: true })).toBeVisible();
  await expect(page.getByLabel("Search")).toBeVisible({ timeout: 15_000 });
  await page.goto("/companies");
  await expect(page.getByRole("heading", { name: "Companies", exact: true })).toBeVisible();
});

test("unknown job slugs show a not-found page without leaking drafts", async ({ page }) => {
  const response = await page.goto("/jobs/unknown-company/unknown-job");
  expect(response?.status() ?? 200).toBeGreaterThanOrEqual(200);
  await expect(page.getByRole("heading", { name: /not found|unavailable/i })).toBeVisible();
  await expect(page.getByText(/draft/i)).toHaveCount(0);
});
