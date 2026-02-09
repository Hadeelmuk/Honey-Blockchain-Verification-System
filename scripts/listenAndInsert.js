// scripts/listenAndInsert.js

const { ethers } = require("ethers");
const { Client } = require("pg");
const path = require("path");
require("dotenv").config();

// Absolute paths to contract ABI and address
const HoneyTrackerABI = require(path.resolve(
  __dirname,
  "../honey-blockchain/src/lib/HoneyTrackerABI.json"
));
const contractAddress = require(path.resolve(
  __dirname,
  "../honey-blockchain/src/lib/contract-address.json"
)).HoneyTracker;

// Connect to local Hardhat JSON-RPC node
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Initialize contract instance
const contract = new ethers.Contract(
  contractAddress,
  HoneyTrackerABI,
  provider
);

// PostgreSQL client setup
const db = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

db.connect();
console.log("Listening for HoneyBatchCreated events...");

// Listen for HoneyBatchCreated event and sync to DB
contract.on(
  "HoneyBatchCreated",
  async (batchIdRaw, beekeeperName, farmer, timestamp, event) => {
    // Extract the actual batch ID from the Indexed object
    let batchId;

    if (batchIdRaw && batchIdRaw._isIndexed) {
      // For indexed parameters in ethers.js v6, the actual value is in the hash property
      // The hash contains the batch ID string
      batchId = batchIdRaw.hash;
    } else if (typeof batchIdRaw === "string") {
      batchId = batchIdRaw;
    } else if (batchIdRaw && typeof batchIdRaw.toString === "function") {
      batchId = batchIdRaw.toString();
    } else {
      console.error("Invalid batchIdRaw type:", typeof batchIdRaw, batchIdRaw);
      return;
    }

    console.log(`Event received: ${batchId}, Beekeeper: ${beekeeperName}`);

    try {
      const batch = await contract.getHoneyBatch(batchId);

      const harvestDate =
        batch.harvestDate && batch.harvestDate.trim() !== ""
          ? batch.harvestDate
          : null;

      const insertQuery = `
        INSERT INTO verify_honey 
          (batch_id, beekeeper_name, harvest_date, flower_type, description, region, qr_code_url, created_at)
        VALUES 
          ($1, $2, $3, $4, $5, $6, $7, NOW())
        ON CONFLICT (batch_id)
        DO NOTHING;
      `;

      const values = [
        batchId,
        batch.beekeeperName,
        harvestDate,
        batch.flowerType,
        batch.description,
        batch.region,
        `http://localhost:3000/verify?id=${batchId}`,
      ];

      await db.query(insertQuery, values);
      console.log(`Synced batch ${batchId} to PostgreSQL.`);
    } catch (err) {
      console.error("Error syncing batch:", err.message);
    }
  }
);
