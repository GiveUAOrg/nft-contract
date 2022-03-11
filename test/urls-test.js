const { expect } = require("chai");

describe("Urls", function() {
    const baseUri = "ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS/";
    const notRevealedUri = "ipfs://NOTMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuH1234aS/";
    const tokenNum = 2;

    let deployment;

    beforeEach("Deploy the contract", async function() {
        const contract = await hre.ethers.getContractFactory("GiveUkraineOrg");
        deployment = await contract.deploy(notRevealedUri);
        await deployment.deployed();
        await deployment.donateAndMint(1, { value: ethers.utils.parseEther(`${0.03}`) });
        await deployment.donateAndMint(1, { value: ethers.utils.parseEther(`${0.03}`) });
    });

    it("Set not revealed url", async function() {
        await deployment.setNotRevealedURI(notRevealedUri);
        expect(await deployment.notRevealedURI()).to.equal(notRevealedUri);
    });

    it("Baseurl state update", async function() {
        await deployment.setBaseURI(0, baseUri);
        expect(await deployment.baseURIs(0)).to.equal(baseUri);
    });

    it("Reveal state update", async function() {
        await deployment.reveal(1);
        expect(await deployment.revealed(1)).to.equal(true);
    });

    it("Token URI before reveal", async function() {
        await deployment.setBaseURI(0, baseUri);

        expect(await deployment.tokenURI(tokenNum)).to.equal(notRevealedUri);
    });

    it("Token URI after reveal", async function() {
        await deployment.setNotRevealedURI(notRevealedUri);
        await deployment.setBaseURI(0, baseUri);
        await deployment.reveal(0);

        expect(await deployment.tokenURI(tokenNum)).to.equal(`${baseUri}${tokenNum}.json`);
    });

    // Messing with gas report
    // it("Token URI of non revealed batch", async function() {
    //     await deployment.setBaseURI(0, baseUri);
    //     await deployment.reveal(0);

    //     // Need a lot of NFTs minted for this test
    //     for (let i = 0; i < 5 ; i++) {
    //         await deployment.donateAndMint(1000, { value: ethers.utils.parseEther(`${300}`) });
    //     }

    //     expect(await deployment.tokenURI(5000)).to.equal(notRevealedUri);
    // });
  
});