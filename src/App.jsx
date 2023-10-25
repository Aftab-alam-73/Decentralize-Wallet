import React, { useEffect, useState } from "react";
import "./index.css";
import Web3 from "web3";
const App = () => {
  const [accounts,setAccounts] =useState([]);
  const [selectedAccount,setSelectedAccount] =useState("");
  const [balance,setBalance]=useState("");
  const [accountdetails,setAccountDetails] = useState({address:"",amount:0})
  const [transactionDetails,setTransactionDetails] = useState({block:0,from:"",to:"",gasUsed:0})
  const [toggle,setToggle]=useState(false);
  console.log("Account details",accountdetails)
  useEffect(()=>{
    const connect=async()=>{
      const web3=new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
      const accounts=await web3.eth.getAccounts();
      setAccounts(accounts);
     
    }
    connect();
  },[selectedAccount])
  useEffect(()=>{
    const fetchBalance=async()=>{
      const web3=new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
      const weibalance=await web3.eth.getBalance(selectedAccount)
      const Balance= web3.utils.fromWei(weibalance, "ether")
      setBalance(Balance);

    }
    fetchBalance();
  },[selectedAccount,transactionDetails.block])
  const handleclick=async(e)=>{
    e.preventDefault();
    console.log("enter")
    const web3=new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
    const amount= web3.utils.toWei(accountdetails.amount,"ether")
    // console.log(amount)
    await web3.eth.sendTransaction({
      from:selectedAccount,
      to:accountdetails.address,
      value:amount
    }).then((reciept)=>{
      console.log("Gas Used:",reciept.gasUsed)
      console.log("Block Number:",reciept.blockNumber)
      setTransactionDetails({...transactionDetails,block:reciept.blockNumber.toString(),from:reciept.from,to:reciept.to,gasUsed:reciept.gasUsed.toString()})
      setToggle(true)
    })
  }
  return (
    <div className="container">
      <div className="subContainer">
        <div className="top">
          <h3>👋 Welcome To Your Wallet</h3>
          <form className="form1">
            <label htmlFor="account">Select Account</label>
            <select name="" id="account" className="select" onChange={(e)=>setSelectedAccount(e.target.value)}>
              {
                 accounts.map((account,i) =>{
                  return  <option key={i}>{account}</option>
                 })
              }
             
             
            </select>
          </form>
          <p>Connected Account:{selectedAccount}</p>
          <p>Account Balance:{balance}</p>
          <p>Provider:Ganace</p>
          <form className="form">
            <label htmlFor="reciever">Enter Receiver Address</label>
            <input type="text" id="reciever" className="input" onChange={(e)=>setAccountDetails({...accountdetails,address:e.target.value})}/>
            <label htmlFor="sender">
              Enter Amount To Send (Ether)
            </label>
            <input type="text" id="sender" className="input" onChange={(e)=>setAccountDetails({...accountdetails,amount:e.target.value})}/>
            <button className="btn" onClick={handleclick}>Send</button>
          </form>
        </div>
        <div className="down">
          <h4>Json Response</h4>
         {toggle && <div>
            <p>Block Number :{transactionDetails.block}</p>
            <p>From :{transactionDetails.from}</p>
            <p>To :{transactionDetails.to}</p>
            <p>Gas Used :{transactionDetails.gasUsed}</p>
          </div>}
        </div>
      </div>
    </div>
  );
};

export default App;
