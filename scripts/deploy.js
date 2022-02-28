const hre = require("hardhat");

async function main() {
  const Account = await hre.ethers.getContractFactory("Account");
  const account = await Account.deploy();

  await account.deployed();

  console.log("Address deployed to:", account.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
