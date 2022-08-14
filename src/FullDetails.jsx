import './Modal.css';
const Fulldetails = (props) => {
    if( !props.show ){
        return null;
    }
    let detail = props.detail;

    let _loanEnd = new Date(detail.loaningTimeEndTimestamp.toNumber() * 1000 );
    let loanEndTime = _loanEnd.toLocaleTimeString();
    let loanEndDate = _loanEnd.toLocaleDateString();

    let _loanDurationEndDate = new Date(detail.loanDurationEndTimestamp.toNumber() * 1000 );
    let loanDurationEndDate = _loanDurationEndDate.toLocaleDateString();
    let loanDurationEndTime = _loanDurationEndDate.toLocaleTimeString();

    return(
        <div className="modal" onClick={props.onClose} >
            <div className="modal-body" onClick={e => e.stopPropagation()} >
                <p>nftid: {detail.nftId.toNumber()}</p>
                <p>nftAddress: {detail.nftAddress}</p>
                <p>lender: {detail.lenderAddress}</p>
                <p>borrowerAddress: {detail.borrowerAddress}</p>
                {
                    detail.status === 0 &&(
                        <p>Open till: {loanEndTime} of {loanEndDate}</p>
                    )
                }
                {
                    detail.status === 1 && (
                        <p>Loan Duration till: {loanDurationEndTime} of {loanDurationEndDate}</p>
                    )
                }
            </div>
        </div>
    )
}

export default Fulldetails;