/**
 * A gift for each team member and supporters for their contributions towards the project <3
 */
require('dotenv').config();
const hre = require("hardhat");
const giftAddresses = [];

async function main() {
    const contract = await hre.ethers.getContractFactory("GiveUkraineOrg");
    const deployment = await contract.attach(process.env.CONTRACT_ADDRESS);
    const output = await deployment.mintGifts(giftAddresses);
    console.log(`Minted ${giftAddresses.length} gift NFTs`, output);
}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});