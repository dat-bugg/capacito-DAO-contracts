const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Calculate Cost", () => {
    let instance;

    before(async() => {
        [alice] = await ethers.getSigners();
        const CalculateCost = await ethers.getContractFactory("CalculateCost");
        instance = await CalculateCost.deploy();
    })

    describe("Init", async() => {
        it("should init", async() => {
            expect(instance).to.be.ok
        })
    })

    describe("costOfN", async() => {
        it("should return the correct value", async() => {
            let arr = [3, 1, 0, 0, 10000000]
            let cost = ethers.utils.parseEther(".00001") // $.30
            let res = await instance.costOfN(arr, 9999, 10000, cost)
            console.log(ethers.utils.formatEther(res.toString()))
        })

        it("should return correct value", async() => {
            let arr = [2, 0, 1, 10, 3, 0, 0, 1, 20, 2, 0, 1, 50]
            let cost = ethers.utils.parseEther(".00001") // $.30
            let res = await instance.costOfN(arr, 1, 1, cost)
            console.log(ethers.utils.formatEther(res.toString()))
        })
    })
})