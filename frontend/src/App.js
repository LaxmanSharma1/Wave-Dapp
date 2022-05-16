import * as React from "react";
import { ethers } from "ethers";
import {useEffect,useState} from "react"; 
import './App.css';
import { EtherscanProvider } from "@ethersproject/providers";
import abi from "./utils/WavePortal.json"

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [message, setMessage] = useState(""); 
  const contractAddress = "0x91bfA4CB18ee7d6966D30D1dfFF960b5407F9458";
  const contractABI = abi.abi; 
  const checkIfWalletIsConnected = async () => {
    try{
      const { ethereum } = window; 
      if(!ethereum) {
        console.log("Please connect your metamask wallet"); 
      }
      else {
        console.log("We have ethereum object cool",ethereum); 
      }
      // user wallet can have many addresses and we are checking whether we are authorized to access any of those
      const accounts = await ethereum.request({method: "eth_accounts"});
  
      if(accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account", account); 
        setCurrentAccount(account); 
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }
  const connectWallet = async () => {
    try {
      const {ethereum} = window; 
      
      if(!ethereum) {
        alert("Get Metamask!"); 
        return; 
      }
      const accounts = await ethereum.request({method: "eth_requestAccounts"});
      console.log("connected",accounts[0]); 
      setCurrentAccount(accounts[0]);
    } catch(error) {
      console.log(error);
    }
  }
  const wave = async () => {
    try {
      const {ethereum} = window; 

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum); 
        const signer = provider.getSigner(); 
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer); 
        let count = await wavePortalContract.getTotalWaves(); 
        console.log("Total count of waves are....", count.toNumber());
        console.log(message);
        const waveTxn = await wavePortalContract.wave(message); 
        console.log("Mining...", waveTxn.hash); 

        await waveTxn.wait(); 
        console.log("Mined --", waveTxn.hash);
        setMessage("");

        count = await wavePortalContract.getTotalWaves();
        console.log("Total count of waves...", count.toNumber());
        await getAllWaves();

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error); 
    }
    
  }
  useEffect( () => {
    checkIfWalletIsConnected();
  }, [])
  useEffect( () => {
    getAllWaves();
  }, [])
  /*
   * All state property to store all waves
   */
  const [allWaves, setAllWaves] = useState([]);

  /*
   * Create a method that gets all waves from your contract
   */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();
        

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          I am Satoshi Nakamoto. Connect your wallet and Wave at me.
        </div>
        <input type="text"  value={message} className="messageBox" onChange={(e) => setMessage(e.target.value)} />
        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}
