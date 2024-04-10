import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [isTimerRunning, setTimerRunning] = useState(false);
  const [dateAndTime, setDateAndTime] = useState(new Date());
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isInvalidDate, setInvalidDate] = useState(false);
  const [isTimerComplete, setTimerComplete] = useState(false);

  useEffect(() => {
    if (isTimerRunning) {
      const intervalId = setInterval(() => {
        const remainingTime = dateAndTime - new Date();
        if (remainingTime <= 0) {
          clearInterval(intervalId);
          setTimerRunning(false);
          setTimerComplete(true);
          setDays(0);
          setHours(0);
          setMinutes(0);
          setSeconds(0);
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
      setDays(0);
      setHours(0);
      setMinutes(0);
      setSeconds(0);
      return;
    }
    if (Math.floor((dateAndTime - new Date()) / (1000 * 60 * 60 * 24)) >= 100) {
      setInvalidDate(true);
      return;
    }
    setTimerRunning(true);
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
          onChange={(e) => setDateAndTime(new Date(e.target.value))}
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
      </div>
    </div>
  );
}

export default App;
