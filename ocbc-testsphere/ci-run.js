// ci-run.js
// This script triggers an OCBC TestSphere run automatically (used by CI/CD)

const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

(async () => {
  const url = process.env.TARGET_URL || 'http://127.0.0.1:8080/ocbc-demo/';
  console.log(`🚀 Triggering TestSphere run for ${url}`);

  try {
    const res = await fetch('http://127.0.0.1:8080/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    console.log('✅ Run started:', data);
  } catch (err) {
    console.error('❌ Failed to trigger run:', err.message || err);
    process.exit(1);
  }
})();
