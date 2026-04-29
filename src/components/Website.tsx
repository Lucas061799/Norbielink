"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Eye, EyeOff, X, Check } from "lucide-react";
import norbielinkLogoDark from "@/assets/norbielink-logo-dark.png";
import btisLogoDark from "@/assets/btislogo-dark.png";
import loginN from "@/assets/login-n.svg";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";

type Step = "login" | "verify" | "create";

interface WebsiteProps {
  isDark?: boolean;
}

export default function Website({ isDark = false }: WebsiteProps) {
  const [step, setStep] = useState<Step>("login");

  const c = {
    text:    isDark ? "#F9FAFB" : "#1F2937",
    muted:   isDark ? "#8B8FA8" : "#6B7280",
    cardBg:  isDark ? "#191D35" : "#fff",
    border:  isDark ? "rgba(255,255,255,0.22)" : "#D1D5DB",
    inputBg: isDark ? "rgba(255,255,255,0.05)" : "#fff",
  };
  const font = { fontFamily: FONT } as React.CSSProperties;
  const btnGrad = isDark
    ? "radial-gradient(171.32% 99.33% at 33.13% -9%, #282550 0%, #191735 55.82%, rgba(0,0,0,0.3) 74%, rgba(0,0,0,0) 100%), linear-gradient(88.34deg, #5C2ED4 0.11%, #A614C3 63.8%)"
    : "linear-gradient(90deg,#5C2ED4 0%,#A614C3 65%)";

  const inputStyle: React.CSSProperties = {
    fontFamily: FONT,
    background: c.inputBg,
    border: `1px solid ${c.border}`,
    color: c.text,
    padding: "10px 14px",
    borderRadius: 10,
    fontSize: 13,
    width: "100%",
    outline: "none",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: FONT,
    color: "#6B7280",
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 6,
    display: "block",
  };

  const primaryBtnStyle = (enabled: boolean): React.CSSProperties => ({
    fontFamily: FONT,
    background: btnGrad,
    padding: "12px 28px",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    border: "none",
    color: "#fff",
    width: "100%",
    opacity: enabled ? 1 : 0.5,
    cursor: enabled ? "pointer" : "not-allowed",
    boxShadow: enabled ? "0 4px 14px rgba(166,20,195,0.25)" : "none",
    transition: "all 0.15s",
  });

  const topBarBg     = "linear-gradient(180deg, #26125A 0%, #29125C 100%)";
  const leftPanelBg  = "linear-gradient(180.36deg, #231258 0.33%, #A720C1 99.29%)";

  return (
    <div className="flex w-full overflow-hidden relative" style={{ ...font, height: "100%" }}>
      {/* LEFT brand panel — full height purple. Logo + powered-by at top, N graphic at bottom. */}
      <div
        className="relative flex-shrink-0 overflow-hidden flex flex-col"
        style={{ width: "33.3333%", maxWidth: 460, background: leftPanelBg }}
      >
        {/* Brand block */}
        <div className="relative z-20 px-10 pt-10 flex-shrink-0">
          <div className="flex flex-col" style={{ width: "fit-content" }}>
            <Image src={norbielinkLogoDark} alt="Norbielink" className="w-auto" style={{ height: 57.6 }} priority />
            <div
              className="flex items-center gap-3 justify-end mt-4 w-full"
              style={{ paddingRight: 10 }}
            >
              <span
                className="text-[12px] tracking-[0.22em] uppercase font-medium"
                style={{ color: "rgba(255,255,255,0.78)" }}
              >
                POWERED BY
              </span>
              <Image src={btisLogoDark} alt="btis" className="h-9 w-auto" />
            </div>
          </div>
        </div>

        {/* N graphic anchored bottom-left */}
        <Image
          src={loginN}
          alt="N Logo"
          className="absolute pointer-events-none select-none"
          sizes="33vw"
          style={{ left: 0, bottom: 0, width: "100%", height: "auto", maxHeight: "70%" }}
        />
      </div>

      {/* RIGHT side — top purple bar over white form */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Top bar (only over the right side, not across the left) */}
        <header
          className="flex-shrink-0"
          style={{ height: 52, background: topBarBg }}
        />

        {/* White form panel */}
        <div
          className="flex-1 flex flex-col items-center justify-center overflow-y-auto relative"
          style={{ background: c.cardBg, padding: "48px" }}
        >
        {/* Step indicator (top-right) */}
        <div className="absolute top-6 right-8 flex items-center gap-2">
          {(["login", "verify", "create"] as Step[]).map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className="rounded-full transition-all"
              style={{
                width: step === s ? 22 : 8,
                height: 8,
                background: step === s ? btnGrad : c.border,
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>

          <div className="w-full" style={{ maxWidth: 520 }}>
            {step === "login"  && <LoginView  c={c} font={font} inputStyle={inputStyle} labelStyle={labelStyle} primaryBtnStyle={primaryBtnStyle} btnGrad={btnGrad} onContinue={() => setStep("verify")} />}
            {step === "verify" && <VerifyView c={c} font={font} primaryBtnStyle={primaryBtnStyle} btnGrad={btnGrad} onVerify={() => setStep("create")} />}
            {step === "create" && <CreateView c={c} font={font} inputStyle={inputStyle} labelStyle={labelStyle} primaryBtnStyle={primaryBtnStyle} btnGrad={btnGrad} isDark={isDark} onContinue={() => setStep("login")} />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────── LOGIN ──────────────────────────── */
function LoginView({ c, font, inputStyle, labelStyle, primaryBtnStyle, btnGrad, onContinue }: {
  c: Record<string, string>;
  font: React.CSSProperties;
  inputStyle: React.CSSProperties;
  labelStyle: React.CSSProperties;
  primaryBtnStyle: (enabled: boolean) => React.CSSProperties;
  btnGrad: string;
  onContinue: () => void;
}) {
  const [email, setEmail] = useState("lisa.armitage@amyntagroup.com");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const enabled = email.trim().length > 0 && password.length > 0;

  return (
    <>
      <h1 className="mb-3" style={{ ...font, fontSize: 32, fontWeight: 600, lineHeight: "38px", color: c.text }}>
        Welcome to{" "}
        <span
          style={{
            background: btnGrad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          NorbieLink!
        </span>
      </h1>
      <p className="mb-8" style={{ ...font, fontSize: 14, color: c.muted }}>
        Sign in to continue to your account.
      </p>

      <div className="mb-5">
        <label style={labelStyle}>Email Address</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
      </div>

      <div className="mb-5">
        <label style={labelStyle}>Password</label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ ...inputStyle, paddingRight: 40 }}
          />
          <button
            type="button"
            onClick={() => setShowPw(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            style={{ color: c.muted, background: "transparent", border: "none", padding: 0, lineHeight: 0 }}
          >
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <label className="flex items-center gap-2 mb-7 cursor-pointer select-none" style={{ ...font, fontSize: 13, color: c.muted }}>
        <input
          type="checkbox"
          checked={remember}
          onChange={e => setRemember(e.target.checked)}
          className="sr-only"
        />
        <span
          className="flex-shrink-0 flex items-center justify-center"
          style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            border: `1.5px solid ${remember ? "transparent" : c.border}`,
            background: remember ? btnGrad : "transparent",
          }}
        >
          {remember && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </span>
        Remember me
      </label>

      <button type="button" disabled={!enabled} onClick={onContinue} style={primaryBtnStyle(enabled)}>
        Continue
      </button>

      <div className="mt-5" style={{ ...font, fontSize: 13, color: c.muted }}>
        Forgot your password?{" "}
        <button
          type="button"
          className="underline cursor-pointer"
          style={{
            background: btnGrad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            border: "none",
            padding: 0,
            fontWeight: 700,
            fontFamily: FONT,
            fontSize: 13,
            textUnderlineOffset: 3,
          }}
        >
          Reset
        </button>
      </div>
    </>
  );
}

/* ──────────────────────────── VERIFY ──────────────────────────── */
function VerifyView({ c, font, primaryBtnStyle, btnGrad, onVerify }: {
  c: Record<string, string>;
  font: React.CSSProperties;
  primaryBtnStyle: (enabled: boolean) => React.CSSProperties;
  btnGrad: string;
  onVerify: () => void;
}) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [seconds, setSeconds] = useState(594); // 9:54 like original
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const enabled = digits.every(d => d !== "");

  const updateDigit = (i: number, v: string) => {
    const ch = v.replace(/\D/g, "").slice(-1);
    setDigits(prev => { const next = [...prev]; next[i] = ch; return next; });
    if (ch && i < 5) inputs.current[i + 1]?.focus();
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  return (
    <>
      <h1 className="mb-3" style={{ ...font, fontSize: 32, fontWeight: 600, lineHeight: "38px", color: c.text }}>
        Verify your{" "}
        <span
          style={{
            background: btnGrad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          code
        </span>
      </h1>
      <p className="mb-8" style={{ ...font, fontSize: 14, color: c.muted }}>
        We sent a 6-digit code to{" "}
        <span style={{ fontWeight: 600, color: c.text }}>l***********e@amyntagroup.com</span>
      </p>

      <div className="flex gap-2 mb-3 w-full">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => { inputs.current[i] = el; }}
            value={d}
            onChange={e => updateDigit(i, e.target.value)}
            onKeyDown={e => onKeyDown(i, e)}
            inputMode="numeric"
            maxLength={1}
            className="text-center transition-all flex-1 min-w-0"
            style={{
              fontFamily: FONT,
              aspectRatio: "1 / 1",
              borderRadius: 10,
              border: `1px solid ${c.border}`,
              background: c.cardBg,
              color: c.text,
              fontSize: 22,
              fontWeight: 600,
              outline: "none",
              padding: 0,
            }}
            onFocus={e => {
              e.currentTarget.style.border = "1px solid transparent";
              e.currentTarget.style.background = `linear-gradient(${c.cardBg},${c.cardBg}) padding-box, ${btnGrad} border-box`;
            }}
            onBlur={e => {
              e.currentTarget.style.border = `1px solid ${c.border}`;
              e.currentTarget.style.background = c.cardBg;
            }}
          />
        ))}
      </div>

      <p className="mb-7" style={{ ...font, fontSize: 12, color: c.muted }}>
        Code expires in <span style={{ fontWeight: 600, color: c.text }}>{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</span>
      </p>

      <button type="button" disabled={!enabled} onClick={onVerify} style={primaryBtnStyle(enabled)}>
        Verify
      </button>

      <div className="mt-5" style={{ ...font, fontSize: 13, color: c.muted }}>
        Didn&apos;t get the code?{" "}
        <button
          type="button"
          onClick={() => setSeconds(594)}
          className="underline cursor-pointer"
          style={{
            background: btnGrad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            border: "none",
            padding: 0,
            fontWeight: 700,
            fontFamily: FONT,
            fontSize: 13,
            textUnderlineOffset: 3,
          }}
        >
          Resend
        </button>
      </div>
    </>
  );
}

/* ──────────────────────────── CREATE PASSWORD ──────────────────────────── */
function CreateView({ c, font, inputStyle, labelStyle, primaryBtnStyle, btnGrad, isDark, onContinue }: {
  c: Record<string, string>;
  font: React.CSSProperties;
  inputStyle: React.CSSProperties;
  labelStyle: React.CSSProperties;
  primaryBtnStyle: (enabled: boolean) => React.CSSProperties;
  btnGrad: string;
  isDark: boolean;
  onContinue: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const rules = [
    { label: "Minimum 8 characters",        ok: password.length >= 8 },
    { label: "At least 1 uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "At least 1 lowercase letter", ok: /[a-z]/.test(password) },
    { label: "At least 1 number",           ok: /\d/.test(password) },
    { label: "At least 1 special character", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const allValid = rules.every(r => r.ok) && password === confirm && email.trim().length > 0;

  return (
    <>
      <h1 className="mb-3" style={{ ...font, fontSize: 32, fontWeight: 600, lineHeight: "38px", color: c.text }}>
        Create{" "}
        <span
          style={{
            background: btnGrad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Password
        </span>
      </h1>
      <p className="mb-8" style={{ ...font, fontSize: 14, color: c.muted }}>
        Set a password to finish activating your account.
      </p>

      <div className="mb-5">
        <label style={labelStyle}>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="name@example.com"
          style={inputStyle}
        />
      </div>

      <div className="mb-5">
        <label style={labelStyle}>Password</label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ ...inputStyle, paddingRight: 40 }}
          />
          <button
            type="button"
            onClick={() => setShowPw(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            style={{ color: c.muted, background: "transparent", border: "none", padding: 0, lineHeight: 0 }}
          >
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="mb-5">
        <label style={labelStyle}>Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            style={{ ...inputStyle, paddingRight: 40 }}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            style={{ color: c.muted, background: "transparent", border: "none", padding: 0, lineHeight: 0 }}
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div
        className="rounded-2xl px-6 py-5 mb-7"
        style={{
          background: isDark ? "rgba(255,255,255,0.03)" : "rgba(249,250,251,0.5)",
          border: `1px solid ${c.border}`,
        }}
      >
        <div className="mb-4" style={{ ...font, fontSize: 15, fontWeight: 500, color: c.muted }}>
          Password requirements
        </div>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
          {rules.map(r => (
            <li
              key={r.label}
              className="flex items-center gap-2.5"
              style={{
                ...font,
                fontSize: 13,
                color: r.ok ? (isDark ? "#A7F3D0" : "#3FA88F") : c.muted,
                transition: "color 0.15s",
              }}
            >
              {r.ok
                ? <Check className="w-4 h-4 flex-shrink-0" strokeWidth={3} style={{ color: "#3FA88F" }} />
                : <X className="w-4 h-4 flex-shrink-0" strokeWidth={3} style={{ color: "#A614C3" }} />}
              <span>{r.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <button type="button" disabled={!allValid} onClick={onContinue} style={primaryBtnStyle(allValid)}>
        Continue
      </button>

      <div className="mt-5" style={{ ...font, fontSize: 13, color: c.muted }}>
        Already have an account?{" "}
        <button
          type="button"
          className="underline cursor-pointer"
          style={{
            background: btnGrad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            border: "none",
            padding: 0,
            fontWeight: 700,
            fontFamily: FONT,
            fontSize: 13,
            textUnderlineOffset: 3,
          }}
        >
          Sign in
        </button>
      </div>
    </>
  );
}
