"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { supabase } from "@/lib/supabase";

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

function ModalContent({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = phone.replace(/\D/g, "");
  const isPhoneValid = digits.length === 10;
  const fullPhone = `1${digits}`;

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(formatPhone(raw));
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!isPhoneValid) return;
    setLoading(true);
    setError("");

    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: fullPhone,
    });

    setLoading(false);

    if (otpError) {
      setError(otpError.message);
      return;
    }

    setStep("otp");
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    if (value.length > 1) {
      const chars = value.slice(0, 6 - index).split("");
      chars.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + chars.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else {
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  const otpCode = otp.join("");

  useEffect(() => {
    if (otpCode.length === 6) {
      verifyOtp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpCode]);

  async function verifyOtp() {
    setLoading(true);
    setError("");

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      phone: fullPhone,
      token: otpCode,
      type: "sms",
    });

    setLoading(false);

    if (verifyError) {
      setError(verifyError.message);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      return;
    }

    if (data.session) {
      const userId = data.session.user.id;
      const { data: existingUser } = await supabase
        .from("users")
        .select("name, handle, photo_url")
        .eq("id", userId)
        .maybeSingle();

      const needsOnboarding =
        !existingUser ||
        existingUser.name === "New User" ||
        !existingUser.handle ||
        existingUser.handle.startsWith("user_") ||
        !existingUser.photo_url;

      // Check for pending RSVP flow
      const pendingRsvp =
        typeof window !== "undefined"
          ? sessionStorage.getItem("pending-rsvp")
          : null;

      onClose();

      if (needsOnboarding) {
        router.push("/onboarding");
      } else if (pendingRsvp) {
        // Profile already complete — refresh current page so RsvpLauncher
        // on the event page picks up the pending flag and opens the modal
        router.refresh();
      } else {
        router.refresh();
      }
    }
  }

  async function handleResend() {
    setLoading(true);
    setError("");
    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: fullPhone,
    });
    setLoading(false);
    if (otpError) {
      setError(otpError.message);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        <div className="modal-logo">
          <Logo color="white" size={36} strokeWidth={18} />
        </div>

        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="modal-form">
            <h2 className="modal-title">Make Moments</h2>
            <p className="modal-subtitle">Sign Up with Phone Number</p>

            <label className="phone-label">Phone Number</label>
            <div className="phone-input-wrapper">
              <span className="phone-prefix">+1</span>
              <input
                type="tel"
                className="phone-input"
                placeholder="(555) 000-0000"
                value={phone}
                onChange={handlePhoneChange}
                autoFocus
              />
            </div>

            {error && <p className="modal-error">{error}</p>}

            <button
              type="submit"
              className="modal-submit"
              disabled={!isPhoneValid || loading}
            >
              {loading ? "SENDING..." : "CONTINUE"}
            </button>

            <p className="modal-legal">
              By joining, you agree to our{" "}
              <a href="/terms">Terms of Service</a> and{" "}
              <a href="/privacy">Privacy Policy</a>.
            </p>
          </form>
        ) : (
          <div className="modal-form">
            <h2 className="modal-title">Enter Code</h2>
            <p className="modal-subtitle">Sent to {formatPhone(digits)}</p>

            <div className="otp-inputs">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  className="otp-input"
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            {error && <p className="modal-error">{error}</p>}

            {loading && <p className="modal-loading">Verifying...</p>}

            <button
              type="button"
              className="resend-btn"
              onClick={handleResend}
              disabled={loading}
            >
              Resend Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function JoinModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;

  return createPortal(<ModalContent onClose={onClose} />, document.body);
}
