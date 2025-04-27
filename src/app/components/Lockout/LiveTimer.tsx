// components/LiveTimer.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

interface LiveTimerProps {
  endTime: number; // ISO string for the contest end time (e.g., "2025-05-01T12:00:00Z")
}

const LiveTimer: React.FC<LiveTimerProps> = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const countdown = () => {
      const endDate = new Date(endTime).getTime();
      const now = new Date().getTime();
      const distance = endDate - now;

      setTimeLeft(distance);

      if (distance <= 0) {
        clearInterval(timer);
      }
    };

    const timer = setInterval(countdown, 1000);
    countdown(); // initial call to display the timer immediately
    return () => clearInterval(timer); // clear the timer when component unmounts
  }, [endTime]);

  const formatTime = (milliseconds: number): any => {
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const time = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    return (
      <span>
        <span className="text-gray-700">Ends in: </span>
        <span className="text-cyan-800">{time}</span>
      </span>
    );
  };

  return (
    <div className="text-center">
      <div className="text-2xl font-semibold">
        {timeLeft > 0 ? formatTime(timeLeft) : "Contest Ended"}
      </div>
      {timeLeft <= 0 && (
        <div className="mt-2 text-sm text-gray-500">The contest has ended!</div>
      )}
    </div>
  );
};

export default LiveTimer;
