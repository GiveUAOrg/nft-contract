require('dotenv').config();
const hre = require("hardhat");

async function main() {
    const contract = await hre.ethers.getContractFactory("GiveUkraineOrg");
    const deployment = await contract.attach(process.env.CONTRACT_ADDRESS);
    const batchNumber = 10; // invalid input on purpose. Valid numbers are in [0, 4]
    const output = await deployment.reveal(batchNumber); 
    console.log(`Revealed batch ${batchNumber}`, output);
}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});