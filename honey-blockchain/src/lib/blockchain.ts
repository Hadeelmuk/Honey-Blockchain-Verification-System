import { ethers } from 'ethers';

// Your deployed contract address from Step 1
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

// Contract ABI - defines the functions we can call
const CONTRACT_ABI = [
  "function createHoneyBatch(string,string,string,string,string,string,string) external",
  "function getHoneyBatch(string) external view returns (string,string,string,string,string,string,address,uint256,bool)",
  "function verifyBatch(string) external view returns (bool)",
  "function farmerBatches(address,uint256) external view returns (string)",
  "function allBatchIds(uint256) external view returns (string)",
  "event HoneyBatchCreated(string indexed batchId, string beekeeperName, address indexed farmer, uint256 timestamp)"
];

export interface HoneyBatchData {
  beekeeperName: string;
  region: string;
  flowerType: string;
  harvestDate: string;
  description: string;
  displayId: string;
  farmer: string;
  timestamp: string;
  blockchainTxHash: string | null;
  exists: boolean;
}

export class BlockchainService {
  private contract: ethers.Contract | null = null;
  private signer: ethers.Signer | null = null;

  // Initialize the contract with the current wallet
  async initializeContract(): Promise<void> {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await provider.getSigner();
      
      // Check the current network (for logging only)
      const network = await provider.getNetwork();
      console.log('Current network:', network);
      
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
      console.log('Blockchain service initialized with contract');
    } catch (error) {
      console.error('Failed to initialize blockchain service:', error);
      throw error;
    }
  }

  async createHoneyBatch(batchData: Omit<HoneyBatchData, 'farmer' | 'timestamp' | 'blockchainTxHash' | 'exists'>): Promise<string> {
    // Initialize contract if not already done
    if (!this.contract || !this.signer) {
      await this.initializeContract();
    }

    if (!this.contract || !this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const tx = await this.contract.createHoneyBatch(
        batchData.displayId,
        batchData.beekeeperName,
        batchData.region,
        batchData.flowerType,
        batchData.harvestDate,
        batchData.description,
        batchData.displayId
      );

      console.log('Transaction sent:', tx.hash);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt.hash);
      
      return receipt.hash;
    } catch (error) {
      console.error('Failed to create honey batch:', error);
      throw error;
    }
  }

  async getHoneyBatch(batchId: string): Promise<HoneyBatchData | null> {
    if (!this.contract) {
      // If no contract connection, try to connect to a read-only provider
      const provider = new ethers.JsonRpcProvider('http://localhost:8545');
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    }

    try {
      const result = await this.contract.getHoneyBatch(batchId);
      
      if (!result[8]) { // exists flag
        return null;
      }

      return {
        beekeeperName: result[0],
        region: result[1],
        flowerType: result[2],
        harvestDate: result[3],
        description: result[4],
        displayId: result[5],
        farmer: result[6],
        timestamp: new Date(Number(result[7]) * 1000).toISOString(),
        blockchainTxHash: null, // We'll get this from events if needed
        exists: result[8]
      };
    } catch (error) {
      console.error('Failed to get honey batch:', error);
      return null;
    }
  }

  async verifyBatch(batchId: string): Promise<boolean> {
    if (!this.contract) {
      const provider = new ethers.JsonRpcProvider('http://localhost:8545');
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    }

    try {
      return await this.contract.verifyBatch(batchId);
    } catch (error) {
      console.error('Failed to verify batch:', error);
      return false;
    }
  }

  // Helper function to generate batch ID
  static generateBatchId(): string {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `HNY${year}-${randomNum}`;
  }

  // Helper function to get current network info
  async getCurrentNetwork(): Promise<{ name: string; chainId: bigint } | null> {
    if (typeof window.ethereum === 'undefined') {
      return null;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      return {
        name: network.name,
        chainId: network.chainId
      };
    } catch (error) {
      console.error('Failed to get network info:', error);
      return null;
    }
  }
}

// Create a singleton instance
export const blockchainService = new BlockchainService();