const { ethers } = require("hardhat");
const { parseEther } = ethers.utils;

const governorAddress="0x0165878A594ca255338adfa4d48449f69242Eb8F"
const tokenAddress="0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"
const ownerAddress="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
async function createProposal() {
  const governor = await ethers.getContractAt("MyGovernor", governorAddress);
  const token = await ethers.getContractAt("MyToken", tokenAddress);
  const owner = await ethers.getSigners();

  const tx = await governor.propose(
    [token.address],
    [0],
    [token.interface.encodeFunctionData("mint", [ownerAddress, parseEther("25000")])],
    "Give the owner more tokens!"
  );

  const receipt = await tx.wait();
  const event = receipt.events.find(x => x.event === 'ProposalCreated');
  const { proposalId } = event.args;

  // wait for the 1 block voting delay
  await hre.network.provider.send("evm_mine");
  
  await governor.state(proposalId);

  console.log(`ProposalId: ${proposalId}`)
}

createProposal();