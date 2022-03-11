const { expect } = require("chai");
const { BigNumber } = require("@ethersproject/bignumber");

const UKRAINE_ADDRESS = "0x165CD37b4C644C2921454429E7F9358d18A45e14";

describe("Donate", function() {
    let owner;
    let deployment;

    beforeEach("Deploy the contract", async function() {
        const contract = await hre.ethers.getContractFactory("GiveUkraineOrg");
        owner = await ethers.getSigner(0);
        deployment = await contract.deploy("");
        await deployment.deployed();
        await deployment.donateAndMint(1, { value: ethers.utils.parseEther(`${0.03}`) });
        await deployment.donateAndMint(1, { value: ethers.utils.parseEther(`${0.03}`) });
    });

    it("Donate gives all balance to Ukraine", async function() {
        const balanceBefore = BigNumber.from(await hre.ethers.provider.getBalance(UKRAINE_ADDRESS));
        const contractBalance = BigNumber.from(await hre.ethers.provider.getBalance(deployment.address));
        const expectedBalance = balanceBefore.add(contractBalance);
        
        await deployment.donate();
        const balanceAfter = await hre.ethers.provider.getBalance(UKRAINE_ADDRESS);

        expect(balanceAfter).to.equal(expectedBalance);
    });

});