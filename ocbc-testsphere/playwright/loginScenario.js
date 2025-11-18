// playwright/loginScenario.js
// Reusable scenario: open page, log in with demo credentials, wait for logged-in banner.

async function loginAndWait(page, url) {
  // 1. Go to the demo page
  await page.goto(url, {
    waitUntil: "networkidle",
    timeout: 60_000,
  });

  // 2. Fill the demo credentials
  await page.fill("#userId", "demo");
  await page.fill("#pin", "1234");

  // 3. Click the login button
  await page.click("#login-form button[type='submit']");

  // 4. ✅ Wait specifically for the "logged in" banner
  await page.waitForSelector("#logged-in-status", {
    state: "visible",
    timeout: 10_000,
  });

  // Optional: small delay so UI is fully settled for a nice screenshot
  await page.waitForTimeout(500);
}

module.exports = { loginAndWait };
