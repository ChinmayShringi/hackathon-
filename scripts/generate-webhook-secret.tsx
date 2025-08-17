import { randomBytes } from "crypto";
import { config } from "dotenv";

// Load env first (project guideline), though not required for this script
config();

function parseBits(arg?: string): number {
  const fallback = 256;
  if (!arg) return fallback;
  const n = parseInt(arg, 10);
  if (!Number.isFinite(n)) return fallback;
  if (n % 8 !== 0) return fallback;
  // Clamp to reasonable, known sizes
  const allowed = [128, 192, 256, 384, 512, 1024];
  return allowed.includes(n) ? n : fallback;
}

function main() {
  const bits = parseBits(process.argv[2]);
  const bytes = bits / 8;
  const buf = randomBytes(bytes);
  const hex = buf.toString("hex");
  // Print only the hex; easy to copy into .env
  console.log(hex);
}

main();


