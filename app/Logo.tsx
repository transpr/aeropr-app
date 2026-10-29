// AirPR logo — abstract vertical stabilizer ("tail fin") with the Blue Jay
// gradient (see brand identity reference). Variants: color (default, white
// backgrounds), white (navy backgrounds), mono (single navy).
export default function Logo({ variant = "color", height = 26 }: { variant?: "color" | "white" | "mono"; height?: number }) {
  const gid = "airpr-grad-" + variant;
  const fill = variant === "white" ? "#FFFFFF" : variant === "mono" ? "#082545" : "url(#" + gid + ")";
  return (
    <span className="logo-lockup" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <svg width={Math.round(height * 0.86)} height={height} viewBox="0 0 24 28" aria-hidden="true" role="presentation">
        {variant === "color" && (
          <defs>
            <linearGradient id={gid} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#002B5C" />
              <stop offset="0.45" stopColor="#0057D9" />
              <stop offset="0.75" stopColor="#008BFF" />
              <stop offset="1" stopColor="#20B9FF" />
            </linearGradient>
          </defs>
        )}
        <path
          fill={fill}
          d="M18.2 0.8 C11.4 5.2 7.2 11.6 5.6 19.4 L4.4 27.2 C9.8 24.9 14.2 21 16.6 16.2 C18.7 12 19.2 6.3 18.2 0.8 Z"
        />
      </svg>
      <span className="wordmark">AirPR</span>
    </span>
  );
}
