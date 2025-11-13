// ci-run.js
// Trigger an OCBC TestSphere run.
// - Local dev: hits http://127.0.0.1:8080/api/run (no auth)
// - CI (GitHub): hits https://ocbc-fyui.onrender.com/api/ci-run with Bearer token

const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

(async () => {
  const targetUrl =
    process.env.TARGET_URL || 'http://127.0.0.1:8080/ocbc-demo/';

  // Where the TestSphere backend is running
  const base =
    process.env.TESTSPHERE_BASE || 'http://127.0.0.1:8080';

  const token = process.env.TESTSPHERE_TOKEN;

  // If we have a token AND we're not talking to localhost,
  // use the protected CI endpoint.
  const isLocal =
    base.includes('127.0.0.1') || base.includes('localhost');
  const useCiEndpoint = !!token && !isLocal;

  const endpoint = useCiEndpoint ? '/api/ci-run' : '/api/run';
  const url = `${base}${endpoint}`;

  console.log(`🚀 Triggering TestSphere run for: ${targetUrl}`);
  console.log(`➡  POST ${url}`);
  if (useCiEndpoint) {
    console.log('🔒 Using CI endpoint with Bearer TESTSPHERE_TOKEN');
  } else {
    console.log('🧪 Using open /api/run endpoint (local dev)');
  }

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (useCiEndpoint) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ url: targetUrl })
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!res.ok) {
      console.error('❌ Failed to trigger run:', res.status, data);
      process.exit(1);
    }

    console.log('✅ Run started:', data);
  } catch (err) {
    console.error('❌ Failed to trigger run:', err.message || err);
    process.exit(1);
  }
})();
