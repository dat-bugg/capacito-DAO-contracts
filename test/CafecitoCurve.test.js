const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("CafecitoCurve", () => {
    let res;
    let curve1;
    let curve2;
    let curve3;
    let initCost1 = ethers.utils.parseEther(".00001");
    let initCost2 = ethers.utils.parseEther("1");
    let initCost3 = ethers.utils.parseEther(".01");
    let arr1 = [2, 0, 1, 10, 3, 0, 0, 1, 20, 2, 0, 1, 50];
    let arr2 = [3, 1, 0, 0, 10000000];
    let arr3 = [1, 10, 1000];
    let params1 = [initCost1, arr1];
    let params2 = [initCost2, arr2];
    let params3 = [initCost3, arr3];

    before(async() => {
        [owner] = await ethers.getSigners();
        const CafecitoCurve = await ethers.getContractFactory("CafecitoCurve");

        curve1 = await CafecitoCurve.deploy(...params1);
        curve2 = await CafecitoCurve.deploy(...params2);
        curve3 = await CafecitoCurve.deploy(...params3);
    })

    describe("Init", async() => {
        it("should init", async() => {
            expect(curve1).to.be.ok
            expect(curve2).to.be.ok
            expect(curve3).to.be.ok
        })

        it("should return initCost", async() => {
            res = await curve1.initCost();
            expect(res)
                .to.eq(initCost1)
            
            res = await curve2.initCost();
            expect(res)
                .to.eq(initCost2)
            
            res = await curve3.initCost();
            expect(res)
                .to.eq(initCost3)
        })

        it("should return curve", async() => {
            // Curve1
            res = await curve1.getCurve();
            let newArr = [];
            for(let i = 0; i < res.length; i++){
                newArr.push(Number(res[i].toString()))
            }
            expect(...newArr)
                .to.eq(...arr1)

            // Curve2
            res = await curve2.getCurve();
            newArr = [];
            for(let i = 0; i < res.length; i++){
                newArr.push(Number(res[i].toString()))
            }
            expect(...newArr)
                .to.eq(...arr2)
            
            // Curve3
            res = await curve3.getCurve();
            newArr = [];
            for(let i = 0; i < res.length; i++){
                newArr.push(Number(res[i].toString()))
            }
            expect(...newArr)
                .to.eq(...arr3)
        })
    })

    describe("getCostAmount", async() => {
        it("should get cost amount of curve1", async() => {
            res = await curve1.getCostAmount(1, 1)
            expect(res)
                .to.eq(ethers.utils.parseEther(".00003"))
        })

        it("should get cost amount of curve2", async() => {
            res = await curve2.getCostAmount(1, 1)
            expect(res)
                .to.eq(ethers.utils.parseEther("2"))
        })

        it("should get cost amount of curve3", async() => {
            res = await curve3.getCostAmount(1, 1)
            expect(res.toString())
                .to.eq(ethers.utils.parseEther(".2"))
        })

    })

    describe("currentCost", async() => {
        it("should return current cost of curve1", async() => {
            res = await curve1.getCurrentCost(2)
            expect(res)
                .to.eq(ethers.utils.parseEther(".00002"))
        })

        it("should return current cost of curve2", async() => {
            res = await curve2.getCurrentCost(2)
            expect(res)
                .to.eq(ethers.utils.parseEther("1"))
        })

        it("should return current cost of curve3", async() => {
            res = await curve3.getCurrentCost(2)
            expect(res)
                .to.eq(ethers.utils.parseEther(".1"))
        })
    })

})