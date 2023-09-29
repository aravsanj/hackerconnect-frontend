import React, { useState, useEffect, Dispatch, SetStateAction } from "react";

type Props = {
  action: Dispatch<SetStateAction<boolean>>;
};

function CountDown({ action }: Props) {
  const [timeRemaining, setTimeRemaining] = useState<number>(5 * 60); // 5 minutes in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          // Call the action when the time is up
          action(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [action]); // Include 'action' as a dependency

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="text-white p-4 rounded-lg ">
      <div className="text-2xl font-bold mb-2">OTP expires in</div>
      <div className="flex items-center justify-center">
        <span className="text-4xl font-bold">{`${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}</span>
      </div>
    </div>
  );
}

export default CountDown;
