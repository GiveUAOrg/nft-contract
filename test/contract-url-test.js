const { expect } = require("chai");

describe("Contract Url", function() {
    const contractUri = "ipfs://contract-uri";
    const contractUriNew = "ipfs://contract-uri-new";
    const notRevealedUri = "ipfs://NOTMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuH1234aS/";
    const tokenNum = 2;

    let deployment;

    beforeEach("Deploy the contract", async function() {
        const contract = await hre.ethers.getContractFactory("GiveUkraineOrg");
        deployment = await contract.deploy(contractUri, notRevealedUri);
        await deployment.deployed();
    });

    it("Contract url from deploy (gas estimate)", async function() {
        expect(await deployment.contractURI()).to.equal(contractUri);
    });

    it("Contract url set correctly (gas estimate)", async function() {
        await deployment.setContractURI(contractUriNew);
        expect(await deployment.contractURI()).to.equal(contractUriNew);
    });

    it("Cannot update contract url after freeze (gas estimate)", async function() {
        await deployment.freezeURI();
        await expect(deployment.setContractURI(contractUriNew)).to.be.revertedWith("URIs are frozen. Can't update.");
    });
    
});