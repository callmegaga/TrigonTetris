import { expect, test } from "@playwright/test";

test("welcome screen loads and feedback button appears after entering the game", async ({ page }) => {
	await page.goto("/");

	await expect(page.locator(".welcome video")).toBeVisible();
	await expect(page.getByRole("button", { name: "BUG反馈" })).toHaveCount(0);

	await page.locator(".welcome").click();

	await expect(page.getByRole("button", { name: "BUG反馈" })).toBeVisible();
	await expect(page.locator("#game canvas")).toBeVisible();
});
