const { expect } = require("chai");

describe("Gift mints", function() {
    const GIFT_COUNT_PER_CALL = 6;
    let deployment;
    let owner;
    let addr1;
    let addr2;

    const getGiftAddresses = () => {
        const adddresses = [];
        for (let i = 0; i < GIFT_COUNT_PER_CALL; i++) {
            if (i % 2 == 0) adddresses.push(addr1.address);
            else adddresses.push(addr2.address);
        }
        return adddresses;
    }

    beforeEach("Deploy the contract", async function() {
        owner = await ethers.getSigner(0);
        addr1 = await ethers.getSigner(1);
        addr2 = await ethers.getSigner(2);
        const contract = await hre.ethers.getContractFactory("GiveUkraineOrg");
        deployment = await contract.deploy("");
        await deployment.deployed();
    });

    it("Gifting won't work for non-owner", async function() {
        await expect(
            deployment.connect(addr1).mintGifts([addr1.address])
        ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it("Gifting works for owner", async function() {
        await deployment.mintGifts(getGiftAddresses());

        expect(await deployment.ownerOf(1)).to.equal(addr1.address);
        expect(await deployment.ownerOf(2)).to.equal(addr2.address);
    });

    it("Gifting is limited to 24", async function() {
        // To avoid calling all 24 at once messing with the gas estimates chart
        for (let i = 0; i < 4; i++) {
            await deployment.mintGifts(getGiftAddresses());
        }
        
        await expect(
            deployment.mintGifts(getGiftAddresses())
        ).to.be.revertedWith('Ran out of gift tokens');
    });
  
});