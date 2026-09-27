# kk-store-menu-fixed-v5

Next.js server-side proxy for the Kopi Kenangan upstream API.

## Important

This project deliberately does **not** ship active Authorization/WToken/ClSignature/X-Admit credentials inside the ZIP. Those values are session/request material and can expire or change. Put a fresh capture into `.env.local`.

The supplied HAR/text evidence shows successful requests using app version `126.09.22` / versioncode `385`, while older requests used `126.09.11` / `383`. The successful request also returned `Set-Cookie: acw_tc=...`.

## Run

```bash
npm install
copy .env.local.example .env.local
# edit .env.local
npm run dev
```

Then:

- `GET /api/upstream/stores?page=1&pageSize=10`
- `POST /api/upstream/menu` with `{"storeCode":"YYK.AMSPRKG"}`
- `npm run check`

The server automatically remembers a `Set-Cookie` returned by the upstream process and sends it on later requests. It does not expose upstream credentials to the browser.

## Fresh capture workflow

1. Open HTTP Toolkit.
2. Perform a fresh store request in the official app.
3. Confirm it is `200 OK`.
4. Copy the CURRENT values of:
   - `authorization`
   - `clsignature`
   - `wtoken`
   - `x-admit-token`
   - `deviceid`
   - `advertising_d`
   - `appsflyer_id`
   - `version`
   - `versioncode`
5. Put them in `.env.local`.
6. Restart the Next.js server.
7. Run `npm run check`.

Do not commit `.env.local`.
