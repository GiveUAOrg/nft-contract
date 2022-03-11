const { expect } = require("chai");

describe("Ownership", function() {
    let deployment;

    beforeEach("Deploy the contract", async function() {
        const contract = await hre.ethers.getContractFactory("GiveUkraineOrg");
        deployment = await contract.deploy("");
        await deployment.deployed();
    });

    it("Deploy should set the owner correctly", async function() {
        const [owner] = await ethers.getSigners();

        expect(await deployment.owner()).to.equal(owner.address);
    });

    it("Can transfer the owner", async function() {
        const [_, addr1] = await ethers.getSigners();
        await deployment.transferOwnership(addr1.address);

        expect(await deployment.owner()).to.equal(addr1.address);
    });

    it("Can renounce the owner", async function() {
        await deployment.renounceOwnership();

        expect(await deployment.owner()).to.equal("0x0000000000000000000000000000000000000000");
    });
  
});