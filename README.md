# 🍯 Honey Blockchain Verification System

A full-stack blockchain application for tracking and verifying honey batches using Ethereum smart contracts, PostgreSQL database, and Next.js web interface.

## Features

- **Smart Contract Integration**: Ethereum-based honey batch tracking
- **Real-time Event Processing**: Live blockchain event monitoring
- **Database Synchronization**: Automatic PostgreSQL integration
- **Web Interface**: Modern Next.js frontend
- **QR Code Generation**: Unique verification URLs for each batch
- **Multi-source Verification**: Check both database and blockchain

## Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **Git**
- **MetaMask** (for blockchain interaction)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd honey-blockchain
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd honey-blockchain
npm install
```

## 🗄️ Database Setup

### 1. Install PostgreSQL

**macOS:**

```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Windows:**

- Download PostgreSQL from https://www.postgresql.org/download/windows/
- Install with default settings
- PostgreSQL service will start automatically

### 2. Start PostgreSQL

```bash
# macOS (using Homebrew)
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
# PostgreSQL service starts automatically after installation
```

### 2. Create Database and User

```bash
# Connect to PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE honey_verification;
CREATE USER "Keerthika" WITH PASSWORD 'Keerthi1';
GRANT ALL PRIVILEGES ON DATABASE honey_verification TO "Keerthika";
\q
```

### 3. Create Table

```bash
# Connect to the database
psql -h localhost -U Keerthika -d honey_verification

# Create the table
CREATE TABLE verify_honey (
    id SERIAL PRIMARY KEY,
    batch_id VARCHAR(255) UNIQUE NOT NULL,
    beekeeper_name VARCHAR(255) NOT NULL,
    harvest_date DATE,
    flower_type VARCHAR(255) NOT NULL,
    description TEXT,
    region VARCHAR(255) NOT NULL,
    qr_code_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# Exit
\q
```

## Blockchain Setup

### 1. Start Local Blockchain

```bash
# Terminal 1: Start Hardhat node
npx hardhat node
```

### 2. Deploy Smart Contract

```bash
# Terminal 2: Deploy contract (one-time setup)
npx hardhat run scripts/deploy.js --network localhost
```

### 3. Start Event Listener

```bash
# Terminal 3: Start event listener
node scripts/listenAndInsert.js
```

## Web Application

### 1. Start Web Application

```bash
# Terminal 4: Navigate to frontend and start
cd honey-blockchain
npm run dev
```

### 2. Access Application

Open your browser and navigate to: `http://localhost:3000`

## Usage

### Adding Honey Batches

1. Go to `http://localhost:3000/add`
2. Connect your MetaMask wallet
3. Fill out the honey batch form:
   - **Beekeeper Name**: Your name
   - **Harvest Date**: When honey was harvested
   - **Flower Type**: Type of flowers (lavender, orange-blossom, etc.)
   - **Description**: Additional notes
   - **Region**: Geographic location
4. Click "Add Honey Batch"
5. Confirm the transaction in MetaMask
6. View success page with batch details

### Verifying Honey Batches

1. Go to `http://localhost:3000/verify`
2. Enter a batch ID (e.g., `HNY2025-001`)
3. Click "Verify"
4. View verification results:
   - **Authenticity**: Whether the batch exists
   - **Details**: Beekeeper, region, flower type, etc.
   - **Blockchain Status**: Transaction hash and verification

## Database Management

### View All Records

```bash
psql -h localhost -U Keerthika -d honey_verification -c "SELECT * FROM verify_honey ORDER BY created_at DESC;"
```

### View Latest Records

```bash
psql -h localhost -U Keerthika -d honey_verification -c "SELECT batch_id, beekeeper_name, flower_type, region, created_at FROM verify_honey ORDER BY created_at DESC LIMIT 5;"
```

### Count Records

```bash
psql -h localhost -U Keerthika -d honey_verification -c "SELECT COUNT(*) FROM verify_honey;"
```

### Clean Database (for presentations)

```bash
psql -h localhost -U Keerthika -d honey_verification -c "DELETE FROM verify_honey;"
```

