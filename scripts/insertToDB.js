const { Client } = require("pg");

// Connect to your DB
const client = new Client({
  host: "localhost",
  port: 5432,
  database: "honey_verification",
  user: "Keerthika", // Replace with your macOS username if needed
});

async function main() {
  await client.connect();

  // Sample data — replace with actual batch info from your app
  const batchData = {
    batch_id: "HNY2025-065",
    beekeeper_name: "Ahmed",
    harvest_date: "2025-08-13",
    flower_type: "Sidr",
    region: "Taiz",
    certificate_hash: "QmFakeHash1234567890",
    description: "Okay",
    qr_code_url: "http://localhost:3000/verify?id=HNY2025-065",
  };

  await client.query(
    `
  INSERT INTO verify_honey 
    (batch_id, beekeeper_name, harvest_date, flower_type, region, certificate_hash, description, qr_code_url, created_at)
  VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
  ON CONFLICT (batch_id) DO UPDATE SET 
    beekeeper_name = EXCLUDED.beekeeper_name,
    harvest_date = EXCLUDED.harvest_date,
    flower_type = EXCLUDED.flower_type,
    region = EXCLUDED.region,
    certificate_hash = EXCLUDED.certificate_hash,
    description = EXCLUDED.description,
    qr_code_url = EXCLUDED.qr_code_url,
    created_at = NOW();
`,
    [
      batchData.batch_id,
      batchData.beekeeper_name,
      batchData.harvest_date,
      batchData.flower_type,
      batchData.region,
      batchData.certificate_hash,
      batchData.description,
      batchData.qr_code_url,
    ]
  );
  console.log("✅ Honey batch inserted into PostgreSQL!");
  await client.end();
}

main().catch((err) => {
  console.error("❌ Error inserting batch:", err);
  client.end();
});
