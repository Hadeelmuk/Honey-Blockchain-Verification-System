const { ethers } = require("hardhat");

async function main() {
  const hre = require("hardhat");

  const HoneyTracker = await hre.ethers.getContractFactory("HoneyTracker");
  const contract = await HoneyTracker.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("HoneyTracker deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
