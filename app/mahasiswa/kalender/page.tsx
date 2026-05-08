"use client";

import { useState } from "react";
import { createSeedData } from "@/data/sim-data";

const data = createSeedData().mahasiswa;

const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const DOWS = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

// Per-course color mapping
const COURSE_COLORS: Record<string, string> = {};
const COURSE_DOT_CLASSES: Record<string, string> = {};
const PALETTE = [
  { dot: "bg-mhs-rose",   legend: "bg-mhs-rose"   },
  { dot: "bg-mhs-amber",  legend: "bg-mhs-amber"  },
  { dot: "bg-mhs-teal",   legend: "bg-mhs-teal"   },
  { dot: "bg-mhs-purple", legend: "bg-[#a78bfa]"  },
  { dot: "bg-mhs-green",  legend: "bg-mhs-green"  },
  { dot: "bg-[#60a5fa]",  legend: "bg-[#60a5fa]"  },
];
const allCourses = Array.from(new Set(data.tasks.map(t => t.course)));
allCourses.forEach((course, idx) => {
  const c = PALETTE[idx % PALETTE.length];
  COURSE_COLORS[course] = c.legend;
  COURSE_DOT_CLASSES[course] = c.dot;
});

function getDeadlineDays(year: number, month: number): Record<number, (typeof data.tasks)> {
  const days: Record<number, (typeof data.tasks)> = {};
  data.tasks.forEach(task => {
    const d = new Date(task.deadline);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!days[day]) days[day] = [];
      days[day].push(task);
    }
  });
  return days;
}

