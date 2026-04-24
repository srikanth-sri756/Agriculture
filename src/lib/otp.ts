import crypto from "crypto";

interface OtpEntry {
  otp: string;
  expiresAt: number;
  verified: boolean;
}

// In-memory OTP store (use Redis/DB in production)
const otpStore = new Map<string, OtpEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of otpStore) {
    if (now > entry.expiresAt) otpStore.delete(key);
  }
}, 60_000);

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const OTP_LENGTH = 6;

export function generateOtp(mobile: string): string {
  // Generate cryptographically secure 6-digit OTP
  const otp = String(crypto.randomInt(100000, 999999));

  otpStore.set(mobile, {
    otp,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
    verified: false,
  });

  return otp;
}

export function verifyOtp(mobile: string, otp: string): boolean {
  const entry = otpStore.get(mobile);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(mobile);
    return false;
  }
  if (entry.otp !== otp) return false;

  // Mark as verified
  entry.verified = true;
  otpStore.set(mobile, entry);
  return true;
}

export function isOtpVerified(mobile: string): boolean {
  const entry = otpStore.get(mobile);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(mobile);
    return false;
  }
  return entry.verified;
}

export function clearOtp(mobile: string): void {
  otpStore.delete(mobile);
}

export async function sendSms(mobile: string, otp: string): Promise<boolean> {
  const apiKey = process.env.SMS_API_KEY;

  if (!apiKey) {
    // Development fallback — log OTP to console
    console.log(`\n========================================`);
    console.log(`📱 OTP SMS to ${mobile}: ${otp}`);
    console.log(`========================================\n`);
    return true;
  }

  // Fast2SMS dedicated OTP route (works with free tier)
  try {
    const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        "authorization": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "otp",
        variables_values: otp,
        flash: 0,
        numbers: mobile,
      }),
    });

    const data = await res.json();
    console.log("Fast2SMS response:", JSON.stringify(data));
    return data.return === true;
  } catch (err) {
    console.error("SMS send failed:", err);
    return false;
  }
}
