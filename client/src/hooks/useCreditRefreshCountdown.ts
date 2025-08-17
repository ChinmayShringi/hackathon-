import { useEffect, useRef, useState } from "react";

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "";
  if (seconds < 60) return `whoa! ${seconds}s to go!`;
  if (seconds < 3600) return `only ${Math.floor(seconds / 60)}m to go!`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `more in ${h}h ${m}m`;
}

function getNextInterval(seconds: number) {
  if (seconds > 3600) return 60000; // 1 min
  if (seconds > 60) return 10000; // 10 sec
  return 1000; // 1 sec
}

export function useCreditRefreshCountdown(initialSecondsLeft: number) {
  const [display, setDisplay] = useState(() => formatCountdown(initialSecondsLeft));
  const [secondsLeft, setSecondsLeft] = useState(initialSecondsLeft);
  const initialTimeRef = useRef(Date.now());
  const initialSecondsRef = useRef(initialSecondsLeft);

  useEffect(() => {
    // Reset refs and display when initialSecondsLeft changes
    initialTimeRef.current = Date.now();
    initialSecondsRef.current = initialSecondsLeft;
    setDisplay(formatCountdown(initialSecondsLeft));
    setSecondsLeft(initialSecondsLeft);
  }, [initialSecondsLeft]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    function update() {
      const now = Date.now();
      const elapsed = Math.floor((now - initialTimeRef.current) / 1000);
      const secondsLeft = Math.max(0, initialSecondsRef.current - elapsed);
      setDisplay(formatCountdown(secondsLeft));
      setSecondsLeft(secondsLeft);
      if (secondsLeft > 0) {
        timeout = setTimeout(update, getNextInterval(secondsLeft));
      }
    }
    update();
    return () => clearTimeout(timeout);
  }, [initialSecondsLeft]);

  return { display, secondsLeft };
} 