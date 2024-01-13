const { ethers } = require("hardhat");

async function createProposal() {
  const deployValues = await deployFixture();
    const governor = await ethers.getContractAt("MyGovernor");
    const token = await ethers.getContractAt("MyToken");
    const owner = await ethers.getSigners();

    const tx = await governor.propose(
      [token.address],
      [0],
      [token.interface.encodeFunctionData("mint", [owner.address, parseEther("25000")])],
      "Give the owner more tokens!"
    );

    const receipt = await tx.wait();
    const event = receipt.events.find(x => x.event === 'ProposalCreated');
    const { proposalId } = event.args;

    // wait for the 1 block voting delay
    await hre.network.provider.send("evm_mine");

    console.log(`ProposalId: ${proposalId}`)
}