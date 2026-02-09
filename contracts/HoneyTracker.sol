// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract HoneyTracker {
    struct HoneyBatch {
        string beekeeperName;
        string region;
        string flowerType;
        string harvestDate;
        string description;
        string displayId;
        address farmer;
        uint256 timestamp;
        bool exists;
    }
    
    mapping(string => HoneyBatch) public honeyBatches;
    mapping(address => string[]) public farmerBatches;
    string[] public allBatchIds;
    
    event HoneyBatchCreated(
        string indexed batchId,
        string beekeeperName,
        address indexed farmer,
        uint256 timestamp
    );
    
    function createHoneyBatch(
        string memory _batchId,
        string memory _beekeeperName,
        string memory _region,
        string memory _flowerType,
        string memory _harvestDate,
        string memory _description,
        string memory _displayId
    ) public {
        require(bytes(_batchId).length > 0, "Batch ID cannot be empty");
        require(!honeyBatches[_batchId].exists, "Batch ID already exists");
        require(bytes(_beekeeperName).length > 0, "Beekeeper name required");
        
        HoneyBatch memory newBatch = HoneyBatch({
            beekeeperName: _beekeeperName,
            region: _region,
            flowerType: _flowerType,
            harvestDate: _harvestDate,
            description: _description,
            displayId: _displayId,
            farmer: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });
        
        honeyBatches[_batchId] = newBatch;
        farmerBatches[msg.sender].push(_batchId);
        allBatchIds.push(_batchId);
        
        emit HoneyBatchCreated(_batchId, _beekeeperName, msg.sender, block.timestamp);
    }
    
    function getHoneyBatch(string memory _batchId) public view returns (
        string memory beekeeperName,
        string memory region,
        string memory flowerType,
        string memory harvestDate,
        string memory description,
        string memory displayId,
        address farmer,
        uint256 timestamp,
        bool exists
    ) {
        HoneyBatch memory batch = honeyBatches[_batchId];
        return (
            batch.beekeeperName,
            batch.region,
            batch.flowerType,
            batch.harvestDate,
            batch.description,
            batch.displayId,
            batch.farmer,
            batch.timestamp,
            batch.exists
        );
    }
    
    function verifyBatch(string memory _batchId) public view returns (bool) {
        return honeyBatches[_batchId].exists;
    }
}