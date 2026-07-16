export function HeroIllustration() {
  return (
    <div className="relative h-48 w-48 sm:h-56 sm:w-56 lg:h-64 lg:w-64 shrink-0 animate-in fade-in slide-in-from-left-4 duration-700">
      <svg
        viewBox="0 0 200 200"
        className="h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hero-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ddd6fe" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#fce7f3" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#fae8ff" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="frame-violet" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="frame-pink" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="frame-amber" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        <circle cx="100" cy="100" r="92" fill="url(#hero-bg)" />

        <g className="origin-center animate-[float_6s_ease-in-out_infinite]">
          <rect
            x="38"
            y="28"
            width="52"
            height="64"
            rx="10"
            fill="url(#frame-violet)"
            className="drop-shadow-lg"
            transform="rotate(-18, 64, 60)"
          />
          <rect
            x="42"
            y="32"
            width="44"
            height="56"
            rx="6"
            fill="white"
            fillOpacity="0.85"
            transform="rotate(-18, 64, 60)"
          />
        </g>

        <g
          className="origin-center animate-[float_8s_ease-in-out_infinite]"
          style={{ animationDelay: "-2s" }}
        >
          <rect
            x="100"
            y="95"
            width="58"
            height="46"
            rx="10"
            fill="url(#frame-pink)"
            className="drop-shadow-lg"
            transform="rotate(14, 129, 118)"
          />
          <rect
            x="104"
            y="99"
            width="50"
            height="38"
            rx="6"
            fill="white"
            fillOpacity="0.85"
            transform="rotate(14, 129, 118)"
          />
        </g>

        <g
          className="origin-center animate-[float_7s_ease-in-out_infinite]"
          style={{ animationDelay: "-4s" }}
        >
          <rect
            x="55"
            y="130"
            width="48"
            height="38"
            rx="8"
            fill="url(#frame-amber)"
            className="drop-shadow-lg"
            transform="rotate(8, 79, 149)"
          />
          <rect
            x="58"
            y="133"
            width="42"
            height="32"
            rx="5"
            fill="white"
            fillOpacity="0.85"
            transform="rotate(8, 79, 149)"
          />
        </g>

        <path
          d="M148 38l3.5 7 8 1.5-5.5 6 1 8-7-3.5-7 3.5 1-8-5.5-6 8-1.5z"
          fill="#a78bfa"
          fillOpacity="0.7"
          className="origin-center animate-[spin-slow_12s_linear_infinite]"
        />

        <path
          d="M32 155l2.5 5 5.5 1-4 4.5.5 6-5-2.5-5 2.5.5-6-4-4.5 5.5-1z"
          fill="#f472b6"
          fillOpacity="0.6"
          className="origin-center animate-[spin-slow_15s_linear_infinite]"
        />

        <circle cx="160" cy="150" r="4" fill="#c084fc" fillOpacity="0.5">
          <animate
            attributeName="opacity"
            values="0.3;0.7;0.3"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="30" cy="45" r="3" fill="#f9a8d4" fillOpacity="0.5">
          <animate
            attributeName="opacity"
            values="0.5;0.2;0.5"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="170" cy="70" r="2.5" fill="#fbbf24" fillOpacity="0.5">
          <animate
            attributeName="opacity"
            values="0.2;0.6;0.2"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="85" cy="185" r="3" fill="#a78bfa" fillOpacity="0.4">
          <animate
            attributeName="opacity"
            values="0.4;0.1;0.4"
            dur="5s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}
