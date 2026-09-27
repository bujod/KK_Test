export default function Home() {
  return (
    <main style={{fontFamily:"system-ui",maxWidth:900,margin:"40px auto",padding:20}}>
      <h1>KK Store/Menu API Proxy</h1>
      <p>Server-side proxy sudah siap.</p>
      <ul>
        <li><code>GET /api/upstream/stores?page=1&amp;pageSize=10</code></li>
        <li><code>POST /api/upstream/menu</code> dengan JSON <code>{"{"}"storeCode":"YYK.AMSPRKG"{"}"}</code></li>
      </ul>
      <p>Credential upstream dibaca dari <code>.env.local</code> dan tidak dikirim ke browser.</p>
    </main>
  );
}
