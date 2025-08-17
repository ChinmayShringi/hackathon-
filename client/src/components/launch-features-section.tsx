import React from "react";

const everyoneFeatures = [
  {
    title: <><span>One-click <em><strong>Flash</strong></em></span></>,
    desc: "Instant viral videos with a single tap.",
  },
  {
    title: <>Prompt-free Simplicity</>,
    desc: "Easy customization: just buttons & dropdowns.",
  },
  {
    title: <>Share Anywhere</>,
    desc: "Publish to TikTok, Insta, YT, 𝕏 & more.",
  },
];

const influencerFeatures = [
  {
    title: <>Rev-Share Recipe Builder</>,
    desc: "Craft custom recipes, share to earn revenue.",
  },
  {
    title: <>Mix n' Match AI Content</>,
    desc: "Seamlessly combine, stitch, & remix content.",
  },
  {
    title: <>Audio, Effects & Branding</>,
    desc: "Dialogue, music, logos - you name it!",
  },
];

export default function LaunchFeaturesSection() {
  return (
    <section className="px-4 pb-8 flex justify-center">
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl p-10 flex flex-col" style={{maxWidth: 1000}}>
        
        {/* Dual Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: For Influencers */}
          <div className="flex flex-col">
            <div className="flex flex-row items-start mb-4">
              {/* Left Filler */}
              <div className="w-8" />
              {/* Title and underline */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 text-left ml-[44px]">For Influencers</h2>
                <div className="w-[calc(100%-72px)] h-1 rounded bg-gradient-to-r from-[#5ec269ff] to-[#3c7f4500] mb-2 ml-[44px]" />
              </div>
              {/* Right Filler */}
              <div className="w-8" />
            </div>
            <div className="flex flex-col gap-0">
              {everyoneFeatures.map((f, i) => (
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
                          <linearGradient id={`grad-stroke-green-${i}`} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#5ec269" stopOpacity="1" />
                            <stop offset="100%" stopColor="#3c7f45" stopOpacity="1" />
                          </linearGradient>
                        </defs>

                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke={`url(#grad-stroke-green-${i})`}
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

          {/* Right Column: For Creatives */}
          <div className="flex flex-col">
            <div className="flex flex-row items-start mb-4">
              {/* Left Filler */}
              <div className="w-8" />
              {/* Title and underline */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 text-left ml-[44px]">For Creatives</h2>
                <div className="w-[calc(100%-72px)] h-1 rounded bg-gradient-to-r from-[#3b82f6ff] to-[#2563eb00] mb-2 ml-[44px]" />
              </div>
              {/* Right Filler */}
              <div className="w-8" />
            </div>
            <div className="flex flex-col gap-0">
              {influencerFeatures.map((f, i) => (
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
                          <linearGradient id={`grad-stroke-blue-${i}`} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
                            <stop offset="100%" stopColor="#2563eb" stopOpacity="1" />
                          </linearGradient>
                        </defs>

                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke={`url(#grad-stroke-blue-${i})`}
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
      </div>
    </section>
  );
} 