require('dotenv').config();
const hre = require("hardhat");

async function main() {
    const contract = await hre.ethers.getContractFactory("GiveUkraineOrg");
    const deployment = await contract.attach(process.env.CONTRACT_ADDRESS);
    const output = await deployment.setContractURI(process.env.CONTRACT_URL);
    // const output = await deployment.setBaseURI(0, process.env.BASE_URL_0);
    // const output = await deployment.setBaseURI(1, process.env.BASE_URL_1);
    // const output = await deployment.setBaseURI(2, process.env.BASE_URL_2);
    // const output = await deployment.setBaseURI(3, process.env.BASE_URL_3);
    // const output = await deployment.setBaseURI(4, process.env.BASE_URL_4);
    console.log("URL set", output);
}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});