export default function KalenderPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const deadlines = getDeadlineDays(year, month);

  const selectedTasks = selectedDay ? (deadlines[selectedDay] ?? []) : [];

  const monthDeadlines = data.tasks.filter(t => {
    const d = new Date(t.deadline);
    return d.getFullYear() === year && d.getMonth() === month;
  }).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  function prevMonth() {
    setSelectedDay(null);
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    setSelectedDay(null);
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-[11px] text-mhs-muted uppercase tracking-[0.1em] mb-0.5">Modul</div>
        <div className="font-serif text-[22px] text-mhs-text">Kalender <span className="text-mhs-amber">Deadline</span></div>
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-5">

        {/* BIG CALENDAR */}
        <div className="flex flex-col gap-4">
          <div className="bg-mhs-card border border-mhs-border rounded-[14px] p-5">
            <div className="flex items-center mb-5">
              <h3 className="font-serif text-[20px] text-mhs-text flex-1">{MONTHS[month]} {year}</h3>
              <button onClick={prevMonth} className="text-mhs-muted hover:text-mhs-text px-2 py-1 rounded transition-colors text-[18px]">‹</button>
              <button onClick={nextMonth} className="text-mhs-muted hover:text-mhs-text px-2 py-1 rounded transition-colors text-[18px]">›</button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {DOWS.map(d => (
                <div key={d} className="text-[10px] text-mhs-muted py-1 font-semibold">{d}</div>
              ))}

              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`prev-${i}`} className="text-[12px] py-2 text-mhs-muted/25 rounded-lg">
                  {prevMonthDays - firstDay + 1 + i}
                </div>
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dl = deadlines[day];
                const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
                const isSelected = selectedDay === day;
                const hasDl = dl && dl.length > 0;

                return (
                  <div key={day} className="relative">
                    <div
                      onClick={() => hasDl ? setSelectedDay(isSelected ? null : day) : undefined}
                      className={`text-[13px] py-2 rounded-lg font-medium transition-colors
                        ${isToday ? "bg-mhs-amber text-mhs-on font-bold" :
                          isSelected ? "bg-mhs-teal/20 text-mhs-teal ring-1 ring-mhs-teal" :
                          hasDl ? "text-mhs-text hover:bg-mhs-hover cursor-pointer" :
                          "text-mhs-muted"
                        }`}
                    >
                      {day}
                    </div>
                    {/* Colored dots per course (max 3) */}
                    {hasDl && !isToday && (
                      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {dl.slice(0, 3).map((task, ti) => (
                          <div key={ti} className={`w-1 h-1 rounded-full ${COURSE_DOT_CLASSES[task.course] ?? "bg-mhs-muted"}`} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Course legend */}
            <div className="mt-4 pt-4 border-t border-mhs-border/60">
              <div className="text-[10px] text-mhs-muted uppercase tracking-[0.08em] mb-2">Legenda Mata Kuliah</div>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {allCourses.map(course => (
                  <div key={course} className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${COURSE_DOT_CLASSES[course]}`} />
                    <span className="text-[11px] text-mhs-muted">{course}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected day detail */}
          {selectedDay && selectedTasks.length > 0 && (
            <div className="bg-mhs-card border border-mhs-teal/30 rounded-[14px] p-4 animate-fadeIn">
              <div className="text-[12px] font-semibold text-mhs-teal mb-3">
                📅 Deadline {selectedDay} {MONTHS[month]} {year}
              </div>
              <div className="flex flex-col gap-2">
                {selectedTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-2.5 p-2.5 bg-mhs-surface rounded-lg">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${COURSE_DOT_CLASSES[task.course] ?? "bg-mhs-muted"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-mhs-text truncate">{task.title}</div>
                      <div className="text-[11px] text-mhs-muted mt-0.5">{task.course} · {task.type}</div>
                    </div>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${task.type === "kelompok" ? "bg-mhs-purple/10 text-mhs-purple" : "bg-mhs-teal/10 text-mhs-teal"}`}>
                      {task.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="flex flex-col gap-4">
          {/* LEGEND urgency */}
          <div className="bg-mhs-card border border-mhs-border rounded-[14px] p-5">
            <div className="text-[13px] font-semibold text-mhs-text mb-3">📌 Urgensi</div>
            <div className="flex flex-col gap-2.5 text-[12px] text-mhs-muted">
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-mhs-rose shrink-0" /><span>Mendesak (≤3 hari)</span></div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-mhs-amber shrink-0" /><span>Dekat (≤7 hari)</span></div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-mhs-teal shrink-0" /><span>Normal</span></div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-mhs-amber border-2 border-mhs-on shrink-0" /><span>Hari Ini</span></div>
            </div>
          </div>

          {/* EVENT LIST */}
          <div className="bg-mhs-card border border-mhs-border rounded-[14px] p-5">
            <h3 className="text-[14px] font-semibold text-mhs-text mb-4">📋 Event Bulan Ini</h3>
            {monthDeadlines.length === 0 && (
              <div className="text-center py-8 text-mhs-muted text-[13px]">Tidak ada deadline bulan ini</div>
            )}
            <div className="space-y-2.5">
              {monthDeadlines.map(task => {
                const d = new Date(task.deadline);
                const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                const isUrgent = diff <= 3;
                return (
                  <div key={task.id} className="flex items-start gap-2.5 pb-2.5 border-b border-mhs-border/50 last:border-0 last:pb-0">
                    <div className={`w-10 text-center rounded-lg py-1 shrink-0 ${isUrgent ? "bg-mhs-rose/15 border border-mhs-rose/30" : "bg-mhs-border"}`}>
                      <div className={`font-serif text-[18px] leading-none ${isUrgent ? "text-mhs-rose" : "text-mhs-text"}`}>
                        {String(d.getDate()).padStart(2, "0")}
                      </div>
                      <div className="text-[9px] text-mhs-muted uppercase tracking-wider">
                        {MONTHS[d.getMonth()].slice(0, 3)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${COURSE_DOT_CLASSES[task.course] ?? "bg-mhs-muted"}`} />
                        <div className="text-[13px] font-medium text-mhs-text truncate">{task.title}</div>
                      </div>
                      <div className="text-[11px] text-mhs-muted">{task.course}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
