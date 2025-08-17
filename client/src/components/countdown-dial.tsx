import React, { useEffect, useRef, useState } from "react";

export interface CountdownDialProps {
  percent?: number; // 0-100
  duration?: number; // seconds (60, 10, 1)
  size?: number; // px
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const a = ((angle - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(a),
    y: cy + r * Math.sin(a),
  };
}

function describeArc(cx: number, cy: number, r: number, percent: number) {
  const endAngle = (percent / 100) * 360;
  const start = polarToCartesian(cx, cy, r, 0);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = endAngle > 180 ? 1 : 0;
  if (percent === 100) {
    // Full circle
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`;
  }
  if (percent === 0) {
    return '';
  }
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

export const CountdownDial: React.FC<CountdownDialProps> = ({
  percent = 100,
  duration = 60,
  size = 12,
}) => {
  const [displayedPercent, setDisplayedPercent] = useState(percent);
  const animationRef = useRef<number | null>(null);
  const prevPercent = useRef(percent);
  const prevTimestamp = useRef<number | null>(null);

  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setDisplayedPercent(percent);
    prevPercent.current = percent;
    prevTimestamp.current = null;

    function animate(ts: number) {
      if (prevTimestamp.current === null) prevTimestamp.current = ts;
      const elapsed = (ts - prevTimestamp.current) / 1000;
      const nextPercent = Math.max(0, prevPercent.current - (elapsed / duration) * prevPercent.current);
      setDisplayedPercent(nextPercent);
      if (nextPercent > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }
    if (percent > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [percent, duration]);

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;
  const arcPath = describeArc(cx, cy, r, displayedPercent);

  return (
    <svg width={size} height={size} style={{ display: "block" }}>
      <g transform={`scale(-1,1) translate(-${size},0)`}>
        {arcPath && (
          <path d={arcPath} fill="#fff" />
        )}
      </g>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size * 0.09}
        fill="#fff"
      />
    </svg>
  );
}; 