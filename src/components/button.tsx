import './css/button.css';

function Button({text, onPress, disabled} : {text:string, disabled: boolean, onPress:() => void}) {
    return (
        <button style={{
            opacity: disabled ? 0.5 : 1
        }} onClick={(evt) =>{
            if(!disabled){
                evt.preventDefault()
                onPress()
            }
        }} className="main-button">{text}</button>
    );
  }
  
  export default Button;