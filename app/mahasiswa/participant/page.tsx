"use client";

import { useSearch } from "@/lib/search-context";
import { PARTICIPANTS } from "@/lib/students-data";

export default function ParticipantPage() {
  const q = useSearch().toLowerCase();
  const participants = PARTICIPANTS.filter(
    (p) =>
      !q ||
      p.nama.toLowerCase().includes(q) ||
      p.nim.includes(q) ||
      p.email.toLowerCase().includes(q)
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-[11px] text-mhs-muted uppercase tracking-[0.1em] mb-0.5">Modul</div>
        <div className="font-serif text-[22px] text-mhs-text">
          Daftar <span className="text-mhs-amber">Peserta</span>
        </div>
        <div className="text-[13px] text-mhs-muted mt-1">
          {participants.length} mahasiswa{q ? " ditemukan" : " terdaftar pada kelas ini"}
        </div>
      </div>

      {participants.length === 0 ? (
        <div className="bg-mhs-card border border-mhs-border rounded-[12px] p-10 text-center text-mhs-muted">
          Tidak ada peserta yang cocok dengan pencarian &quot;{q}&quot;.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {participants.map((p) => (
            <div
              key={p.nim}
              className="bg-mhs-card border border-mhs-border rounded-[12px] px-6 py-5 grid grid-cols-2 gap-x-8 gap-y-3"
            >
              <div>
                <div className="text-[11px] text-mhs-muted uppercase tracking-[0.08em] mb-0.5">NIM</div>
                <div className="text-[15px] font-medium text-mhs-text">{p.nim}</div>
              </div>
              <div>
                <div className="text-[11px] text-mhs-muted uppercase tracking-[0.08em] mb-0.5">Nama</div>
                <div className="text-[15px] font-medium text-mhs-text uppercase">{p.nama}</div>
              </div>
              <div className="col-span-2">
                <div className="text-[11px] text-mhs-muted uppercase tracking-[0.08em] mb-0.5">Email</div>
                <div className="text-[14px] text-mhs-text">{p.email}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
