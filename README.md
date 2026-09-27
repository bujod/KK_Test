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
- `POST /api/upstream/stores` with the same JSON body as the Android `query_pageable_store` request
- `POST /api/upstream/menu` with `{"storeCode":"YYK.AMSPRKG"}`
- `npm run check`

The stores proxy accepts both its original GET interface and the Android-style POST interface; both call the upstream with POST. Upstream HTTP errors keep their status in the proxy response, so an upstream 405 is distinguishable from a local Next.js method error. The proxy does not automatically replay upstream `Set-Cookie`; the supplied Android captures send an empty cookie header despite receiving `acw_tc` cookies. Set `KK_COOKIE` only when a fresh capture confirms it is needed.

`WToken` and `ClSignature` are read as supplied request credentials. Their values change across successful captures, and this project does not implement or infer their generation or refresh algorithm. A stale capture may therefore stop working; refresh credentials only through a verified, supported source.

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
