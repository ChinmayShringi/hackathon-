import React from "react";
import { Heart } from "lucide-react";

const differenceFeatures = [
  {
    title: <>Permissionless API</>,
    desc: "Integrate apps, workflows & tools without gatekeeping via x402 payments.",
  },
  {
    title: <>Fiat & Crypto-native Rails</>,
    desc: "Monetize globally with flexible, creator-first payments & withdrawals.",
  },
  {
    title: <>Token Friendly Discounts</>,
    desc: "Receive discounted premium credits for popular Web3 tokens like $VIRTUAL, $AVB, $HOLLY and more.",
  },
  {
    title: <>Autonomous AI Agents that Create & Earn</>,
    desc: "Deploy an AI Agent with our AVB Framework for passive revenue generation.",
  },
  {
    title: <>Scrypted Video Engine</>,
    desc: "Patent pending, fully-consistent character & scene generation w/ 60s+ video lengths.",
  },
  {
    title: <>Mini-apps in the Wallets you <Heart className="inline w-4 h-4" /></>,
    desc: "Delula will soon be available on Farcaster, World Wallet, and Coinbase Wallet!",
  },
];

export default function DelulaDifferenceSection() {
  return (
    <section className="px-4 pb-8 flex justify-center">
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl p-10 flex flex-col relative overflow-hidden" style={{maxWidth: 600}}>
        
        {/* Background Layer */}
        <div 
          className="absolute inset-0 bg-repeat crypto-black-bg"
        />
        
        {/* Content Layer */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold">The Delula Difference</h2>
            <h3 className="text-[90%] font-thin text-[#e8e8f3] mb-2">Maximizing Creator Earning Opportunities</h3>
            <div className="w-full h-1 rounded bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent opacity-50" />
          </div>

          {/* Features List */}
          <div className="flex flex-col gap-0">
            {differenceFeatures.map((f, i) => (
              <div className="flex flex-row items-start mb-6" key={i}>
                {/* Left Filler */}
                <div className="w-8" />
                {/* Checkmark + Text */}
                <div className="flex-1 flex items-start gap-3">
                  <span className="mt-0">
                    <svg
                      className="w-8 h-8 drop-shadow-sm text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <defs>
                        <linearGradient id={`grad-stroke-gold-${i}`} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
                          <stop offset="100%" stopColor="#d97706" stopOpacity="1" />
                        </linearGradient>
                      </defs>

                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke={`url(#grad-stroke-gold-${i})`}
                        strokeWidth="1"
                      />
                      <path d="M8 12l2.5 2.5L16 9" />
                    </svg>
                  </span>
                  <div className="feature-text text-base leading-tight">
                    <span className="block font-semibold text-white">{f.title}</span>
                    <span className="block text-[#e8e8f3] text-[90%] font-thin leading-snug">{f.desc}</span>
                  </div>
                </div>
                {/* Right Filler */}
                <div className="w-8" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 