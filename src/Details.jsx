import './App.css';
import {useState} from "react";
import Fulldetails from './FullDetails';

const Details = (props) => {
    
    //State 
    const [showFull, setShowFull]= useState(false)
    const [modalData, setModalData] = useState(null);
    
    let details = props.details;
    let openLoans = details.filter(detail => detail.status == 0);
    let yourLoans = details.filter(
        detail => detail.borrowerAddress.toLowerCase() == props.userAccount.toLowerCase()
        // && 
        // detail => detail.lender.toLowerCase() == props.userAccount.toLowerCase()
        )
   let crctDetail;

    if(props.dropDownValue == 1){
        crctDetail = openLoans;
    }else{
        crctDetail = yourLoans;
    }
    
    
    const modalHandler = (detail) => {
            setShowFull(true)
            setModalData(detail)
    }

    const lendMoney = async(key) => {
        try{
            console.log(key);
            let contract = await props.connectToContract();
            const tx = await contract.lendMoney(key);
            await tx.wait();
            await props.getDetails();
        }catch(_error){
            props.setError(_error.message);
            props.setShowError(true)
        }
    }

    const repayLoan = async(key) => {
        try{
            let contract = await props.connectToContract();
            const tx = await contract.repayLoan(key);
            await tx.wait();
            await props.getDetails();
        }catch(_error){
            props.setError(_error.message);
            props.setShowError(true)
        }
    }

    const closeBorrowRequest = async(key) => {
        try{
            let contract = await props.connectToContract();
            const tx = await contract.closeBorrowRequest(key);
            await tx.wait();
            await props.getDetails();
        }catch(_error){
            props.setError(_error.message);
            props.setShowError(true)
        }
    }

    const ceaseNft = async(key) => {
        try{
            let contract = await props.connectToContract();
            const tx = await contract.ceaseNft(key);
            await tx.wait();
            await props.getDetails();
        }catch(_error){
            props.setError(_error.message);
            props.setShowError(true)
        }
    }

    
    //UI
    return(
        <div className='Details' >
            {/* {!details (
                <div>
                    <h1>
                        No Active loans
                    </h1>
                </div>
            )} */}

            {crctDetail.map(  (detail, key) => {
                let isBorrowerSame = detail.borrowerAddress.toLowerCase() == props.userAccount.toLowerCase();
                let isLenderSame = detail.lenderAddress.toLowerCase() == props.userAccount.toLowerCase();
                let loanStatus;
                if(detail.status === 0){
                    loanStatus = "for loan✔️"
                    // if(detail.loanDurationEndTimestamp < now){
                    //     change into status 2 expired
                    // }
                    
                }else if(detail.status === 1){
                    loanStatus = "loaned💰"
                }else{
                    loanStatus = "closed❌"
                }

                let _loanEnd = new Date(detail.loaningTimeEndTimestamp.toNumber() * 1000 );
                let loanEndDate = _loanEnd.toLocaleDateString().substring(0,3);

                let _loanDurationEndDate = new Date(detail.loanDurationEndTimestamp.toNumber() * 1000 );
                let loanDurationEndDate = _loanDurationEndDate.toLocaleDateString().substring(0,3);


                return(
                    <div className="detail" key={key}>
                        <h3>Status: {loanStatus}</h3>
                        <p>amount: {detail.amount.toNumber()} wei</p>
                        <p>nftAddress: {detail.nftAddress.substring(0,5)}</p>
                        {detail.status === 0 && (
                            <div>
                                <p>loan open till: {loanEndDate} </p>
                                <p>loanDuration: {detail.loanDuration.toNumber()} mins </p>
                            </div>
                        )}
                        {detail.status === 1 && (
                            <div>
                                <p>loanDurationEndTimestamp: {loanDurationEndDate} </p>
                                <p>Loan Duration: {detail.loanDuration.toNumber()} mins </p>
                            </div>
                        )}
                        <p>Borrower Address: {detail.borrowerAddress.substring(0,5)}</p>    
                        <button className='btn' onClick={() => modalHandler(detail)}>View full details</button>  
                        < Fulldetails onClose={() => setShowFull(false)}  detail = {modalData} show = {showFull} />
                        {
                            isBorrowerSame && (
                                <div>
                                    {
                                        detail.status === 0 && (
                                            <div>
                                                <button className='btn' onClick = {() => closeBorrowRequest(detail.loanid)}> Close Request </button>
                                            </div>
                                        )
                                    }

                                    {
                                        detail.status === 1 && (
                                            <div>
                                                <button className='btn' onClick = {() => repayLoan(detail.loanid)}> repay Loan</button>
                                            </div>
                                        )    
                                    }
                                </div>
                            )
                        }

                        {
                            !isBorrowerSame &&(
                                <div>
                                {
                                    detail.status === 0 && (
                                        <div>
                                            <button className='btn' onClick={() => lendMoney(detail.loanid)}>Lend Money</button>
                                        </div>
                                    )
                                }
                                </div>
                            )
                        }

                        {
                            isLenderSame &&(
                                <div>
                                    { detail.status === 1 &&(
                                        <div>
                                            <button className='btn'  onClick={() => ceaseNft(detail.loanid)} >Cease Nft</button>
                                        </div>
                                    )
                                   }
                                </div>
                            )
                        }
            
                    </div>
                ) 
            })
            }
        </div>
    )
}

export default Details