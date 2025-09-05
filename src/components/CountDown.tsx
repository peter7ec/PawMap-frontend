import { useEffect, useState } from "react";

function getTimeRemaining(targetDate: Date) {
  const total = targetDate.getTime() - new Date().getTime();

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { total, days, hours, minutes, seconds };
}

export default function CountDown() {
  const targetDate = new Date("2025-09-04T10:00:00");
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeRemaining(targetDate);
      setTimeLeft(remaining);

      if (remaining.total <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="h-20 flex flex-col  justify-center bg-white text-gray-800 text-center px-4 ">
      <div className="flex gap-2 text-2xl font-mono justify-center">
        <div className="bg-gray-100 px-7 py-2 rounded shadow">
          <span>{timeLeft.days}</span>
          <div className="text-xs">Days</div>
        </div>
        <div className="bg-gray-100 px-6 py-2 rounded shadow">
          <span>{timeLeft.hours}</span>
          <div className="text-xs">Hours</div>
        </div>
        <div className="bg-gray-100 px-4 py-2 rounded shadow">
          <span>{timeLeft.minutes}</span>
          <div className="text-xs">Minutes</div>
        </div>
        <div className="bg-gray-100 px-4 py-2 rounded shadow">
          <span>{timeLeft.seconds}</span>
          <div className="text-xs">Seconds</div>
        </div>
      </div>
    </div>
  );
}
