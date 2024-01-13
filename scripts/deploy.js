const { ethers } = require("hardhat");

async function main() {
  const [owner, otherAccount] = await ethers.getSigners();

  const transactionCount = await owner.getTransactionCount();

  // gets the address of the token before it is deployed
  const futureAddress = ethers.utils.getContractAddress({
    from: owner.address,
    nonce: transactionCount + 1
  });


  const MyGovernor = await ethers.getContractFactory("MyGovernor");
  const governor = await MyGovernor.deploy("0x19E059c9B1751aCeDd246f4212DF9fbb922FcE49");

  const MyToken = await ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy(governor.address);

  await token.delegate(governor.address);
  const balance = await token.balanceOf(governor.address);

  console.log(
    `Governor deployed to ${governor.address}`,
    `Token deployed to ${token.address}`,
    `${governor.address} balance: ${balance.toString()}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
