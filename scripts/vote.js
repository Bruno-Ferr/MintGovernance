const { ethers } = require("hardhat");


const governorAddress="0x0165878A594ca255338adfa4d48449f69242Eb8F"
const proposalId = "88404003625323964717132095873218805211252921758754154615206208397937861021656"

async function Vote() {
  const governor = await ethers.getContractAt("MyGovernor", governorAddress);
  const tx = await governor.castVote(proposalId, 1);      
  const receipt = await tx.wait();
  const voteCastEvent = receipt.events.find(x => x.event === 'VoteCast');
  
  // wait for the 1 block voting period
  await hre.network.provider.send("evm_mine");

  console.log(`vote event: ${voteCastEvent}`);
}

Vote();