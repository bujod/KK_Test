import { NextRequest, NextResponse } from "next/server";
import { kkPost, storesBody, storesUrl } from "../../../../lib/kk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? "1"));
  const pageSize = Math.min(50, Math.max(1, Number(req.nextUrl.searchParams.get("pageSize") ?? "10")));

  try {
    const result = await kkPost<any>(storesUrl(), storesBody(page, pageSize));
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
