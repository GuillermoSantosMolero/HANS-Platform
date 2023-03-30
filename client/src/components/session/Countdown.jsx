import {useState, useEffect} from 'react';
import {getRemainingTimeUntilMsTimestamp} from '../../context/Countdown';

const defaultRemainingTime = {
    seconds: '00',
    minutes: '00',
    hours: '00',
    days: '00'
}

const CountdownTimer = ({countdownTimestampMs, status}) => {
    const [remainingTime, setRemainingTime] = useState(defaultRemainingTime);

    useEffect(() => {
        if(status === 'active'){
            const intervalId = setInterval(() => {
                updateRemainingTime(countdownTimestampMs);
            }, 1000);
            return () => clearInterval(intervalId);
        }
    },[countdownTimestampMs]);

    function updateRemainingTime(countdown) {
        setRemainingTime(getRemainingTimeUntilMsTimestamp(countdown));
    }

    return(
        <div className="countdown-timer">
            <span className="two-numbers">{remainingTime.minutes}</span>
            <span>:</span>
            <span className="two-numbers">{remainingTime.seconds}</span>
        </div>
    );
}

export default CountdownTimer;  