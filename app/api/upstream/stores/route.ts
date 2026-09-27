import { NextRequest, NextResponse } from "next/server";
import { isStoreQueryBody, kkPost, storesBody, storesUrl, UpstreamError, type StoreQueryBody } from "../../../../lib/kk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function queryStores(body: StoreQueryBody) {
  try {
    const result = await kkPost<any>(storesUrl(), body);
    return NextResponse.json({
      ok: true,
      status: result.status,
      data: result.data
    });
  } catch (e) {
    return NextResponse.json({
      ok: false,
      error: e instanceof Error ? e.message : String(e)
    }, { status: e instanceof UpstreamError ? e.status : 502 });
  }
}

export async function GET(req: NextRequest) {
  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? "1"));
  const pageSize = Math.min(50, Math.max(1, Number(req.nextUrl.searchParams.get("pageSize") ?? "10")));
  return queryStores(storesBody(page, pageSize));
}

export async function POST(req: Request) {
  const body: unknown = await req.json().catch(() => null);
  if (!isStoreQueryBody(body)) {
    return NextResponse.json({
      ok: false,
      error: "Body query stores tidak valid"
    }, { status: 400 });
  }

  return queryStores(body);
}
