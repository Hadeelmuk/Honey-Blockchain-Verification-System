import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

// PostgreSQL client setup
const db = new Client({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "honey_verification",
  user: process.env.DB_USER || "Keerthika",
  password: process.env.DB_PASS || "newpassword",
});

// Initialize database connection
async function initDB() {
  try {
    await db.connect();
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

// Initialize DB connection when the module loads
initDB();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      batchId,
      beekeeperName,
      harvestDate,
      flowerType,
      description,
      region,
      qrCodeUrl,
    } = body;

    // Validate required fields
    if (!batchId || !beekeeperName || !flowerType || !region) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert into database
    const insertQuery = `
      INSERT INTO verify_honey 
        (batch_id, beekeeper_name, harvest_date, flower_type, description, region, qr_code_url, created_at)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, NOW())
      ON CONFLICT (batch_id)
      DO UPDATE SET
        beekeeper_name = EXCLUDED.beekeeper_name,
        harvest_date = EXCLUDED.harvest_date,
        flower_type = EXCLUDED.flower_type,
        description = EXCLUDED.description,
        region = EXCLUDED.region,
        qr_code_url = EXCLUDED.qr_code_url,
        created_at = NOW()
      RETURNING *;
    `;

    const values = [
      batchId,
      beekeeperName,
      harvestDate || null,
      flowerType,
      description || "",
      region,
      qrCodeUrl || `http://localhost:3000/verify?id=${batchId}`,
    ];

    const result = await db.query(insertQuery, values);

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to save honey batch data" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get("batchId");
    const listAll = searchParams.get("listAll");
    const flowerType = searchParams.get("flowerType");
    const region = searchParams.get("region");
    const search = searchParams.get("search");
    const limit = searchParams.get("limit") || "50";
    const offset = searchParams.get("offset") || "0";

    // If batchId is provided, get a single batch
    if (batchId) {
      // Query database for batch data
      const query = `
        SELECT * FROM verify_honey 
        WHERE batch_id = $1
        ORDER BY created_at DESC 
        LIMIT 1
      `;

      const result = await db.query(query, [batchId]);

      if (result.rows.length === 0) {
        return NextResponse.json({ error: "Batch not found" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: result.rows[0],
      });
    }

    // If listAll is provided, get all batches with optional filtering
    if (listAll) {
      let query = `
        SELECT * FROM verify_honey 
        WHERE 1=1
      `;

      const queryParams = [];
      let paramIndex = 1;

      // Add filters if provided
      if (flowerType) {
        query += ` AND flower_type = $${paramIndex}`;
        queryParams.push(flowerType);
        paramIndex++;
      }

      if (region) {
        query += ` AND region = $${paramIndex}`;
        queryParams.push(region);
        paramIndex++;
      }

      // Add search filter if provided
      if (search) {
        query += ` AND (
          batch_id ILIKE $${paramIndex} OR 
          beekeeper_name ILIKE $${paramIndex} OR 
          description ILIKE $${paramIndex}
        )`;
        queryParams.push(`%${search}%`);
        paramIndex++;
      }

      // Add sorting, limit and offset
      query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${
        paramIndex + 1
      }`;
      queryParams.push(parseInt(limit), parseInt(offset));

      const result = await db.query(query, queryParams);

      // Get total count for pagination
      let countQuery = `
        SELECT COUNT(*) FROM verify_honey 
        WHERE 1=1
      `;

      const countParams = [];
      let countParamIndex = 1;

      if (flowerType) {
        countQuery += ` AND flower_type = $${countParamIndex}`;
        countParams.push(flowerType);
        countParamIndex++;
      }

      if (region) {
        countQuery += ` AND region = $${countParamIndex}`;
        countParams.push(region);
        countParamIndex++;
      }

      if (search) {
        countQuery += ` AND (
          batch_id ILIKE $${countParamIndex} OR 
          beekeeper_name ILIKE $${countParamIndex} OR 
          description ILIKE $${countParamIndex}
        )`;
        countParams.push(`%${search}%`);
        countParamIndex++;
      }

      const countResult = await db.query(countQuery, countParams);
      const totalCount = parseInt(countResult.rows[0].count);

      return NextResponse.json({
        success: true,
        data: result.rows,
        pagination: {
          total: totalCount,
          limit: parseInt(limit),
          offset: parseInt(offset),
        },
      });
    }

    // If neither batchId nor listAll is provided
    return NextResponse.json(
      { error: "Either batchId or listAll parameter is required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve honey batch data" },
      { status: 500 }
    );
  }
}
