const { expect } = require("chai");

describe("Transfer", function() {
    const tokenNum = 2;
    let deployment;
    let owner;
    let addr1;
    let addr2;

    beforeEach("Deploy the contract", async function() {
        owner = await ethers.getSigner(0);
        addr1 = await ethers.getSigner(1);
        addr2 = await ethers.getSigner(2);
        
        const contract = await hre.ethers.getContractFactory("GiveUkraineOrg");
        deployment = await contract.deploy("");
        await deployment.deployed();

        await deployment.donateAndMint(1, { value: ethers.utils.parseEther(`${0.03}`) });
        await deployment.donateAndMint(1, { value: ethers.utils.parseEther(`${0.03}`) });
    });

    it("Transfer token from owner works", async function() {
        await deployment.transferFrom(owner.address, addr2.address, tokenNum);

        expect(await deployment.ownerOf(tokenNum)).to.equal(addr2.address);
    });

    it("Transfer token from not owner fails", async function() {
        const [owner, addr1] = await ethers.getSigners();

        await expect(
            deployment.connect(owner).transferFrom(addr1.address, addr2.address, tokenNum)
        ).to.be.revertedWith('ERC721: transfer from incorrect owner');
    });

    it("Transfer token from not approver fails", async function() {
        const [owner, addr1] = await ethers.getSigners();

        await expect(
            deployment.connect(addr1).transferFrom(addr1.address, addr2.address, tokenNum)
        ).to.be.revertedWith('ERC721: transfer caller is not owner nor approved');
    });
  
});