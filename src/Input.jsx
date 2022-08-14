import { useState } from "react";
import './Modal.css';
const Input = (props) => {
    const [amount, setAmount] = useState("");
    const [nftId, setNftId] = useState("");
    const [nftAddress, setNftAddress] = useState("");
    const [loanClosingDuration, setLoanClosingDuration] = useState("");
    const [loanDuration, setLoanDuration] = useState("");

    if( !props.show ){
        return null;
    }

    return(
        <div className="modal" onClick={props.onClose} >
            <div className="modal-body" onClick={e => e.stopPropagation()} >
                <p>Fill the required information </p>
                <input placeholder="amount" type="number" value={amount} onChange = { (e) => setAmount(e.target.value) } />
                <input placeholder="nftAddress" value={nftAddress} onChange = { (e) => setNftAddress(e.target.value) } />
                <input placeholder="nftId" type="number" value={nftId} onChange = { (e) => setNftId(e.target.value) } />
                <input placeholder="loanClosingDuration" type="number" value={loanClosingDuration} onChange = { (e) => setLoanClosingDuration(e.target.value) } />
                <input placeholder="loanDuration" type="number" value={loanDuration} onChange = { (e) => setLoanDuration(e.target.value) } />
                <button onClick={
                    () => {
                            props.askForLoan(nftId, nftAddress, amount, loanClosingDuration, loanDuration)
                            props.onClose();
                    } } >Submit</button>

            </div>
        </div>
    )
}
export default Input;