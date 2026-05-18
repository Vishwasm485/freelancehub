import { useEffect, useState } from "react";

function LiveClock() {

  const [time, setTime] = useState(new Date());

  useEffect(() => {

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="clock-box">

      <p>{time.toLocaleDateString()}</p>

      <h3>{time.toLocaleTimeString()}</h3>

    </div>
  );
}

export default LiveClock;