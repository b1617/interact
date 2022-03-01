import { ethers } from "ethers";
import logo from "./assets/metamask.png";
import React, { useState, useEffect } from "react";
import account from "./artifacts/contracts/Account.sol/Account.json";

const AccountAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const App = () => {
  const [isMetamask, setIsMetamask] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [accountBalance, setAccountBalance] = useState(null);
  const [amountToTransfer, setAmountToTransfer] = useState(0);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setIsMetamask(true);
    }
  }, []);

  const onSignIn = async () => {
    if (isMetamask) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      getBalance(signer);
      setIsConnected(true);
    } else {
      alert("Please install metamask");
    }
  };

  const getBalance = async (signer) => {
    const [address, balance] = await Promise.all([
      signer.getAddress(),
      signer.getBalance(),
    ]);
    setAddress(address);
    setBalance(ethers.utils.formatEther(balance));
    getAccountBalance();
  };

  const getAccountBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const addressContract = new ethers.Contract(
      AccountAddress,
      account.abi,
      provider
    );
    const balance = await addressContract.getBalance();
    setAccountBalance(ethers.utils.formatEther(balance));
  };

  const onTransfer = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    try {
      const tx = {
        to: AccountAddress,
        value: ethers.utils.parseEther(amountToTransfer),
      };
      const transaction = await signer.sendTransaction(tx);
      await transaction.wait();
      getAccountBalance();
      getBalance(signer);
      setAmountToTransfer(0);
      alert("Transaction succeed");
    } catch (error) {
      alert("Error while transfering");
    }
  };

  return (
    <div>
      {isConnected ? (
        <div>
          <p>{address}</p>
          <p>My balance : {balance} ETH</p>
          <p>Account balance : {accountBalance} ETH</p>
          <input
            type="number"
            name="value"
            value={amountToTransfer}
            onChange={(e) => setAmountToTransfer(e.target.value)}
          />
          <br />
          <button disabled={amountToTransfer < 1} onClick={onTransfer}>
            Transfer
          </button>
        </div>
      ) : (
        <div>
          <img src={logo} />
          <button onClick={onSignIn}>Connect Metamask</button>
        </div>
      )}
    </div>
  );
};

export default App;
