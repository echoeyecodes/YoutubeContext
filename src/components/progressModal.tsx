import './css/modal.css';

function ProgressModal({text} : {text:string}) {
    return (
        <div id="modal">
            <p>Loading... Please wait!</p>
        </div>
    );
  }
  
  export default ProgressModal;