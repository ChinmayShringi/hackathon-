import React from "react";
import { CountdownDial } from "./countdown-dial";

export interface CreditCounterProps {
  count: number;
  subtext?: React.ReactNode;
  /** Time remaining in milliseconds for countdown dial */
  msRemaining?: number;
}

export const CreditCounter: React.FC<CreditCounterProps> = ({ count, subtext, msRemaining }) => {
  const digits = String(count).padStart(4, "0").split("");

  // Calculate dial percent and duration
  let percent = 100;
  let duration = 60;
  if (typeof msRemaining === "number") {
    if (msRemaining > 60 * 1000) {
      duration = 60;
      percent = ((msRemaining % 60000) / 60000) * 100;
    } else if (msRemaining > 10 * 1000) {
      duration = 10;
      percent = ((msRemaining % 10000) / 10000) * 100;
    } else {
      duration = 1;
      percent = ((msRemaining % 1000) / 1000) * 100;
    }
  }

  // Helper to style <em> children in subtext
  const renderSubtext = (subtext: React.ReactNode) => {
    return React.Children.map(subtext, (child) => {
      if (typeof child === "string") return child;
      if (React.isValidElement(child) && child.type === "em") {
        return React.cloneElement(child as React.ReactElement, {
          style: { ...(child.props.style || {}), fontStyle: "italic", color: "#fff" },
        });
      }
      return child;
    });
  };

  return (
    <div className="flex flex-col items-center cursor-default">
      <div
        className="flex flex-col items-center gap-2 mb-2 px-3 py-3 rounded-[28px] border border-black relative shadow-2xl mb-5"
        style={{
          background: "linear-gradient(145deg, #344170, #)",
        }}
      >
        <div
          className="absolute inset-0 rounded-[28px] pointer-events-none"
          style={{
            boxShadow: "inset -2px -2px 2px rgba(21,28,42,0.6), inset 2px 2px 2px rgba(255,255,255,0.4)",
          }}
        />
        <div className="flex gap-2">
          {digits.map((digit, i) => (
            <div
              key={i}
              className="rounded-[16px] p-0.5"
              style={{
                background: "#060606",
                boxShadow:
                  "inset 2px 2px 2px rgba(0,0,0,0.2), inset -2px -2px 2px rgba(255,255,255,0.2)",
              }}
            >
              <div
                className="flex items-center justify-center font-bold rounded-[14px] select-none"
                style={{
                  width: 64,
                  height: 100,
                  fontSize: 60,
                  color: "#fafafa",
                  background:
                    "linear-gradient(to bottom, rgba(26,38,56,0.2) 0%, rgba(150,183,255,0.2) 22%, rgba(64,90,131,0.2) 45%, rgba(0,0,0,0.2) 50%, rgba(86,113,154,0.2) 55%, rgba(79,113,161,0.2) 78%, rgba(41,64,101,0.2) 100%)",
                  backgroundColor: "#0000",
                  position: "relative",
                }}
              >
                {digit}
              </div>
            </div>
          ))}
        </div>
        {/* Credits Remaining Text Box */}
        <div
          className="w-full rounded-[16px] p-0.5"
          style={{
            background: "#060606",
            boxShadow:
              "inset 2px 2px 2px rgba(0,0,0,0.2), inset -2px -2px 2px rgba(255,255,255,0.2)",
          }}
        >
          <div
            className="flex items-center justify-center font-semibold rounded-[14px] select-none uppercase tracking-wide"
            style={{
              height: 48,
              fontSize: 16,
              color: "#fafafa",
              background:
                "linear-gradient(to bottom, rgba(26,38,56,0.1) 0%, rgba(150,183,255,0.1) 50%, rgba(64,90,131,0.2) 75%, rgba(0,0,0,0.1) 100%)",
              backgroundColor: "#0000",
              position: "relative",
            }}
          >
            CREDITS REMAINING
          </div>
        </div>
      </div>
      <div className="text-base text-white text-center select-none">
        {typeof msRemaining === "number" && msRemaining >= 0 && (
          <div className="flex items-center justify-center gap-x-2">
            <span>
              visit daily for <span className="font-semibold">free credits</span>
            </span>
            <CountdownDial percent={percent} duration={duration} size={12} />
            {subtext && (
              <span>
                {typeof subtext === 'string'
                  ? subtext.split(/(\d+h|\d+m|\d+s)/g).map((part, i) =>
                      /\d+[hms]/.test(part)
                        ? <span key={i} className="font-semibold">{part}</span>
                        : part
                    )
                  : subtext}
              </span>
            )}
          </div>
        )}
        {!msRemaining && subtext && (typeof subtext === 'string'
          ? subtext.split(/(\d+h|\d+m|\d+s)/g).map((part, i) =>
              /\d+[hms]/.test(part)
                ? <span key={i} className="font-semibold">{part}</span>
                : part
            )
          : renderSubtext(subtext))}
      </div>
    </div>
  );
};
