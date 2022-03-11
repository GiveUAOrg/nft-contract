require('dotenv').config();
const hre = require("hardhat");
const { BigNumber } = require("@ethersproject/bignumber");
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider);

async function main() {
    // The deployer account
    const deployer = web3.eth.accounts.privateKeyToAccount(
        process.env.DEPLOYER_PRIVATE_KEY
    );
    const provider = hre.ethers.provider;

    const balance = BigNumber.from(
        await provider.getBalance(deployer.address)
    );
    const { name, chainId } = await provider.getNetwork();
    
    console.log(`Balance of ${deployer.address} on { ${name}: ${chainId} } is: ${balance}`);
}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});