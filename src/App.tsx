import { useEffect, useState } from 'react';
import './App.css';
import {useHistory} from 'react-router-dom'
import useApi from './hooks/api';
import Button from './components/button';
import ProgressModal from './components/progressModal';
import Footer from './components/footer';

function App() {
  const [url, setUrl] = useState("")
  const {isLoading, result, error, sendRequest} = useApi<any>()
  const history = useHistory()

  const fetchData = () =>{
    history.push(`video?url=${url}`)
  }

  return (
    <div className="index">
      
      <div id="card">
        <h3>Enter Youtube URL</h3>
        <input onChange={(evt) => setUrl(evt.target.value)} type="url" value={url} placeholder="e.g https://youtube.com/watch?ods77sadx" />
        <Button disabled={isLoading} onPress={fetchData} text="I'm driving" />
      </div>

      <Footer />

      {isLoading && <ProgressModal text="LMAO" />}
    </div>
  );
}

export default App;
