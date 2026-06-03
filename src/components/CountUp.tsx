import { useEffect, useState } from "react";

interface CountUpProps {
  end: any;
  duration?: number;
  className?: string;
}

const formatNumber = (num: number) => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1) + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1) + "K";
  }
  return num.toString();
};

const CountUp = ({ end, duration = 2, className = "" }: CountUpProps) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;

    const endValue = Number(end.toString().replace(/\D/g, "")); 
    const increment = endValue / (duration * 60); 

    const timer = setInterval(() => {
      start += increment;
      if (start >= endValue) {
        start = endValue;
        clearInterval(timer);
      }
      setValue(Math.floor(start));
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <span className={className}>{formatNumber(value)}</span>;
};

export default CountUp;
