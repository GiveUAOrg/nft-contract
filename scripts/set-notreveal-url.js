require('dotenv').config();
const hre = require("hardhat");

async function main() {
    const contract = await hre.ethers.getContractFactory("GiveUkraineOrg");
    const deployment = await contract.attach(process.env.CONTRACT_ADDRESS);
    const output = await deployment.setNotRevealedURI(process.env.NOT_REVEALED_URL);
    console.log("Not revealed URL set", output);
}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});