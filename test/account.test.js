const { expect } = require("chai");

describe("Account contract", function () {
  it("should receieve token and show balance", async function () {
    // On récupère le smart contract
    const accountContract = await ethers.getContractFactory("Account");
    // On déploie le smart contract
    const Account = await accountContract.deploy();
    // On récupère le compte d'un utilisateur
    const [sender] = await ethers.getSigners();
    // L'utilisateur nous envoie 50 ethers
    const transaction = await sender.sendTransaction({
      to: Account.address,
      value: 50,
    });
    await transaction.wait();
    // On récupère le solde de notre compte
    const balance = await Account.getBalance();
    // On vérifie qu'on a bien récu les 50 ethers pour valider le test
    expect(balance).to.equal(50);
  });
});
