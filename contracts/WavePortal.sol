// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0; // version should be similar to what is written in hardhat.config.js

import "hardhat/console.sol"; 

contract WavePortal {
    // state variable stored permanently on blockchain
    uint256 totalWaves;

    constructor() {
        console.log("Hello world, this is the first smart contract I've built"); 
    }

    function wave() public {
        totalWaves += 1; 
        console.log("%s has waved",msg.sender); // wallet address who is calling the wave function
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!",totalWaves); 
        return totalWaves; 
    }
}