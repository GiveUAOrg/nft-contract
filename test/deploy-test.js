const { expect } = require("chai");

describe("Deployment", function() {
    const notRevealedUri = "not-revealed-uri";
    let deployment;
    
    beforeEach("Deploy the contract", async function() {
        const contract = await hre.ethers.getContractFactory("GiveUkraineOrg");
        deployment = await contract.deploy(notRevealedUri);
        await deployment.deployed();
    });

    it("Deployed contract with correct not revealed URI", async function() {
        expect(await deployment.notRevealedURI()).to.equal(notRevealedUri);
    });

    it("Deployed contract with correct reveal state", async function() {
        for (let i = 0; i < 6; i++) {
            expect(await deployment.revealed(i)).to.equal(false);
        }
    });
  
});