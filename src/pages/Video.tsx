import { useEffect, useState } from 'react';
import Button from '../components/button';
import {useLocation, useHistory} from 'react-router-dom'
import './css/video.css';
import useApi from '../hooks/api';
import ProgressModal from '../components/progressModal';

type TimeProps = {
    value:string,
    name:"startTime" | "endTime"
}

type State = "FETCH" | "GRAB"

const YoutubeEmbed = ({ url } : {url:string}) => (
      <iframe
        src={`${url}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
      />
  );

function Video() {
    const [formFields, setFormFields] = useState({
        startTime: "00:00:00",
        endTime: "00:00:00"
    })
    const [state, setState] = useState<State>("FETCH")
    const [video, setVideo] = useState({
      downloadUrl:"",
      id:"",
      url: "",
      duration: 0
    })
    const {isLoading, result, error,resetState, sendRequest} = useApi<string | any>()
    const location = useLocation()

    const formatHHMMSS = (value:string) => {
      const [str1, str2, str3] = value.split(":");
  
      const val1 = Number(str1);
      const val2 = Number(str2);
      const val3 = Number(str3);
  
      if (!isNaN(val1) && isNaN(val2) && isNaN(val3)) {
        return val1;
      }
  
      if (!isNaN(val1) && !isNaN(val2) && isNaN(val3)) {
        return val1 * 60 + val2;
      }
  
      if (!isNaN(val1) && !isNaN(val2) && !isNaN(val3)) {
        return val1 * 60 * 60 + val2 * 60 + val3;
      }
  
      return 0;
    };

    const setTime = (props: TimeProps)=>{
        const time = formatHHMMSS(props.value)
        const timestamp = new Date(time * 1000).toISOString().substr(11, 8)
        setFormFields((prev) => Object.assign({}, prev, {[props.name]: timestamp}))
    }

    const setValue = (props: TimeProps)=>{
      setFormFields((prev) => Object.assign({}, prev, {[props.name]: props.value}))
  }

    const fetchData = (url:string) =>{
      setState("FETCH")
      sendRequest("GET", `?url=${url}`)
    }

    const sendData = () =>{
      if(!isLoading){
        setState("GRAB")
        sendRequest("POST", "", {
          startTime: formFields.startTime,
          endTime: formFields.endTime,
          url: video.downloadUrl,
          duration: video.duration
        })
      }
    }

    useEffect(() =>{

      if(result){
        if(state == "FETCH"){
          const duration = result.duration || 0

          const time = new Date(duration * 1000).toISOString().substr(11, 8)
          setVideo(result)
          setTime({name: "endTime", value: time})
          setState("GRAB")
        }else{
          window.open(result)
        }
        resetState()
      }
    }, [result])
  
    useEffect(() =>{
      if(error){
        alert(error.message)
        resetState()
      }
    }, [error])

    useEffect(() =>{
      const path = location.search.split("url=").pop() || ""
      fetchData(path)
    }, [])

  return(
  <div className="index">
    <div id="video">
      <YoutubeEmbed url={`https://www.youtube.com/embed/${video.id}`} />

      <div id="config">
          <p>Start Time:</p>
          <input onChange={(evt) => setValue({
              value: evt.target.value,
              name: "startTime"
          })} value={formFields.startTime} onBlur={(evt) => setTime({
              value: evt.target.value,
              name: "startTime"
          })} />
          
          <p>End Time:</p>
          <input onChange={(evt) => setValue({
              value: evt.target.value,
              name: "endTime"
          })} value={formFields.endTime} onBlur={(evt) => setTime({
              value: evt.target.value,
              name: "endTime"
          })} />
      </div>

      <Button onPress={sendData} disabled={(isLoading || state=="FETCH")} text="Get link" />
    </div>

    {isLoading && <ProgressModal text="Loading... Please wait" />}
    </div>
  );
}

export default Video;
