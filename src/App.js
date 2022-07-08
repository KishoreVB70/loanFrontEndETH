import './App.css';
//Components
import Input from "./Input"
import Details from "./Details"

//Hooks
import {useEffect, useState} from "react";

//Dependencies
import {ethers} from "ethers";

//Utils
import abi from "./abi.json";
import nftAbi from "./nftAbi.json"

function App() {
  //Variables
  let ContractAddress = "0x0EA92e97f4E79aCEDD6666B59924C4Cb8cd32ccc";
  const [userAccount, setUserAccount] = useState();
  const [details, setDetails] = useState();
  const [userBalance, setUserBalance] = useState("");
  const [showModal,setShowModal ] = useState(false);


//<---------------------------------------------------------------------------------------------------------------------->
  const isWalletConnected = async() => {

    const {ethereum} = window;

    if(!ethereum){
      alert("Get a wallet");
      return;
    }

    const accounts = await ethereum.request( {method: "eth_accounts"} );
    if(accounts[0]){
      setUserAccount(accounts[0].substring(0,5));
      getDetails();
      getBalance(accounts);
    }

  }
  
  useEffect( () => {
    isWalletConnected();
  }, []);
  
  const connectToWallet = async() => {
    const {ethereum} = window;
    
    if(!ethereum){
      alert("Get Metamask");
      return;
    }
    
    let accounts =await ethereum.request( {method: "eth_requestAccounts"});
    
    setUserAccount(accounts[0]);
    console.log("connected to: ", accounts[0]);
    
    getDetails();
    getBalance(accounts);
  }
  
  //Helper functions
  const getDetails = async() => {
    let contract = await connectToContract();
    let loans = await contract.loanId();
    let details = [];
    for(let i =0; i < loans; i++){
      let _detail = await contract.getDetails(i);
      details.push(_detail);
    }
    setDetails(details);
  }
  
  const getBalance = async(accounts) => {
    const {ethereum} = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    //Getting user balance
    let balance = await provider.getBalance(accounts[0]);
    let balanceInInt = ethers.utils.formatEther(balance);
    setUserBalance(balanceInInt.substring(0,5));
  }

  const connectToContract = async() => {
    const {ethereum} = window;
    
    if(!ethereum){
      alert("Get Metamask");
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(ContractAddress,abi.abi, signer);
    return contract;
  
  }

  //Contract functions 
  const askForLoan = async( _nftId, _nftAddress, _amount, _loanClosingDuration, _loanDuration ) => {
    const {ethereum} = window;

    if(!ethereum){
      alert("Get Metamask");
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(_nftAddress,nftAbi.abi, signer);

    await nftContract.approve(ContractAddress, _nftId );

    const contract = await connectToContract();
    await contract.askForLoan( _nftId, _nftAddress, _amount, _loanClosingDuration, _loanDuration);

    getDetails();
  }

//<---------------------------------------------------------------------------------------------------------------------->
//UI

  return (
    <div className="App" >
      <h1>NFT LOAN DAPP</h1>
      { !userAccount && (
        <div>
          <button onClick={connectToWallet}> Connect to wallet </button>
        </div>
      )}

      {userAccount && (
        <div  className="chinnaApp">
          <div className='info'>
            <p>User Account: {userAccount}</p>
            <p>User Balance: {userBalance}</p>
          </div>
          <button onClick={() => setShowModal(true)} >Ask for Loan</button>
          <Input onClose={() => setShowModal(false)} askForLoan =  {askForLoan} show={showModal} />
          {details && (
            <div>
              <Details details = {details} connectToContract = {connectToContract} getDetails = {getDetails} userAccount = {userAccount} />
            </div>
          )}
        </div>
        )}

    </div>
  );
}

export default App;
