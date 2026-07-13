"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Globe, Eye, EyeOff, Mail, KeyRound, X, ArrowLeft, CheckCircle2, Loader2, Database, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";

type ForgotStep = "input" | "otp" | "reset" | "success";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f172a]" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loginMode, setLoginMode] = useState("nim");
  const [role, setRole] = useState(() => {
    const r = searchParams.get("role");
    return r === "dosen" || r === "mahasiswa" || r === "admin" || r === "staff_tu" ? r : "mahasiswa";
  });
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  // Forgot password state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<ForgotStep>("input");
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [forgotIdentifierError, setForgotIdentifierError] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [resetError, setResetError] = useState("");
  const [loading, setLoading] = useState(false);

  const openForgot = () => {
    setForgotStep("input");
    setForgotIdentifier("");
    setForgotIdentifierError("");
    setOtpValue("");
    setOtpError("");
    setNewPassword("");
    setConfirmPassword("");
    setResetError("");
    setLoading(false);
    setForgotOpen(true);
  };

  const closeForgot = () => setForgotOpen(false);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) {
      setForgotIdentifierError("Email atau NIM/NIDN tidak boleh kosong.");
      return;
    }
    setForgotIdentifierError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setForgotStep("otp");
    }, 1400);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue !== "123456") {
      setOtpError("Kode OTP salah. Gunakan kode: 123456 (demo).");
      return;
    }
    setOtpError("");
    setForgotStep("reset");
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setResetError("Password minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError("Konfirmasi password tidak cocok.");
      return;
    }
    setResetError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setForgotStep("success");
    }, 1200);
  };

  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError("");
    setError(false);

    // Validasi basic
    if (!credential.trim()) {
      setValidationError("NIM/NIDN atau Email tidak boleh kosong");
      return;
    }
    if (password.length < 6) {
      setValidationError("Password minimal harus 6 karakter");
      return;
    }

    // Cek Demo Mode (Fallback default)
    const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
    if (isDemo) {
      // Logic login bypass untuk demo/mock data
      if (credential && password === "123456") {
        const routes: Record<string, string> = {
          dosen: "/dosen",
          admin: "/admin",
          staff_tu: "/staff-tu",
        };
        router.push(routes[role] ?? "/mahasiswa");
      } else {
        setError(true);
      }
      return;
    }

    // Login sesungguhnya ke database menggunakan NextAuth
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        username: credential.trim(),
        password,
        role: role.toUpperCase(),
        redirect: false,
      });

      if (result?.error) {
        setError(true);
      } else {
        const routes: Record<string, string> = {
          MAHASISWA: "/mahasiswa",
          DOSEN: "/dosen",
          ADMIN: "/admin",
          STAFF_TU: "/staff-tu",
        };
        router.push(routes[role.toUpperCase()] ?? "/mahasiswa");
      }
    } catch (err) {
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-['Inter',sans-serif]">
      {/* Left Column: Image Area */}
      <div className="relative hidden md:flex flex-col justify-end p-12 overflow-hidden bg-[#2563eb]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/Unpam-Victor.jpeg" 
            alt="Universitas Pamulang" 
            className="w-full h-full object-cover mix-blend-overlay opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-700/90 via-blue-600/50 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={18} />
            <span className="text-sm font-medium tracking-wide">Platform E-Learning Resmi Universitas Pamulang</span>
          </div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight">AcadTrack</h1>
          <p className="text-blue-100 text-[15px]">
            Sistem pembelajaran digital terintegrasi untuk mahasiswa dan dosen
          </p>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="flex flex-col justify-center items-center p-8 bg-[#1e293b] text-white">
        <div className="w-full max-w-[400px]">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
             <span className="text-[#3b82f6] font-bold text-4xl italic mr-1">S</span>
             <div className="flex flex-col leading-none">
               <span className="text-white font-bold text-2xl tracking-tight leading-none">Acad<span className="text-[#facc15]">Track</span></span>
               <span className="text-[9px] font-semibold text-[#94a3b8] tracking-widest">Smart, Innovative, Future-ready</span>
             </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">Selamat Datang Kembali</h2>
            <p className="text-[#94a3b8] text-[14px]">Silakan login untuk mengakses platform pembelajaran</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-6 flex items-center justify-center text-center">
              NIM atau Password Salah, Silahkan Periksa Kembali
            </div>
          )}

          {validationError && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm p-3 rounded-lg mb-6 flex items-center justify-center text-center">
              {validationError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="flex bg-[#334155]/50 border border-[#475569] rounded-xl p-1 mb-2">
              <button
                type="button"
                onClick={() => setLoginMode("nim")}
                className={cn(
                  "flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                  loginMode === "nim" ? "bg-blue-600 text-white shadow-md" : "text-[#94a3b8] hover:text-white hover:bg-[#1e293b]"
                )}
              >
                NIM / NIDN
              </button>
              <button
                type="button"
                onClick={() => setLoginMode("email")}
                className={cn(
                  "flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                  loginMode === "email" ? "bg-blue-600 text-white shadow-md" : "text-[#94a3b8] hover:text-white hover:bg-[#1e293b]"
                )}
              >
                Email Kampus
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-medium text-[#e2e8f0]">
                {loginMode === "nim" ? "NIM / NIDN" : "Email Kampus (@unpam.ac.id)"}
              </label>
              <input
                type="text"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                placeholder={loginMode === "nim" ? "Masukkan NIM atau NIDN" : "email@unpam.ac.id"}
                className="w-full bg-[#334155]/50 border border-[#475569] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-[#64748b]"
              />
            </div>

            <div className="space-y-2 relative">
              <label className="text-[13px] font-medium text-[#e2e8f0]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#334155]/50 border border-[#475569] text-white rounded-lg pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-[#64748b]"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-medium text-[#e2e8f0]">Login Sebagai</label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#334155]/50 border border-[#475569] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none cursor-pointer"
                >
                  <option value="mahasiswa" className="bg-[#1e293b]">Mahasiswa</option>
                  <option value="dosen" className="bg-[#1e293b]">Dosen</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-start">
              <button
                type="button"
                onClick={openForgot}
                className="text-blue-500 hover:text-blue-400 text-[13px] font-medium transition-colors"
              >
                Lupa password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors mt-2"
            >
              Masuk
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center">
            <div className="flex-1 h-px bg-[#334155]"></div>
            <span className="px-4 text-[#64748b] text-[12px]">Atau lanjutkan dengan</span>
            <div className="flex-1 h-px bg-[#334155]"></div>
          </div>

          <div className="mt-6 space-y-3">
            <button 
              type="button"
              onClick={() => {
                const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
                if (isDemo) {
                  router.push(role === "dosen" ? "/dosen" : role === "admin" ? "/admin" : role === "staff_tu" ? "/staff-tu" : "/mahasiswa");
                } else {
                  signIn("google");
                }
              }}
              className="w-full bg-[#334155]/50 hover:bg-[#334155] border border-[#475569] text-white font-medium py-3 rounded-xl flex items-center justify-center gap-3 transition-colors text-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            
            <button 
              type="button"
              onClick={() => {
                const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
                if (isDemo) {
                  router.push(role === "dosen" ? "/dosen" : role === "admin" ? "/admin" : role === "staff_tu" ? "/staff-tu" : "/mahasiswa");
                } else {
                  signIn("google");
                }
              }}
              className="w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-400 font-medium py-3 rounded-xl flex items-center justify-center gap-3 transition-colors text-sm"
            >
              <KeyRound size={18} />
              SSO Terpadu
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* ── Forgot Password Modal ─────────────────── */}
    {forgotOpen && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      >
        <div className="w-full max-w-[420px] bg-[#1e293b] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#334155]">
            <div className="flex items-center gap-3">
              {forgotStep !== "input" && forgotStep !== "success" && (
                <button
                  type="button"
                  onClick={() => setForgotStep(forgotStep === "otp" ? "input" : "otp")}
                  className="text-[#94a3b8] hover:text-white transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <div>
                <h3 className="text-white font-semibold text-[15px]">
                  {forgotStep === "input" && "Reset Password"}
                  {forgotStep === "otp" && "Verifikasi OTP"}
                  {forgotStep === "reset" && "Buat Password Baru"}
                  {forgotStep === "success" && "Berhasil!"}
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  {(["input","otp","reset"] as ForgotStep[]).map((s, i) => (
                    <div
                      key={s}
                      className={cn(
                        "h-1 rounded-full transition-all duration-300",
                        forgotStep === "success"
                          ? "w-8 bg-emerald-500"
                          : i <= ["input","otp","reset"].indexOf(forgotStep)
                            ? "w-8 bg-blue-500"
                            : "w-4 bg-[#334155]"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={closeForgot}
              className="text-[#64748b] hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-6 py-6">

            {/* Step 1: Input identifier */}
            {forgotStep === "input" && (
              <form onSubmit={handleSendOTP} className="space-y-5">
                <p className="text-[#94a3b8] text-[13px] leading-relaxed">
                  Masukkan email kampus atau NIM/NIDN Anda. Kode OTP akan dikirim ke email terdaftar.
                </p>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-[#e2e8f0]">Email / NIM / NIDN</label>
                  <input
                    type="text"
                    value={forgotIdentifier}
                    onChange={(e) => { setForgotIdentifier(e.target.value); setForgotIdentifierError(""); }}
                    placeholder="email@unpam.ac.id atau NIM/NIDN"
                    className={cn(
                      "w-full bg-[#334155]/50 border text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-colors placeholder:text-[#64748b]",
                      forgotIdentifierError
                        ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/30"
                        : "border-[#475569] focus:border-blue-500 focus:ring-blue-500"
                    )}
                    autoFocus
                  />
                  {forgotIdentifierError && (
                    <p className="text-red-400 text-[12px]">{forgotIdentifierError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Mengirim...</> : "Kirim Kode OTP"}
                </button>
              </form>
            )}

            {/* Step 2: OTP */}
            {forgotStep === "otp" && (
              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <p className="text-[#94a3b8] text-[13px] leading-relaxed">
                  Kode OTP 6 digit telah dikirim ke email yang terdaftar untuk{" "}
                  <span className="text-white font-medium">{forgotIdentifier}</span>.
                </p>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2.5 text-[12px] text-blue-400">
                  Demo: gunakan kode <span className="font-bold tracking-widest">123456</span>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-[#e2e8f0]">Kode OTP</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) => { setOtpValue(e.target.value.replace(/\D/g, "")); setOtpError(""); }}
                    placeholder="______"
                    className={cn(
                      "w-full bg-[#334155]/50 border text-white rounded-lg px-4 py-3 text-sm text-center tracking-[0.5em] font-mono focus:outline-none focus:ring-1 transition-colors placeholder:text-[#64748b] placeholder:tracking-normal",
                      otpError
                        ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/30"
                        : "border-[#475569] focus:border-blue-500 focus:ring-blue-500"
                    )}
                    autoFocus
                  />
                  {otpError && <p className="text-red-400 text-[12px]">{otpError}</p>}
                </div>
                <div className="flex flex-col gap-2.5">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    Verifikasi
                  </button>
                  <button
                    type="button"
                    onClick={() => { setForgotStep("input"); setOtpValue(""); setOtpError(""); }}
                    className="text-[#64748b] hover:text-[#94a3b8] text-[13px] transition-colors"
                  >
                    Tidak menerima kode? Kirim ulang
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: New password */}
            {forgotStep === "reset" && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <p className="text-[#94a3b8] text-[13px] leading-relaxed">
                  Buat password baru untuk akun Anda.
                </p>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-[#e2e8f0]">Password Baru</label>
                  <div className="relative">
                    <input
                      type={showNewPw ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setResetError(""); }}
                      placeholder="Min. 8 karakter"
                      className="w-full bg-[#334155]/50 border border-[#475569] text-white rounded-lg pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-[#64748b]"
                      autoFocus
                    />
                    <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-white transition-colors">
                      {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-[#e2e8f0]">Konfirmasi Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPw ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setResetError(""); }}
                      placeholder="Ulangi password baru"
                      className="w-full bg-[#334155]/50 border border-[#475569] text-white rounded-lg pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-[#64748b]"
                    />
                    <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-white transition-colors">
                      {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                {resetError && <p className="text-red-400 text-[12px]">{resetError}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Menyimpan...</> : "Simpan Password Baru"}
                </button>
              </form>
            )}

            {/* Step 4: Success */}
            {forgotStep === "success" && (
              <div className="text-center space-y-5 py-2">
                <div className="flex justify-center">
                  <CheckCircle2 size={56} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-white font-semibold text-[16px]">Password Berhasil Direset!</p>
                  <p className="text-[#94a3b8] text-[13px] mt-1.5">
                    Silakan login menggunakan password baru Anda.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeForgot}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  Kembali ke Login
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    )}
    </>
  );
}
