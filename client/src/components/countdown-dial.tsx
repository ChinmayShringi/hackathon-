interface CountdownDialProps {
  value: number;
  max: number;
  className?: string;
}

export default function CountdownDial({ value, max, className = "" }: CountdownDialProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className={`relative w-16 h-16 ${className}`}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        <path
          className="stroke-gray-300"
          strokeDasharray="100, 100"
          strokeWidth="3"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="stroke-accent-blue"
          strokeDasharray={`${percentage}, 100`}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium text-white">{value}</span>
      </div>
    </div>
  );
}
