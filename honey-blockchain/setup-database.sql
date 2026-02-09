-- Setup script for honey_verification database

-- Connect to the database
\c honey_verification;

-- Create the verify_honey table if it doesn't exist
CREATE TABLE IF NOT EXISTS verify_honey (
  id SERIAL PRIMARY KEY,
  batch_id VARCHAR(255) UNIQUE NOT NULL,
  beekeeper_name VARCHAR(255) NOT NULL,
  harvest_date DATE,
  flower_type VARCHAR(255) NOT NULL,
  description TEXT,
  region VARCHAR(255) NOT NULL,
  qr_code_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Grant permissions to the user
GRANT ALL PRIVILEGES ON TABLE verify_honey TO "Keerthika";
GRANT USAGE, SELECT ON SEQUENCE verify_honey_id_seq TO "Keerthika";