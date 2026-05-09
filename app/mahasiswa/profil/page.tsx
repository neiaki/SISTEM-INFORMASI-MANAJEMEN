"use client";

import React, { useState } from "react";
import { Camera, Mail, Phone, MapPin, BookOpen, Calendar, Shield, Bell, Edit3, Save, X, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const PROFILE = {
  name: "Febiyanto Rizki Qurbandi",
  nim: "231011450284",
  email: "eki.kurniawan@student.univ.ac.id",
  phone: "081234567890",
  address: "Jl. Merdeka No. 12, Bandung, Jawa Barat",
  faculty: "Fakultas Ilmu Komputer",
  department: "Teknik Informatika",
  semester: "Semester 6",
  year: "2022",
  gpa: "3.72",
  credits: "108",
  advisor: "Dr. Raka Pratama, M.Kom.",
  status: "Aktif",
};

const ACADEMIC = [
  { label: "IPK Kumulatif", value: "3.72 / 4.00", icon: "🏆", color: "text-mhs-teal" },
  { label: "SKS Ditempuh", value: "108 SKS", icon: "📚", color: "text-mhs-amber" },
  { label: "Semester", value: "Semester 6", icon: "📅", color: "text-mhs-purple" },
  { label: "Dosen Wali", value: "Dr. Raka Pratama", icon: "👨‍🏫", color: "text-mhs-green" },
];

const NOTIFICATIONS_PREFS = [
  { id: "deadline", label: "Pengingat Deadline Tugas", desc: "Notifikasi H-3 dan H-1 sebelum deadline", enabled: true },
  { id: "grade", label: "Nilai Keluar", desc: "Notifikasi saat dosen mengumumkan nilai", enabled: true },
  { id: "comment", label: "Komentar Dosen", desc: "Notifikasi saat dosen memberi komentar pada tugasmu", enabled: true },
  { id: "project", label: "Update Proyek Kelompok", desc: "Notifikasi dari aktivitas kelompokmu", enabled: false },
  { id: "system", label: "Pengumuman Sistem", desc: "Info pemeliharaan dan update platform", enabled: false },
];

interface InfoRowProps {
  label: string;
  value?: string;
  icon?: React.ElementType;
  editable?: boolean;
  editValue?: string;
  onChange?: (v: string) => void;
}

function InfoRow({ label, value, icon: Icon, editable, editValue, onChange }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-mhs-border last:border-0">
      {Icon && <Icon size={16} className="text-mhs-muted mt-0.5 shrink-0" />}
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-mhs-muted uppercase tracking-wider mb-0.5">{label}</div>
        {editable ? (
          <input
            value={editValue}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full bg-mhs-bg border border-mhs-amber/60 text-mhs-text rounded-lg px-3 py-1.5 text-[13.5px] outline-none focus:border-mhs-amber transition-colors"
          />
        ) : (
          <div className="text-[13.5px] font-medium text-mhs-text">{value}</div>
        )}
      </div>
    </div>
  );
}

