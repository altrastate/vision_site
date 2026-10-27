import { expect, test } from "@playwright/test";

test("search filters remain usable on a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/jobs");
  await expect(page.getByLabel("Search")).toBeVisible({ timeout: 15_000 });
  await page.getByLabel("Search").fill("analyst");
  await page.getByLabel("Job type").selectOption("full_time");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page).toHaveURL(/type=full_time/);
  await expect(page.getByRole("link", { name: "Clear all" })).toBeVisible({ timeout: 15_000 });
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await expect(page.getByRole("navigation", { name: "Mobile" })).toBeVisible();
});
