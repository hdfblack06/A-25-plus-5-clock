import { useEffect, useState } from 'react';
import './App.css'
import $ from "jquery"

function App() {
  const [breakLength,setBreakLength]= useState(5)
  const [sessionLength,setSessionLength]= useState(25)
  const [breakSession,setBreakSession]=useState("Session");
  const [isPlayed,setIsPlayed] = useState(true)
  const [secondsLeft,setSecondsLeft] =useState(sessionLength * 60);


  function ResetLenghts(){
    ($('audio#beep')[0]as HTMLMediaElement ).pause();
    ($('audio#beep')[0]as HTMLMediaElement ).currentTime = 0;
    setBreakSession("Session");
    setBreakLength(5);
    setSessionLength(25);
    setIsPlayed(true);
    setSecondsLeft(25 * 60);
  }
  function UpdateBreakLength(id:string){
    if(id=="break-decrement" && breakLength > 1){
        setBreakLength(breakLength - 1);
      }
    if(id =="break-increment" && breakLength < 60){
      setBreakLength(breakLength + 1);
    }
  }
  function UpdateSessionLength(id:string){
    if(id == "session-decrement" && sessionLength > 1){
      setSessionLength(sessionLength - 1);
      //setTimeLeft(GetTimeLeft(sessionLength - 1 ))
      setSecondsLeft((sessionLength - 1) * 60);
    }
    if(id == "session-increment" && sessionLength < 60){
      setSessionLength(sessionLength + 1)
      //setTimeLeft(GetTimeLeft(sessionLength + 1 ))
      setSecondsLeft((sessionLength + 1) * 60);
    }

  }
  function UpdateTimer(sec:number){
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return formattedTime
  }

  useEffect(()=>{
    var countDownInterval: number | undefined;
    if(!isPlayed){
      countDownInterval = setInterval(()=>{
        if(secondsLeft == 0){
          if(breakSession == "Session"){
            setBreakSession("Break");
            setSecondsLeft(breakLength * 60)
          }else{
            setBreakSession("Session");
            setSecondsLeft(sessionLength * 60)
          }
          ($('audio#beep')[0]as HTMLMediaElement ).play()
        }else{setSecondsLeft(secondsLeft => secondsLeft-1);}
      },1000);
    }else{clearInterval(countDownInterval)}
    return ()=>clearInterval(countDownInterval);
  },[isPlayed,secondsLeft])

  function StartPauseTimer(){
    if(isPlayed){
      setIsPlayed(false)
    }
    else{
      setIsPlayed(true);
    }
  }

  return (<div id="container">
    <div className="main-title txt">25 + 5 Clock</div>

    <div className="length-control">
    <div id="break-label" className="txt">Break Length</div>
    <button id="break-decrement" onClick={() =>UpdateBreakLength("break-decrement")}><i className="fa fa-solid fa-chevron-down txt"></i></button>
    <div id="break-length">{breakLength}</div>
    <button id="break-increment" onClick={() =>UpdateBreakLength("break-increment")}><i className="fa-solid fa-chevron-up txt"></i></button>
    </div>

    <div className="length-control">
    <div id="session-label"  className="txt">Session Length</div>
    <button id="session-decrement" onClick={()=> UpdateSessionLength("session-decrement")}><i className="fa fa-solid fa-chevron-down txt"></i></button>
    <div id="session-length">{sessionLength}</div>
    <button id="session-increment" onClick={()=> UpdateSessionLength("session-increment")}><i className="fa-solid fa-chevron-up txt"></i></button>
    </div>
    
    <div className="timer">
      <div id="timer-label" className='txt'>{breakSession}</div>
      <audio id="beep" src="/src/assets/sounds/achive-sound.mp3"></audio>
      <div id="time-left" className='txt'>{UpdateTimer(secondsLeft)}</div>
    </div>
    <div className="timer-control">
      <button id="start_stop" onClick={()=>StartPauseTimer()}>
      <i className="fa fa-solid fa-play txt"></i>
      <i className="fa fa-solid fa-pause txt"></i>
      </button>
      <button id="reset" onClick={()=>ResetLenghts()}><i className="fa fa-solid fa-arrows-rotate txt"></i></button>
    </div>
  </div>)
}

export default App
