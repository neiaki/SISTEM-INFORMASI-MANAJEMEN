"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Globe, Eye, EyeOff, ArrowLeft, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("admin");
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (credential && password) {
      router.push(role === "staff_tu" ? "/staff-tu" : "/admin");
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-['Inter',sans-serif]">
      {/* Left Column */}
      <div className="relative hidden md:flex flex-col justify-end p-12 overflow-hidden bg-[#1e3a8a]">
        <div className="absolute inset-0 z-0">
          <img
            src="/Unpam-Victor.jpeg"
            alt="Universitas Pamulang"
            className="w-full h-full object-cover mix-blend-overlay opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a8a]/95 via-[#1e3a8a]/60 to-transparent" />
        </div>
        <div className="relative z-10 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={18} />
            <span className="text-sm font-medium tracking-wide">Portal Administrasi — Universitas Pamulang</span>
          </div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight">AcadTrack</h1>
          <p className="text-blue-200 text-[15px]">
            Akses terbatas untuk Admin Kampus dan Staff TU
          </p>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-col justify-center items-center p-8 bg-[#1e293b] text-white">
        <div className="w-full max-w-[400px]">
          {/* Back link */}
          <Link href="/auth/login" className="flex items-center gap-1.5 text-[#94a3b8] hover:text-white text-[13px] font-medium transition-colors mb-8">
            <ArrowLeft size={15} />
            Kembali ke Login Umum
          </Link>

          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <span className="text-[#3b82f6] font-bold text-4xl italic mr-1">S</span>
            <div className="flex flex-col leading-none">
              <span className="text-white font-bold text-2xl tracking-tight leading-none">Acad<span className="text-[#facc15]">Track</span></span>
              <span className="text-[9px] font-semibold text-[#94a3b8] tracking-widest">Smart, Innovative, Future-ready</span>
            </div>
          </div>

          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 bg-[#7c3aed]/15 border border-[#7c3aed]/30 rounded-full px-4 py-1.5">
              <Shield size={14} className="text-[#a78bfa]" />
              <span className="text-[12px] font-semibold text-[#a78bfa]">Portal Admin & Staff TU</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Login Administrator</h2>
            <p className="text-[#94a3b8] text-[14px]">Akses khusus untuk pengelola sistem kampus</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-5 text-center">
              Kredensial tidak valid. Harap periksa kembali.
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-[#e2e8f0]">ID Admin / NIP</label>
              <input
                type="text"
                value={credential}
                onChange={(e) => { setCredential(e.target.value); setError(false); }}
                placeholder="Masukkan ID Admin atau NIP"
                className="w-full bg-[#334155]/50 border border-[#475569] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors placeholder:text-[#64748b]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-medium text-[#e2e8f0]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(false); }}
                  placeholder="••••••••"
                  className="w-full bg-[#334155]/50 border border-[#475569] text-white rounded-lg pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors placeholder:text-[#64748b]"
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
                  className="w-full bg-[#334155]/50 border border-[#475569] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors appearance-none cursor-pointer"
                >
                  <option value="admin" className="bg-[#1e293b]">Admin Kampus</option>
                  <option value="staff_tu" className="bg-[#1e293b]">Staff TU</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold py-3 rounded-xl transition-colors mt-2"
            >
              Masuk
            </button>
          </form>

          <p className="mt-8 text-center text-[12px] text-[#475569]">
            Akses tidak sah dilarang. Semua aktivitas tercatat.
          </p>
        </div>
      </div>
    </div>
  );
}
