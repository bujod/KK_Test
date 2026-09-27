import { NextResponse } from "next/server";
import { kkPost, menuBody, menuUrl } from "../../../../lib/kk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const storeCode = String(body?.storeCode ?? "").trim();

  if (!storeCode) {
    return NextResponse.json({ ok: false, error: "storeCode wajib diisi" }, { status: 400 });
  }

  try {
    const result = await kkPost<any>(menuUrl(), menuBody(storeCode));
    return NextResponse.json({
      ok: true,
      status: result.status,
      data: result.data
    });
  } catch (e) {
    return NextResponse.json({
      ok: false,
      error: e instanceof Error ? e.message : String(e)
    }, { status: 502 });
  }
}
