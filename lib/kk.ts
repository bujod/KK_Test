type HeaderMap = Record<string, string>;

const env = (name: string, fallback = "") => process.env[name] ?? fallback;

let upstreamCookie = "";

function buildHeaders(): HeaderMap {
  const h: HeaderMap = {
    accept: "application/json",
    "accept-encoding": "gzip",
    "accept-language": env("KK_ACCEPT_LANGUAGE", "zh-cn"),
    "content-type": "application/json",
    appid: env("KK_APP_ID", "kopikenangan"),
    language: env("KK_LANGUAGE", "id"),
    timezone: env("KK_TIMEZONE", "25200"),
    devicetype: env("KK_DEVICETYPE", "Android"),
    version: env("KK_VERSION", "126.09.22"),
    versioncode: env("KK_VERSIONCODE", "385"),
    islogin: env("KK_IS_LOGIN", "true"),
    supportsharebuy: env("KK_SUPPORT_SHAREBUY", "true"),
    supportwaitingroom: env("KK_SUPPORT_WAITING_ROOM", "true"),
    ant_support: env("KK_ANT_SUPPORT", "true"),
    gopay_v2: env("KK_GOPAY_V2", "true"),
    gopay_v3: env("KK_GOPAY_V3", "true"),
    sign_version: env("KK_SIGN_VERSION", "256"),
    "user-agent": env("KK_USER_AGENT", "Dart/3.12 (dart:io)")
  };

  const optional: Record<string, string | undefined> = {
    authorization: process.env.KK_AUTHORIZATION,
    clsignature: process.env.KK_CLSIGNATURE,
    wtoken: process.env.KK_WTOKEN,
    "x-admit-token": process.env.KK_X_ADMIT_TOKEN,
    deviceid: process.env.KK_DEVICE_ID,
    advertising_d: process.env.KK_ADVERTISING_ID,
    appsflyer_id: process.env.KK_APPSFLYER_ID
  };

  for (const [k, v] of Object.entries(optional)) {
    if (v) h[k] = v;
  }

  const configuredCookie = process.env.KK_COOKIE?.trim();
  if (configuredCookie) h.cookie = configuredCookie;
  else if (upstreamCookie) h.cookie = upstreamCookie;

  const extraRaw = env("KK_EXTRA_HEADERS");
  if (extraRaw) {
    const extra = JSON.parse(extraRaw) as Record<string, unknown>;
    for (const [k, v] of Object.entries(extra)) {
      if (v !== null && v !== undefined && String(v) !== "") h[k.toLowerCase()] = String(v);
    }
  }
  return h;
}

function rememberSetCookie(response: Response) {
  const value = response.headers.get("set-cookie");
  if (!value) return;
  const first = value.split(",")[0].split(";")[0].trim();
  if (first) upstreamCookie = first;
}

export async function kkPost<T>(url: string, body: unknown): Promise<{status: number; data: T; headers: Record<string,string>}> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(body),
      cache: "no-store",
      signal: controller.signal
    });

    rememberSetCookie(response);
    const text = await response.text();
    let parsed: any = null;
    try { parsed = text ? JSON.parse(text) : null; } catch {}

    const responseHeaders: Record<string,string> = {};
    for (const [k,v] of response.headers.entries()) responseHeaders[k] = v;

    if (!response.ok) {
      const preview = text.replace(/\s+/g, " ").slice(0, 500);
      throw new Error(`Upstream HTTP ${response.status}: ${preview}`);
    }

    return { status: response.status, data: parsed as T, headers: responseHeaders };
  } finally {
    clearTimeout(timer);
  }
}

export function storesBody(page: number, pageSize: number) {
  return {
    fuzzy_name: "",
    lat: Number(env("KK_LAT", "-7.7206928")),
    lng: Number(env("KK_LNG", "110.4540282")),
    deliverable: 0,
    order_type: [],
    page: { page_index: page, page_size: pageSize },
    brand_codes: [],
    disable_delivery_distance_limit: true
  };
}

export function menuBody(storeCode: string) {
  return {
    store_code: storeCode,
    voucher_code: null,
    product_without_promo: true,
    display_combo_v2: true,
    for_shipping: false,
    display_merchandise_product: true,
    display_mix_match_optional: true,
    support_discount_percentage: true,
    support_group_base_sku_percentage: true
  };
}

export const storesUrl = () => env("KK_STORES_URL", "https://apps.kopikenangan.com/kk-api-kopikenangan/api/store/query_pageable_store");
export const menuUrl = () => env("KK_MENU_URL", "https://apps.kopikenangan.com/kk-api-kopikenangan/api/product/query_product_menu");
