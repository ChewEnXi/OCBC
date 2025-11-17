// playwright/loginScenario.js
// Reusable scenario: open page, log in with demo credentials, wait for accounts.

async function loginAndWait(page, url) {
  // Go to the demo page
  await page.goto(url, {
    waitUntil: "networkidle",
    timeout: 60_000,
  });

  // Fill the hard-coded demo credentials
  await page.fill("#userId", "demo");
  await page.fill("#pin", "1234");

  // Click the login button (the one inside the form)
  await page.click("#login-form button[type='submit']");

  // Wait for the accounts section to appear
  await page.waitForSelector("#accounts", { timeout: 10_000 });

  // Small extra delay so UI can settle
  await page.waitForTimeout(500);
}

module.exports = { loginAndWait };
