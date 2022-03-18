const { expect } = require("chai");

describe("Mint", function() {
    let contract;
    let deployment;
    let owner;
    let user;

    beforeEach("Deploy the contract", async function() {
        owner =  await ethers.getSigner(0);
        user =  await ethers.getSigner(1);

        const contract = await hre.ethers.getContractFactory("GiveUkraineOrg");
        deployment = await contract.deploy("", "");
        await deployment.deployed();
    });

    it("Cannot mint with insufficient value (gas estimate)", async function() {
        await expect(
            deployment.connect(user).donateAndMint(1, { value: ethers.utils.parseEther("0.02") })
        ).to.be.revertedWith('Not enough ETH to mint!');
    });

    it("Can mint with correct value (gas estimate)", async function() {
        expect(
            await deployment.connect(user).donateAndMint(1, { value: ethers.utils.parseEther(`${0.024081991}`) })
        );
    });

    it("Can mint any number of times", async function() {
        for (let i = 0; i < 100; i++) {
            expect(
                await deployment.connect(user).donateAndMint(1, { value: ethers.utils.parseEther(`${0.024081991}`) })
            );
        }
    });

    it("Can mint multiple NFTs at once with correct value", async function() {
        expect(
            await deployment.connect(user).donateAndMint(10, { value: ethers.utils.parseEther(`${10 * 0.024081991}`) })
        );
    });

    it("Can mint with extra donation", async function() {
        expect(
            await deployment.connect(user).donateAndMint(1, { value: ethers.utils.parseEther(`${10.5}`) })
        );
    });
  
});