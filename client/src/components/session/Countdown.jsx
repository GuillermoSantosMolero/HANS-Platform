import React, { useState, useEffect } from 'react';

const CountDown = ({ targetDate }) => {
  const [countdown, setCountdown] = useState(calculateCountdown(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateCountdown(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  function calculateCountdown(targetDate) {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  }

  const {minutes, seconds } = countdown;

  return (
    <div>
      {Object.keys(countdown).length ? (
        <div>
          <div>{minutes}:{seconds}</div>
        </div>
      ) : (
        <div>Tiempo finalizado</div>
      )}
    </div>
  );
};

export default CountDown;