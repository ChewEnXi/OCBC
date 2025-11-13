// ocbc-testsphere/ci-run.js
// Trigger a TestSphere run (works both locally and from GitHub Actions)

const fetch = (...args) =>
  import('node-fetch').then(({ default: f }) => f(...args));

(async () => {
  const base = process.env.TESTSPHERE_BASE || 'http://127.0.0.1:8080';

  // What page to test
  const urlToTest =
    process.env.TARGET_URL || `${base.replace(/\/$/, '')}/ocbc-demo/`;

  // ✅ use /api/run (this route exists on your server)
  const endpoint = `${base.replace(/\/$/, '')}/api/run`;

  const token = process.env.TESTSPHERE_TOKEN;
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['x-testsphere-token'] = token; // optional, backend ignores it for now
  }

  console.log(`🚀 Triggering TestSphere run for: ${urlToTest}`);
  console.log(`➡️  POST ${endpoint}`);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ url: urlToTest }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${res.status} ${text}`);
    }

    const data = await res.json();
    console.log('✅ Run started:', data);
  } catch (err) {
    console.error('❌ Failed to trigger run:', err.message || err);
    process.exit(1);
  }
})();
