import { ethers } from "hardhat";


async function main() {

    let curve;
    let token;
    let cafecito;
    let initCost2 = ethers.utils.parseEther("0.001");
    let arr2 = [3, 1, 0, 0, 10000000];
    let params2 = [initCost2, arr2];

    //let owner;

    const [owner] = await ethers.getSigners()
    console.log(`Deploying contracts with ${owner.address}`);

    const balance = await owner.getBalance();
    console.log(`Account balance: ${balance.toString()}`)

    const CafecitoCurve = await ethers.getContractFactory("CafecitoCurve");
    const CafecitoToken = await ethers.getContractFactory("CafecitoToken");
    const CafecitoSwap = await ethers.getContractFactory("CafecitoSwap");

    curve = await CafecitoCurve.deploy(...params2);
    console.log("CafecitoCurve address", curve.address);
    token = await CafecitoToken.deploy();
    console.log("CafecitoToken address", token.address);
    cafecito = await CafecitoSwap.deploy(curve.address,token.address);
    console.log("CafecitoSwap address", cafecito.address);

    let minterBurner = await token.MINTER_BURNER_ROLE();
    await token.grantRole(minterBurner, cafecito.address)
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error)
        process.exit(1)
    })