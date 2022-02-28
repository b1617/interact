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
      const [address, balance] = await Promise.all([
        signer.getAddress(),
        signer.getBalance(),
      ]);
      setAddress(address);
      setBalance(ethers.utils.formatEther(balance));
      getAccountBalance();
      setIsConnected(true);
    } else {
      alert("Please install metamask");
    }
  };

  const getAccountBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const addressContract = new ethers.Contract(
      AccountAddress,
      account.abi,
      provider
    );
    const balance = await addressContract.getBalance({ from: address });
    setAccountBalance(ethers.utils.formatEther(balance));
  };

  return (
    <div>
      {isConnected ? (
        <div>
          <p>{address}</p>
          <p>My balance : {balance} ETH</p>
          <p>Account balance : {accountBalance} ETH</p>
          <input placeholder="Ethers" type="number" name="value" />
          <br />
          <button>Send</button>
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