export default function MahasiswaProfilPage() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ phone: PROFILE.phone, address: PROFILE.address });
  const [notifPrefs, setNotifPrefs] = useState(NOTIFICATIONS_PREFS);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passError, setPassError] = useState("");
  const [passSaved, setPassSaved] = useState(false);

  const handleChangePass = () => {
    setPassError("");
    if (!currentPass) { setPassError("Masukkan kata sandi saat ini."); return; }
    if (newPass.length < 8) { setPassError("Kata sandi baru minimal 8 karakter."); return; }
    if (newPass !== confirmPass) { setPassError("Konfirmasi kata sandi tidak cocok."); return; }
    setCurrentPass(""); setNewPass(""); setConfirmPass("");
    setPassSaved(true);
    setTimeout(() => setPassSaved(false), 3000);
  };

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleNotif = (id: string) => {
    setNotifPrefs(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {saved && (
        <div className="flex items-center gap-2.5 bg-mhs-green/10 border border-mhs-green/30 text-mhs-green px-4 py-3 rounded-xl text-[13.5px] font-medium animate-fadeIn">
          <CheckCircle size={16} />
          Perubahan berhasil disimpan.
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-mhs-surface rounded-2xl border border-mhs-border overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-mhs-amber/20 via-mhs-purple/15 to-mhs-teal/20 relative">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(245,158,11,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(13,148,136,0.4) 0%, transparent 50%)" }} />
        </div>

        <div className="px-7 pb-6">
          <div className="flex items-end gap-5 -mt-10 mb-5">
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-mhs-amber to-mhs-purple flex items-center justify-center text-[28px] font-bold text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)] ring-4 ring-mhs-surface">
                EK
              </div>
              <button className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={18} className="text-white" />
              </button>
            </div>
            <div className="mb-1 flex-1">
              <h1 className="text-[20px] font-bold text-mhs-text">{PROFILE.name}</h1>
              <div className="text-[13px] text-mhs-muted">NIM {PROFILE.nim} · {PROFILE.department}</div>
            </div>
            <div className="mb-1 flex gap-2">
              {editing ? (
                <>
                  <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-mhs-border text-mhs-muted hover:text-mhs-text text-[13px] transition-colors">
                    <X size={14} /> Batal
                  </button>
                  <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-mhs-amber text-mhs-on hover:bg-mhs-amber-2 text-[13px] font-semibold transition-colors">
                    <Save size={14} /> Simpan
                  </button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-mhs-border text-mhs-muted hover:text-mhs-text hover:border-mhs-amber/50 text-[13px] transition-colors">
                  <Edit3 size={14} /> Edit Profil
                </button>
              )}
            </div>
          </div>

          {/* Academic stats strip */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {ACADEMIC.map(item => (
              <div key={item.label} className="bg-mhs-card rounded-xl p-3 border border-mhs-border">
                <div className="text-[20px] mb-1">{item.icon}</div>
                <div className={cn("text-[15px] font-bold", item.color)}>{item.value}</div>
                <div className="text-[11px] text-mhs-muted mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Info Columns */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-[11px] text-mhs-muted uppercase tracking-wider font-semibold mb-2">Informasi Pribadi</h3>
              <InfoRow label="Nama Lengkap" value={PROFILE.name} icon={undefined} />
              <InfoRow label="Nomor Induk Mahasiswa" value={PROFILE.nim} icon={undefined} />
              <InfoRow label="Email Kampus" value={PROFILE.email} icon={Mail} />
              <InfoRow label="Nomor HP" value={PROFILE.phone} icon={Phone} editable={editing} editValue={form.phone} onChange={v => setForm(f => ({...f, phone: v}))} />
              <InfoRow label="Alamat" value={PROFILE.address} icon={MapPin} editable={editing} editValue={form.address} onChange={v => setForm(f => ({...f, address: v}))} />
            </div>
            <div>
              <h3 className="text-[11px] text-mhs-muted uppercase tracking-wider font-semibold mb-2">Informasi Akademik</h3>
              <InfoRow label="Fakultas" value={PROFILE.faculty} icon={BookOpen} />
              <InfoRow label="Program Studi" value={PROFILE.department} icon={undefined} />
              <InfoRow label="Tahun Masuk" value={PROFILE.year} icon={Calendar} />
              <InfoRow label="Dosen Wali" value={PROFILE.advisor} icon={undefined} />
              <InfoRow label="Status" value={PROFILE.status} icon={undefined} />
            </div>
          </div>
        </div>
      </div>

      {/* Security & Notifications row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Security */}
        <div className="bg-mhs-surface rounded-2xl border border-mhs-border p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield size={16} className="text-mhs-amber" />
            <h2 className="text-[15px] font-semibold text-mhs-text">Keamanan Akun</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] text-mhs-muted uppercase tracking-wider mb-1.5">Kata Sandi Saat Ini</label>
              <input type="password" value={currentPass} onChange={e => setCurrentPass(e.target.value)} placeholder="••••••••"
                className="w-full bg-mhs-bg border border-mhs-border text-mhs-text rounded-lg px-3 py-2 text-[13px] outline-none focus:border-mhs-amber transition-colors" />
            </div>
            <div>
              <label className="block text-[11px] text-mhs-muted uppercase tracking-wider mb-1.5">Kata Sandi Baru</label>
              <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Min. 8 karakter"
                className="w-full bg-mhs-bg border border-mhs-border text-mhs-text rounded-lg px-3 py-2 text-[13px] outline-none focus:border-mhs-amber transition-colors" />
            </div>
            <div>
              <label className="block text-[11px] text-mhs-muted uppercase tracking-wider mb-1.5">Konfirmasi Kata Sandi</label>
              <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Ulangi kata sandi baru"
                className="w-full bg-mhs-bg border border-mhs-border text-mhs-text rounded-lg px-3 py-2 text-[13px] outline-none focus:border-mhs-amber transition-colors" />
            </div>
            {passError && (
              <div className="text-[12px] text-mhs-rose bg-mhs-rose/10 border border-mhs-rose/25 rounded-lg px-3 py-2">{passError}</div>
            )}
            {passSaved && (
              <div className="flex items-center gap-1.5 text-[12px] text-mhs-green bg-mhs-green/10 border border-mhs-green/25 rounded-lg px-3 py-2">
                <CheckCircle size={13} /> Kata sandi berhasil diperbarui.
              </div>
            )}
            <button onClick={handleChangePass} className="w-full mt-1 bg-mhs-amber text-mhs-on hover:bg-mhs-amber-2 py-2 rounded-lg text-[13px] font-semibold transition-colors">
              Ganti Kata Sandi
            </button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-mhs-surface rounded-2xl border border-mhs-border p-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell size={16} className="text-mhs-teal" />
            <h2 className="text-[15px] font-semibold text-mhs-text">Preferensi Notifikasi</h2>
          </div>
          <div className="space-y-3">
            {notifPrefs.map(pref => (
              <div key={pref.id} className="flex items-start gap-3">
                <button
                  onClick={() => toggleNotif(pref.id)}
                  className={cn(
                    "w-10 h-[22px] rounded-full relative flex items-center transition-colors shrink-0 mt-0.5",
                    pref.enabled ? "bg-mhs-teal" : "bg-mhs-border"
                  )}
                >
                  <div className={cn("w-4 h-4 rounded-full bg-white shadow-sm absolute transition-all", pref.enabled ? "right-1" : "left-1")} />
                </button>
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-mhs-text">{pref.label}</div>
                  <div className="text-[11px] text-mhs-muted">{pref.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
