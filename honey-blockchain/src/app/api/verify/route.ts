import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

export async function GET(req: NextRequest) {
  const batchId = req.nextUrl.searchParams.get("id");

  if (!batchId) {
    return NextResponse.json({ error: "Missing batch ID" }, { status: 400 });
  }

  const client = new Client({
    host: "localhost",
    port: 5432,
    database: "honey_verification",
    user: "ahmedalshari",
  });

  try {
    await client.connect();
    const res = await client.query(
      "SELECT * FROM verify_honey WHERE batch_id = $1",
      [batchId]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    return NextResponse.json(res.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "DB query failed" }, { status: 500 });
  } finally {
    await client.end();
  }
}
