const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("CafecitoToken", () => {
    let owner;
    let alice;
    let bob;
    let carol;

    let token;
    let res;
    let minterBurner;

    before(async() => {
        [owner, alice, bob, carol] = await ethers.getSigners();
        const CafecitoToken = await ethers.getContractFactory("CafecitoToken");
        token = await CafecitoToken.deploy();
        minterBurner = await token.MINTER_BURNER_ROLE();
        await token.grantRole(minterBurner, alice.address)
    })

    describe("Init", async() => {
        it("should init", async() => {
            expect(token)
                .to.be.ok
        })

        it("has a name and symbol", async() => {
            res = await token.name()
            expect(res)
                .to.eq("CafecitoSwap")
            
            res = await token.symbol()
            expect(res)
                .to.eq("CAFE")
        })
    })

    describe("Mint", async() => {
        let _hash = "Hash"
        let _metaHash = "MetaHash"

        it("should mint", async() => { 
            await token.connect(alice).mintCafecito(alice.address, _hash, _metaHash)
            expect(await token.getTokenCount())
                .to.eq(1)
            
            expect(await token.balanceOf(alice.address))
                .to.eq(1)
        })

        it("should return correct uri", async() => {
            res = await token.tokenURI(1)
            expect(res)
                .to.eq(_metaHash)
        })

        it("should revert for non-owner mint", async() => {
            await expect(token.connect(bob).mintCafecito(bob.address, "www.token"))
                .to.be.reverted
        })

        it("should revert same hash input", async() => {
            await expect(token.connect(alice).mintCafecito(alice.address, _hash, _metaHash))
                .to.be.revertedWith("Hash already in use")
        })

    })

    describe("Burn", async() => {
        it("should burn", async() => {
            await token.connect(alice).burnCafecito(1)
            expect(await token.balanceOf(alice.address))
                .to.eq(0)

            expect(await token.getTokenCount())
                .to.eq(0)
        })

        it("should revert for non-owner burn", async() => {
            await token.connect(alice).mintCafecito(alice.address, "something", "something")
            await expect(token.connect(bob).burnCafecito(1))
                .to.be.reverted
        })
    })
})