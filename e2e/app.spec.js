import { test, expect } from "@playwright/test";
test("loads builder and calculates preset deliverables", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /make the scope clear/i })).toBeVisible();
  await page.getByRole("button", { name: "Brand identity preset" }).click();
  await expect(page.locator("#pvitems tr")).toHaveCount(3);
  await expect(page.locator("#total")).not.toHaveText("");
});
test("blocks invalid payment allocations and recovers when corrected", async ({ page }) => {
  await page.goto("/");
  const fields = page.locator("#payments input[type=number]");
  await fields.nth(0).fill("20"); await fields.nth(1).fill("20");
  await expect(page.locator("#valid")).toContainText("must equal 100%");
  await expect(page.locator("#paymentWarning")).toBeVisible();
  await fields.nth(0).fill("50"); await fields.nth(1).fill("50");
  await expect(page.locator("#valid")).toContainText("totals 100%");
  await expect(page.locator("#paymentWarning")).toBeHidden();
});
test("clears saved draft on explicit request", async ({ page }) => {
  await page.goto("/");
  await page.locator("#project").fill("Temporary project");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("scopeledger"))).toContain("Temporary project");
  page.on("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Clear draft" }).click();
  await expect(page.locator("#project")).toHaveValue("");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("scopeledger"))).toBeNull();
});
test("keeps user text inert in the client preview", async ({ page }) => {
  await page.goto("/");
  await page.locator("#project").fill("<img src=x onerror=alert(1)>");
  await page.getByRole("button", { name: "Add item" }).click();
  await page.locator("#items input").first().fill("<svg onload=alert(1)>");
  await expect(page.locator("#pvproject")).toHaveText("<img src=x onerror=alert(1)>");
  await expect(page.locator("#pvitems svg")).toHaveCount(0);
});
