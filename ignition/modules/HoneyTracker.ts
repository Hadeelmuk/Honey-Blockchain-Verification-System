import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const HoneyTrackerModule = buildModule("HoneyTrackerModule", (m) => {
  const honeyTracker = m.contract("HoneyTracker");

  return { honeyTracker };
});

export default HoneyTrackerModule;