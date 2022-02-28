const { expect } = require("chai");

describe("Account contract", function () {
  it("should receieve token and show balance", async function () {
    const accountContract = await ethers.getContractFactory("Account");
    const Account = await accountContract.deploy();
    const [sender] = await ethers.getSigners();
    const transaction = await sender.sendTransaction({
      to: Account.address,
      value: 50,
    });
    await transaction.wait();
    const balance = await Account.getBalance();
    expect(balance).to.equal(50);
  });
});