## Project Structure

```
honey-blockchain/
├── contracts/                 # Smart contracts
│   ├── HoneyTracker.sol      # Main contract
│   └── Lock.sol              # Example contract
├── scripts/                   # Deployment and event scripts
│   ├── deploy.js             # Contract deployment
│   ├── listenAndInsert.js    # Event listener
│   └── insertToDB.js         # Database utilities
├── honey-blockchain/          # Next.js frontend
│   ├── src/
│   │   ├── app/              # Pages
│   │   ├── components/       # React components
│   │   └── lib/              # Utilities
│   └── public/               # Static assets
├── ignition/                  # Hardhat Ignition deployments
└── hardhat.config.ts         # Hardhat configuration
```

## Configuration

### Environment Variables

Create a `.env.local` file in the `honey-blockchain` directory:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=honey_verification
DB_USER=Keerthika
DB_PASS=Keerthi1

# Blockchain Configuration
HARDHAT_NETWORK_URL=http://127.0.0.1:8545
CHAIN_ID=31337
```

### Database Connection

The application automatically uses environment variables. If you need to update credentials, modify the `.env.local` file:

**Note**: The application now uses environment variables by default. The hardcoded fallbacks are only for development purposes.

### Smart Contract Address

The contract address is automatically updated in `honey-blockchain/src/lib/contract-address.json` after deployment.

## Troubleshooting

### Environment Variables Issues

**Error**: `Cannot read properties of undefined (reading 'DB_HOST')`
**Solution**: Create the `.env.local` file in the `honey-blockchain/` directory

**Error**: `password authentication failed for user "Keerthika"`
**Solution**:

1. Check if the user exists: `psql -U postgres -c "\du"`
2. Create user if missing: `CREATE USER "Keerthika" WITH PASSWORD 'Keerthi1';`
3. Grant permissions: `GRANT ALL PRIVILEGES ON DATABASE honey_verification TO "Keerthika";`

### Hardhat Node Issues

```bash
# Kill existing processes
pkill -f "hardhat"
# Restart
npx hardhat node
```

### Event Listener Issues

```bash
# Kill existing processes
pkill -f "listenAndInsert"
# Restart
node scripts/listenAndInsert.js
```

### Database Connection Issues

```bash
# Check PostgreSQL status
brew services list | grep postgresql
# Restart if needed
brew services restart postgresql
```

### Web Application Issues

```bash
# Clear Next.js cache
cd honey-blockchain
rm -rf .next
npm run dev
```

## Monitoring

### Real-time Events

Watch Terminal 3 for blockchain events:

```
Event received: 0x1234..., Beekeeper: John
Synced batch 0x1234... to PostgreSQL.
```

### Database Activity

Monitor database operations in the web application logs.

## Success Indicators

**Everything Working When:**

- Hardhat node shows accounts and is running
- Event listener shows "Listening for HoneyBatchCreated events..."
- Next.js shows "Ready" on localhost:3000
- Database queries return results
- Adding honey creates both blockchain and database records
- Verifying honey shows proper results

## API Endpoints

### POST /api/honey

Add honey batch to database

```json
{
  "batchId": "HNY2025-001",
  "beekeeperName": "John Doe",
  "harvestDate": "2025-01-15",
  "flowerType": "lavender",
  "description": "Premium quality",
  "region": "Yemen",
  "qrCodeUrl": "http://localhost:3000/verify?id=HNY2025-001"
}
```

### GET /api/honey?batchId=HNY2025-001

Retrieve honey batch from database

## Security Notes

- **Private Keys**: Never commit private keys to version control
- **Database**: Use strong passwords for production
- **Network**: Use test networks for development
- **MetaMask**: Always verify transactions before confirming

## ⚠️ Important Notes

### Current Database Credentials

The application currently has hardcoded database credentials in `honey-blockchain/src/app/api/honey/route.ts`:

- **User**: `Keerthika`
- **Password**: `newpassword`

**For production use:**

1. Remove hardcoded credentials
2. Use only environment variables
3. Use strong, unique passwords
4. Consider using connection pooling for better performance

## Technologies Used

- **Blockchain**: Ethereum, Hardhat, Ethers.js
- **Smart Contracts**: Solidity
- **Frontend**: Next.js, React, TypeScript
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS
- **Development**: Node.js

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review the logs for error messages
3. Ensure all services are running
4. Verify database connectivity
5. For cross-platform issues, check OS-specific database configurations

## 🚨 Current Project Status

### What's Working ✅

- Smart contract (`HoneyTracker.sol`) is properly implemented
- Hardhat configuration is set up correctly
- Next.js frontend is configured with all necessary dependencies
- Database schema is defined
- Event listener script is ready

### What Needs Attention ⚠️

1. **Environment Variables**: Create `.env.local` file in `honey-blockchain/` directory
2. **Database Setup**: PostgreSQL needs to be installed and configured
3. **Contract Deployment**: Smart contract needs to be deployed to local network
4. **Event Listener**: Script needs to be running to sync blockchain events to database

### Missing Environment File

The project expects a `.env.local` file in the `honey-blockchain/` directory. Create this file with the following content:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=honey_verification
DB_USER=Keerthika
DB_PASS=Keerthi1

# Blockchain Configuration
HARDHAT_NETWORK_URL=http://127.0.0.1:8545
CHAIN_ID=31337
```

