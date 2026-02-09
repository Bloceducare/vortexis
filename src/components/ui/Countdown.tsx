import { useEffect, useState } from "react";

interface CountdownProps {
  startDate: string | Date;
}

const Countdown: React.FC<CountdownProps> = ({ startDate }) => {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!startDate) return;

    const interval = setInterval(() => {
      const start = new Date(startDate).getTime();
      const now = Date.now();
      const diff = start - now;

      if (diff <= 0) {
        clearInterval(interval);
        setCountdown("🚀 Live Now!");
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startDate]);

  return <span>{countdown}</span>;
};

export default Countdown;
