import { useEffect, useState } from 'react';
import './App.css';
import {useHistory} from 'react-router-dom'
import useApi from './hooks/api';
import Button from './components/button';
import ProgressModal from './components/progressModal';
import Footer from './components/footer';

function App() {
  const [url, setUrl] = useState("")
  const [isDisabled, setIsDisabled] = useState(true)
  const history = useHistory()

  const fetchData = () =>{
    history.push(`video?url=${url}`)
  }

  useEffect(() =>{

    if(url == ""){
      return setIsDisabled(true)
    }
    setIsDisabled(false)
  }, [url])

  return (
    <div className="index">
      
      <div id="card">
        <h3>Enter Youtube URL</h3>
        <input onChange={(evt) => setUrl(evt.target.value)} type="url" value={url} placeholder="e.g https://youtube.com/watch?ods77sadx" />
        <Button disabled={isDisabled} onPress={fetchData} text="I'm driving" />
      </div>

      <Footer />
    </div>
  );
}

export default App;
