import "./App.css";
import { useEffect, useState, useRef } from "react";
import NotificationSound from "./assets/notificationSound.mp3";

function App() {
  const [isTimerRunning, setTimerRunning] = useState(
    localStorage.getItem("timer") === "true" ? true : false
  );
  const [dateAndTime, setDateAndTime] = useState(
    localStorage.getItem("timer") === "true"
      ? localStorage.getItem("datetime")
      : ""
  );
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isInvalidDate, setInvalidDate] = useState(false);
  const [isTimerComplete, setTimerComplete] = useState(false);
  const [isDateSelected, setDateSelected] = useState(true);

  const audioPlayer = useRef(null);

  useEffect(() => {
    if (isTimerRunning) {
      const intervalId = setInterval(() => {
        const remainingTime = new Date(dateAndTime) - new Date();
        if (remainingTime <= 0) {
          clearInterval(intervalId);
          setTimerRunning(false);
          setTimerComplete(true);
          localStorage.setItem("timer", "false");
          audioPlayer.current.play();
          return;
        }
        const remainingDays = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const remainingHours = Math.floor(
          (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const remainingMinutes = Math.floor(
          (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
        );
        const remainingSeconds = Math.floor(
          (remainingTime % (1000 * 60)) / 1000
        );
        setDays(remainingDays);
        setHours(remainingHours);
        setMinutes(remainingMinutes);
        setSeconds(remainingSeconds);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isTimerRunning]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimerComplete(false);
    if (isTimerRunning) {
      setTimerRunning(false);
      localStorage.setItem("timer", "false");
      setDays(0);
      setHours(0);
      setMinutes(0);
      setSeconds(0);
      return;
    }
    if (dateAndTime === "") {
      setDateSelected(false);
      return;
    }
    setDateSelected(true);
    if (
      Math.floor(
        (new Date(dateAndTime) - new Date()) / (1000 * 60 * 60 * 24)
      ) >= 100
    ) {
      setInvalidDate(true);
      return;
    }
    setTimerRunning(true);
    localStorage.setItem("timer", "true");
    localStorage.setItem("datetime", `${dateAndTime}`);
  };

  return (
    <div className="wrapper">
      <h1>
        Countdown <span style={{ color: "#AF53FF" }}>Timer</span>
      </h1>
      <form className="form" onSubmit={(e) => handleSubmit(e)}>
        <input
          type="datetime-local"
          className="dateselector"
          onChange={(e) => setDateAndTime(e.target.value)}
          value={dateAndTime}
          max={new Date(new Date().getTime() + 100 * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 16)}
        />
        <input
          type="submit"
          className="timerButton"
          value={isTimerRunning ? "Cancel Timer" : "Start Timer"}
        />
      </form>
      {!isTimerComplete && (
        <div className="cardbox">
          <div className="card">
            <div className="numberDisplay">{days}</div>
            <div className="subhead">Days</div>
          </div>
          <div className="card">
            <div className="numberDisplay">{hours}</div>
            <div className="subhead">Hours</div>
          </div>
          <div className="card">
            <div className="numberDisplay">{minutes}</div>
            <div className="subhead">Minutes</div>
          </div>
          <div className="card">
            <div className="numberDisplay">{seconds}</div>
            <div className="subhead">Seconds</div>
          </div>
        </div>
      )}
      <div className="messageline">
        {isInvalidDate && "Selected time is more than 100 days"}
        {isTimerComplete &&
          "🎉 The countdown is over! What's next on your adventure? 🎉"}
        {!isDateSelected && "Please select any date and time"}
      </div>
      <audio ref={audioPlayer} src={NotificationSound} />
    </div>
  );
}

export default App;
