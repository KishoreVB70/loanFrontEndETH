import './App.css';
//Components
import Input from "./Input"
import Details from "./Details"

//Hooks
import {useEffect, useState} from "react";

//Dependencies
import {ethers} from "ethers";

//Utils
import abi from "./utils/abi.json";
import nftAbi from "./utils/nftAbi.json"

function App() {
  //Variables
  let goerliAddress = "0x66eAb821ecb2A399850782FdfD7b1D8FF3Fc91c4";

  const [userAccount, setUserAccount] = useState();
  const [details, setDetails] = useState();
  const [userBalance, setUserBalance] = useState("");
  const [showModal,setShowModal ] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState();
  const [dropDownValue, setDropDownValue] = useState("1");


//<---------------------------------------------------------------------------------------------------------------------->
  const isWalletConnected = async() => {

    const {ethereum} = window;

    if(!ethereum){
      alert("Get a wallet");
      return;
    }

    const accounts = await ethereum.request( {method: "eth_accounts"} );
    if(accounts[0]){
      setUserAccount(accounts[0]);
      getDetails();
      getBalance(accounts);
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    let chainId = await provider.getNetwork()
    chainId = chainId.chainId;
    if(chainId !== 5){
      alert("Change network to goerli");
    }
  }
  
  useEffect( () => {
    isWalletConnected();
  }, []);

  window.ethereum.on('accountsChanged', function () {
    isWalletConnected();
  })
  
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
    const contract = new ethers.Contract(goerliAddress,abi.abi, signer);

    return contract;
  }

  const connectToNftContract = async(_nftAddress) => {
    const {ethereum} = window;
  
    if(!ethereum){
      alert("Get Metamask");
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(_nftAddress,nftAbi.abi, signer);

    return nftContract;
  }


  //Contract functions 
  const askForLoan = async( _nftId, _nftAddress, _amount, _loanClosingDuration, _loanDuration ) => {
    try{
      const nftContract = await connectToNftContract(_nftAddress);
      const nftTx = await nftContract.approve(goerliAddress, _nftId );
      await nftTx.wait();
      
      const contract = await connectToContract();
      const tx = await contract.askForLoan( _nftId, _nftAddress, _amount, _loanClosingDuration, _loanDuration);
      await tx.wait();

      getDetails();
    } catch(_error){
      setError(_error.message);
      setShowError(true)
    }
  }

//<---------------------------------------------------------------------------------------------------------------------->
//UI

  return (
    <div className="App" >
      <h1>NFT LOAN DAPP</h1>
      { !userAccount && (
        <div>
          <p>Connect your wallet to use the Dapp</p>
          <button className='bigBtn' onClick={connectToWallet}> Connect to wallet </button>
        </div>
      )} 

      {userAccount && (
        <div  className="chinnaApp">
          <div className='info'>
            <p>User Account: {userAccount.substring(0,5)}</p>
            <p>User Balance: {userBalance}</p>
          </div>
          <button className="askForLoan bigBtn" onClick={() => setShowModal(true)} >Ask for Loan</button>
          <select className='dropDown' value={dropDownValue} onChange={(e) => setDropDownValue(e.target.value)} >
            <option value="1">Open loans </option>
            <option value="2"> Your loans</option>
          </select>
          <Input onClose={() => setShowModal(false)} askForLoan =  {askForLoan} show={showModal} />
          {showError && (
          <div className="errorBox">
            <h1>
              Error!
            </h1>
            <p>{error}</p>
            <button onClick={() => setShowError(false)} >Clear error</button>
          </div>
          )}


          {!details && (
            <div>
              <p>Fetching the details</p>
            </div>
          )}
          {details && (
            <div>
              <Details setError={setError} setShowError ={setShowError} details = {details} connectToContract = {connectToContract} getDetails = {getDetails} userAccount = {userAccount} dropDownValue = {dropDownValue} />
            </div>
          )}
        </div>
        )}

    </div>
  );
}

export default App;
