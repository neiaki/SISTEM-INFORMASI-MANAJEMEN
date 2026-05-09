"use client";

import React from "react";
import { useSearch } from "@/lib/search-context";
import { PARTICIPANTS } from "@/lib/students-data";
import { EmptyState } from "@/components/empty-state";

function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-mhs-amber/30 text-mhs-text not-italic rounded-sm px-0.5 font-medium">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function ParticipantPage() {
  const q = useSearch().toLowerCase();
  const participants = PARTICIPANTS.filter(
    (p) =>
      !q ||
      p.nama.toLowerCase().includes(q) ||
      p.nim.includes(q) ||
      p.email.toLowerCase().includes(q)
  ).sort((a, b) => a.nama.localeCompare(b.nama));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-[11px] text-mhs-muted uppercase tracking-[0.1em] mb-0.5">Modul</div>
        <div className="font-serif text-[22px] text-mhs-text">
          Daftar <span className="text-mhs-amber">Peserta</span>
        </div>
        <div className="text-[13px] text-mhs-muted mt-1">
          {q
            ? <>{participants.length} dari {PARTICIPANTS.length} mahasiswa ditemukan</>
            : <>{PARTICIPANTS.length} mahasiswa terdaftar pada kelas ini</>
          }
        </div>
      </div>

      {participants.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="Tidak ditemukan"
          description={`Tidak ada peserta dengan kata kunci "${q}".`}
          theme="mahasiswa"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {participants.map((p) => (
            <div
              key={p.nim}
              className="bg-mhs-card border border-mhs-border rounded-[12px] px-6 py-5 grid grid-cols-2 gap-x-8 gap-y-3"
            >
              <div>
                <div className="text-[11px] text-mhs-muted uppercase tracking-[0.08em] mb-0.5">NIM</div>
                <div className="text-[15px] font-medium text-mhs-text">{highlight(p.nim, q)}</div>
              </div>
              <div>
                <div className="text-[11px] text-mhs-muted uppercase tracking-[0.08em] mb-0.5">Nama</div>
                <div className="text-[15px] font-medium text-mhs-text uppercase">{highlight(p.nama, q)}</div>
              </div>
              <div className="col-span-2">
                <div className="text-[11px] text-mhs-muted uppercase tracking-[0.08em] mb-0.5">Email</div>
                <div className="text-[14px] text-mhs-text">{highlight(p.email, q)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
