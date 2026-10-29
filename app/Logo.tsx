// AirPR logo — v0 "TailFin": abstract vertical stabilizer, Blue Jay gradient.
// Exact geometry from the approved pixelmatch design (viewBox 0 0 100 80,
// base fin + lighter facet overlay). Variants: color, white, mono.
const FIN_PATH = "M2 78C24 58 40 30 58 13C68 4 84 1.5 100 0L83 44C78 58 68 66 52 70C36 74 18 76.5 2 78Z";
const FACET_PATH = "M2 78C34 58 68 30 100 0L83 44C78 58 68 66 52 70C36 74 18 76.5 2 78Z";

export default function Logo({
  variant = "color",
  finHeight = 24,
  wordSize = 19,
}: {
  variant?: "color" | "white" | "mono";
  finHeight?: number;
  wordSize?: number;
}) {
  const gid = "airpr-fin-" + variant;
  const w = Math.round((finHeight * 100) / 80);
  const finFill = variant === "color" ? "url(#" + gid + ")" : variant === "white" ? "#FFFFFF" : "#082545";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <svg width={w} height={finHeight} viewBox="0 0 100 80" aria-hidden="true" role="presentation">
        {variant === "color" && (
          <defs>
            <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1="0" y1="80" x2="100" y2="0">
              <stop offset="0" stopColor="#002B5C" />
              <stop offset="0.5" stopColor="#0057D9" />
              <stop offset="1" stopColor="#008BFF" />
            </linearGradient>
            <linearGradient id={gid + "-f"} gradientUnits="userSpaceOnUse" x1="0" y1="80" x2="100" y2="0">
              <stop offset="0" stopColor="#0057D9" />
              <stop offset="0.5" stopColor="#0A7BFF" />
              <stop offset="1" stopColor="#3FB0FF" />
            </linearGradient>
          </defs>
        )}
        <path d={FIN_PATH} fill={finFill} />
        {variant === "color" && <path d={FACET_PATH} fill={"url(#" + gid + "-f)"} opacity="0.9" />}
      </svg>
      <span className={"wordmark" + (variant === "white" ? " white" : "")} style={{ fontSize: wordSize }}>
        AirPR
      </span>
    </span>
  );
}
