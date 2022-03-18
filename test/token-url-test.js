const { expect } = require("chai");

describe("Token Urls", function() {
    const baseUri0 = "ipfs://BASE_URI_0/";
    const baseUri1 = "ipfs://BASE_URI_1/";
    const baseUri2 = "ipfs://BASE_URI_2/";
    const baseUri3 = "ipfs://BASE_URI_3/";
    const baseUri4 = "ipfs://BASE_URI_4/";
    const baseUri5 = "ipfs://BASE_URI_5/";
    const notRevealedUri = "ipfs://NOT_REVEALED_URL/";
    const notRevealedUriNew = "ipfs://NOT_REVEALED_URL_2/";
    const tokenNum = 2;

    let deployment;

    beforeEach("Deploy the contract", async function() {
        const contract = await hre.ethers.getContractFactory("GiveUkraineOrg");
        deployment = await contract.deploy("", notRevealedUri);
        await deployment.deployed();
        await deployment.donateAndMint(1, { value: ethers.utils.parseEther(`${0.03}`) });
        await deployment.donateAndMint(1, { value: ethers.utils.parseEther(`${0.03}`) });
    });

    it("Set not revealed url (gas estimate)", async function() {
        await deployment.setNotRevealedURI(notRevealedUriNew);
        expect(await deployment.notRevealedURI()).to.equal(notRevealedUriNew);
    });
    
    it("Set base url batch overflow fails (gas estimate)", async function() {
        await expect(deployment.setBaseURI(6, baseUri0)).to.be.revertedWith("Batch number overflow!");
    });

    it("Baseurl state update (gas estimate)", async function() {
        await deployment.setBaseURI(0, baseUri0);
        await deployment.setBaseURI(1, baseUri1);
        await deployment.setBaseURI(2, baseUri2);
        await deployment.setBaseURI(3, baseUri3);
        await deployment.setBaseURI(4, baseUri4);
        await deployment.setBaseURI(5, baseUri5);
        expect(await deployment.baseURIs(0)).to.equal(baseUri0);
        expect(await deployment.baseURIs(1)).to.equal(baseUri1);
        expect(await deployment.baseURIs(2)).to.equal(baseUri2);
        expect(await deployment.baseURIs(3)).to.equal(baseUri3);
        expect(await deployment.baseURIs(4)).to.equal(baseUri4);
        expect(await deployment.baseURIs(5)).to.equal(baseUri5);
    });

    it("Setting baseURI reveals only one batch (gas estimate)", async function() {
        await deployment.setBaseURI(0, baseUri0);
        expect(await deployment.revealed(0)).to.equal(true);
        expect(await deployment.revealed(1)).to.equal(false);
        expect(await deployment.revealed(2)).to.equal(false);
        expect(await deployment.revealed(3)).to.equal(false);
        expect(await deployment.revealed(4)).to.equal(false);
        expect(await deployment.revealed(5)).to.equal(false);
    });

    it("Setting baseURI reveals all batches (gas estimate)", async function() {
        await deployment.setBaseURI(0, baseUri0);
        await deployment.setBaseURI(1, baseUri1);
        await deployment.setBaseURI(2, baseUri2);
        await deployment.setBaseURI(3, baseUri3);
        await deployment.setBaseURI(4, baseUri4);
        await deployment.setBaseURI(5, baseUri5);
        expect(await deployment.revealed(0)).to.equal(true);
        expect(await deployment.revealed(1)).to.equal(true);
        expect(await deployment.revealed(2)).to.equal(true);
        expect(await deployment.revealed(3)).to.equal(true);
        expect(await deployment.revealed(4)).to.equal(true);
        expect(await deployment.revealed(5)).to.equal(true);
    });

    it("Token URI after reveal (gas estimate)", async function() {
        await deployment.setBaseURI(0, baseUri0);

        expect(await deployment.tokenURI(tokenNum)).to.equal(`${baseUri0}${tokenNum}.json`);
    });

    it("Token URI of not revealed batch", async function() {
        await deployment.setBaseURI(0, baseUri0);

        // Need a lot of NFTs minted for this test
        console.log(`Minting 5000 NFTs. This will take a while...`);
        for (let i = 0; i < 5 ; i++) {
            await deployment.donateAndMint(1000, { value: ethers.utils.parseEther(`${300}`) });
            console.log(`Minted ${i * 1000} NFTs`);
        }

        expect(await deployment.tokenURI(4199)).to.equal(`${baseUri0}4199.json`);
        expect(await deployment.tokenURI(4200)).to.equal(notRevealedUri);
    });

    it("Token URI of multiple batches", async function() {
        await deployment.setBaseURI(0, baseUri0);
        await deployment.setBaseURI(1, baseUri1);
        await deployment.setBaseURI(2, baseUri2);
        await deployment.setBaseURI(3, baseUri3);
        await deployment.setBaseURI(4, baseUri4);
        await deployment.setBaseURI(5, baseUri5);

        // This will take a long time so, let's be patient
        this.timeout(50000);

        // Need a lot of NFTs minted for this test
        console.log(`Minting all 24891 NFTs. This will take a while...`);
        for (let i = 0; i < 24 ; i++) {
            await deployment.donateAndMint(1000, { value: ethers.utils.parseEther(`${300}`) });
            console.log(`Minted ${i * 1000} NFTs`);
        }
        await deployment.donateAndMint(889, { value: ethers.utils.parseEther(`${300}`) }); // 2 minted in setup

        // Batch 0 extremes
        expect(await deployment.tokenURI(1)).to.equal(`${baseUri0}1.json`);
        expect(await deployment.tokenURI(4199)).to.equal(`${baseUri0}4199.json`);

        // Batch 1 extremes
        expect(await deployment.tokenURI(4200)).to.equal(`${baseUri1}4200.json`);
        expect(await deployment.tokenURI(8399)).to.equal(`${baseUri1}8399.json`);

        // Batch 2 extremes
        expect(await deployment.tokenURI(8400)).to.equal(`${baseUri2}8400.json`);
        expect(await deployment.tokenURI(12599)).to.equal(`${baseUri2}12599.json`);
        
        // Batch 3 extremes
        expect(await deployment.tokenURI(12600)).to.equal(`${baseUri3}12600.json`);
        expect(await deployment.tokenURI(16799)).to.equal(`${baseUri3}16799.json`);
        
        // Batch 4 extremes
        expect(await deployment.tokenURI(16800)).to.equal(`${baseUri4}16800.json`);
        expect(await deployment.tokenURI(20999)).to.equal(`${baseUri4}20999.json`);
        
        // Batch 5 extremes
        expect(await deployment.tokenURI(21000)).to.equal(`${baseUri5}21000.json`);
        expect(await deployment.tokenURI(24891)).to.equal(`${baseUri5}24891.json`);
    });

    it("Cannot update base url after freeze (gas estimate)", async function() {
        await deployment.freezeURI();
        await expect(deployment.setBaseURI(0, baseUri0)).to.be.revertedWith("URIs are frozen. Can't update.");
        await expect(deployment.setBaseURI(1, baseUri1)).to.be.revertedWith("URIs are frozen. Can't update.");
        await expect(deployment.setBaseURI(2, baseUri2)).to.be.revertedWith("URIs are frozen. Can't update.");
        await expect(deployment.setBaseURI(3, baseUri3)).to.be.revertedWith("URIs are frozen. Can't update.");
        await expect(deployment.setBaseURI(4, baseUri4)).to.be.revertedWith("URIs are frozen. Can't update.");
        await expect(deployment.setBaseURI(5, baseUri5)).to.be.revertedWith("URIs are frozen. Can't update.");
    });

    it("Cannot update not revealed url after freeze (gas estimate)", async function() {
        await deployment.freezeURI();
        await expect(deployment.setNotRevealedURI(notRevealedUri)).to.be.revertedWith("URIs are frozen. Can't update.");
    });
    
});