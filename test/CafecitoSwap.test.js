const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("CafecitoSwap", () => {
    let res;
    let curve;
    let curve2;
    let curve3;
    let initCost1 = ethers.utils.parseEther(".00001");
    let initCost2 = ethers.utils.parseEther("10");
    let initCost3 = ethers.utils.parseEther(".01");
    let arr1 = [2, 0, 1, 10, 3, 0, 0, 1, 20, 2, 0, 1, 50];
    let arr2 = [3, 1, 0, 0, 10000000];
    let arr3 = [1, 10, 1000];
    let params1 = [initCost1, arr1];
    let params2 = [initCost2, arr2];
    let params3 = [initCost3, arr3];

    let owner;
    let alice;
    let bob;
    let carol;


    before(async() => {
        [owner, alice, bob, carol] = await ethers.getSigners();
        
        const CafecitoCurve = await ethers.getContractFactory("CafecitoCurve");
        const CafecitoToken = await ethers.getContractFactory("CafecitoToken");
        const CafecitoSwap = await ethers.getContractFactory("CafecitoSwap");

        curve = await CafecitoCurve.deploy(...params2);
        token = await CafecitoToken.deploy();
        main = await CafecitoSwap.deploy(curve.address,token.address);

        minterBurner = await token.MINTER_BURNER_ROLE();
        await token.grantRole(minterBurner, main.address)


    })

    describe("init",async () =>{
        it("DEPLOY",async() =>{
            expect(curve).to.be.ok;
            expect(token).to.be.ok;
            expect(main).to.be.ok;
        })

    })

    describe("mint",async () =>{
        it("mints",async() =>{
            let _hash = "Hash"
        let _metaHash = "MetaHash"
            let config = { value: ethers.utils.parseEther("10") }

        let mintReturn = await main.connect(alice).mint(alice.address, _hash, _metaHash, config)
        expect(await token.getTokenCount())
                .to.eq(1)
            
            expect(await token.balanceOf(alice.address))
                .to.eq(1)

        })

        it("reverts when not enogh funds",async() =>{
            let _hash = "Hash"
        let _metaHash = "MetaHash"
            let config = { value: ethers.utils.parseEther(".000001") }

        await expect(main.connect(alice).mint(alice.address, _hash, _metaHash,config))
                .to.be.revertedWith("Not enough Ether")

        

        })

    })


    describe("Burn", async() => {
        it("should burn", async() => {

            let aliceBalStart = await ethers.provider.getBalance(alice.address);
            console.log("users eth balance before burn: ",ethers.utils.formatEther(aliceBalStart));
            await main.connect(alice).burn(1)
            expect(await token.balanceOf(alice.address))
                .to.eq(0)

            expect(await token.getTokenCount())
                .to.eq(0)

                let aliceBalEnd = await ethers.provider.getBalance(alice.address);
                console.log("users eth balance after burn: ",ethers.utils.formatEther(aliceBalEnd));
        })

        it("should revert for non-owner burn", async() => {
            let config = { value: ethers.utils.parseEther("10") }
            await main.connect(alice).mint(alice.address, "something", "something",config)
            await expect(main.connect(bob).burn(1))
                .to.be.revertedWith("User does not own token")
        })
    })

})