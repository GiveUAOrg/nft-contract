require('dotenv').config();
const hre = require("hardhat");

async function main() {
    const contract = await hre.ethers.getContractFactory("GiveUkraineOrg");
    const deployment = await contract.deploy(process.env.NOT_REVEALED_URL);
    await deployment.deployed();
    console.log("Give Ukraine contract deployed to:", deployment.address);
}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});