const base = process.env.CHECK_BASE_URL || "http://localhost:3000";
const r = await fetch(`${base}/api/upstream/stores?page=1&pageSize=10`);
const text = await r.text();
console.log(`HTTP ${r.status}`);
console.log(text.slice(0, 4000));