### Quick Start Checklist

- [ ] Install PostgreSQL
- [ ] Create database and user (see Database Setup section)
- [ ] Create `.env.local` file with database credentials
- [ ] Start Hardhat node: `npx hardhat node`
- [ ] Deploy contract: `npx hardhat run scripts/deploy.js --network localhost`
- [ ] Start event listener: `node scripts/listenAndInsert.js`
- [ ] Start web app: `cd honey-blockchain && npm run dev`

## 🖥️ Cross-Platform Setup

### For Different Laptops/Presentations

**Before Presentation:**

1. **Install Prerequisites** on the new laptop:

   - Node.js (v18+)
   - PostgreSQL
   - Git

2. **Clone Repository:**

   ```bash
   git clone <repository-url>
   cd honey-blockchain
   ```

3. **Install Dependencies:**

   ```bash
   npm install
   cd honey-blockchain
   npm install
   ```

4. **Setup Database** (follow Database Setup section above)

5. **Create Environment File** - Create `honey-blockchain/.env.local`:

   ```bash
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=honey_verification
   DB_USER=Keerthika
   DB_PASS=Keerthi1
   ```

6. **Test Everything:**
   - Start Hardhat node
   - Deploy contract
   - Start event listener
   - Start web application
   - Test adding and verifying honey

### Quick Setup Script

Create a `setup.sh` (macOS/Linux) or `setup.bat` (Windows) for quick setup:

**setup.sh (macOS/Linux):**

```bash
#!/bin/bash
echo "Setting up Honey Blockchain System..."

# Install dependencies
npm install
cd honey-blockchain && npm install && cd ..

# Start PostgreSQL (macOS)
brew services start postgresql

# Create database and table
psql postgres -c "CREATE DATABASE honey_verification;"
psql postgres -c "CREATE USER \"Keerthika\" WITH PASSWORD 'Keerthi1';"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE honey_verification TO \"Keerthika\";"
psql -h localhost -U Keerthika -d honey_verification -c "CREATE TABLE verify_honey (id SERIAL PRIMARY KEY, batch_id VARCHAR(255) UNIQUE NOT NULL, beekeeper_name VARCHAR(255) NOT NULL, harvest_date DATE, flower_type VARCHAR(255) NOT NULL, description TEXT, region VARCHAR(255) NOT NULL, qr_code_url TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);"

echo "Setup complete! Start the services:"
echo "1. npx hardhat node"
echo "2. npx hardhat run scripts/deploy.js --network localhost"
echo "3. node scripts/listenAndInsert.js"
echo "4. cd honey-blockchain && npm run dev"
```

---

**Happy Honey Tracking! 🍯✨**
