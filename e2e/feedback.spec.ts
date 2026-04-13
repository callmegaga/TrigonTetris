import { expect, test } from "@playwright/test";

test("feedback modal requires description before submit", async ({ page }) => {
	await page.goto("/");
	await page.locator("body").click();

	await page.getByRole("button", { name: "BUG反馈" }).click();
	await page.getByRole("button", { name: "提交反馈" }).click();

	await expect(page.getByText("描述不能为空，且不能超过 100 字。")).toBeVisible();
});
