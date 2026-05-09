"use client";

import { useState, useEffect } from "react";
import { useSearch } from "@/lib/search-context";
import { MessageSquare, Paperclip } from "lucide-react";
import { createSeedData } from "@/data/sim-data";
import { getAllTaskData, type TaskEntry } from "@/lib/taskStore";
import { TaskDetailPanel, type MhsTask, mkColor, deadlineInfo, formatDate } from "@/components/task-detail-panel";
import { EmptyState } from "@/components/empty-state";
import { SkeletonCard } from "@/components/ui/skeleton";

const allData = createSeedData().mahasiswa;

function effectiveStatus(task: MhsTask, localData?: TaskEntry): string {
  if (localData?.completed) return "selesai";
  return task.status;
}

/* ── Helpers ─────────────────────────────────── */
const PRIORITY_BORDER = {
  kritis:  "border-l-[3px] border-l-mhs-rose",
  tinggi:  "border-l-[3px] border-l-mhs-rose",
  sedang:  "border-l-[3px] border-l-mhs-amber",
  rendah:  "border-l-[3px] border-l-mhs-green",
};
const PRIORITY_DOT = {
  kritis:  "bg-mhs-rose",
  tinggi:  "bg-mhs-rose",
  sedang:  "bg-mhs-amber",
  rendah:  "bg-mhs-green",
};
const PRIORITY_LABEL = {
  kritis:  { cls: "bg-mhs-rose/15 text-mhs-rose",   label: "Kritis"  },
  tinggi:  { cls: "bg-mhs-rose/10 text-mhs-rose",    label: "Tinggi"  },
  sedang:  { cls: "bg-mhs-amber/15 text-mhs-amber",  label: "Sedang"  },
  rendah:  { cls: "bg-mhs-green/15 text-mhs-green",  label: "Rendah"  },
};
/* ── Kanban column config ────────────────────── */
const COLUMNS = [
  { id: "belum mulai",       label: "Belum Mulai", dot: "bg-mhs-muted",   headBg: "bg-mhs-muted/8",   headBorder: "border-mhs-muted/20",   countCls: "bg-mhs-muted/15 text-mhs-muted"   },
  { id: "sedang dikerjakan", label: "Dikerjakan",  dot: "bg-mhs-teal",    headBg: "bg-mhs-teal/8",    headBorder: "border-mhs-teal/20",    countCls: "bg-mhs-teal/15 text-mhs-teal"     },
  { id: "menunggu review",   label: "Review",      dot: "bg-mhs-purple",  headBg: "bg-mhs-purple/8",  headBorder: "border-mhs-purple/20",  countCls: "bg-mhs-purple/15 text-mhs-purple" },
  { id: "selesai",           label: "Selesai",     dot: "bg-mhs-green",   headBg: "bg-mhs-green/8",   headBorder: "border-mhs-green/20",   countCls: "bg-mhs-green/15 text-mhs-green"   },
];

/* ── Task Card ───────────────────────────────── */
function TaskCard({ task, localData, onOpen }: { task: MhsTask; localData: TaskEntry | undefined; onOpen: (t: MhsTask) => void }) {
  const status = effectiveStatus(task, localData);
  const dl = deadlineInfo(task.deadline, status === "selesai");
  const pLabel = PRIORITY_LABEL[task.priority as keyof typeof PRIORITY_LABEL] ?? { cls: "bg-mhs-muted/15 text-mhs-muted", label: task.priority };
  const totalComments = (task.comments?.length || 0) + (localData?.comments?.length || 0);
  const totalSubs     = (task.submissions?.length || 0) + (localData?.submissions?.length || 0);

  return (
    <div
      onClick={() => onOpen(task)}
      className={`bg-mhs-surface rounded-xl ${PRIORITY_BORDER[task.priority as keyof typeof PRIORITY_BORDER] ?? "border-l-[3px] border-l-mhs-border"} shadow-[0_2px_12px_rgba(0,0,0,0.07)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group p-4`}
    >
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md truncate max-w-[140px] ${mkColor(task.course)}`}>
          {task.course}
        </span>
        <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded-md shrink-0 ${dl.cls}`}>
          {dl.label}
        </span>
      </div>

      <div className="text-[13.5px] font-semibold text-mhs-text leading-snug mb-1.5 group-hover:text-mhs-amber transition-colors">
        {task.title}
      </div>

      {task.note && (
        <p className="text-[11px] text-mhs-muted leading-relaxed mb-3 line-clamp-2">
          {task.note}
        </p>
      )}

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${task.type === "kelompok" ? "bg-mhs-purple/10 text-mhs-purple" : "bg-mhs-teal/10 text-mhs-teal"}`}>
          {task.type === "kelompok" ? "👥 Kelompok" : "👤 Individu"}
        </span>
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${pLabel.cls}`}>
          {pLabel.label}
        </span>

        {/* Comment + Submission counts */}
        <div className="ml-auto flex items-center gap-2">
          {totalComments > 0 && (
            <div className="flex items-center gap-0.5 text-mhs-muted">
              <MessageSquare size={11} />
              <span className="text-[10px] font-medium">{totalComments}</span>
            </div>
          )}
          {totalSubs > 0 && (
            <div className="flex items-center gap-0.5 text-mhs-green">
              <Paperclip size={11} />
              <span className="text-[10px] font-medium">{totalSubs}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Kanban Board ────────────────────────────── */
function KanbanBoard({ tasks, storeData, onOpen, filter }: { tasks: MhsTask[]; storeData: Record<string, TaskEntry>; onOpen: (t: MhsTask) => void; filter: string }) {
  const PRIORITY_ORDER: Record<string, number> = { kritis: 0, tinggi: 1, sedang: 2, rendah: 3 };
  const sortFn = (a: MhsTask, b: MhsTask) => {
    const da = new Date(a.deadline).getTime();
    const db = new Date(b.deadline).getTime();
    if (da !== db) return da - db;
    return (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9);
  };
  const active   = tasks.filter(t => effectiveStatus(t, storeData[t.id]) !== "selesai").sort(sortFn);
  const selesai  = tasks.filter(t => effectiveStatus(t, storeData[t.id]) === "selesai").sort(sortFn);

  if (active.length === 0 && selesai.length === 0) {
    const desc =
      filter === "selesai"  ? "Belum ada tugas yang diselesaikan." :
      filter === "deadline" ? "Tidak ada tugas mendesak dalam 7 hari ke depan." :
      "Tidak ada tugas yang cocok dengan filter ini.";
    return <EmptyState icon="📭" title="Tidak ada tugas" description={desc} theme="mahasiswa" />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        {active.map(task => (
          <TaskCard key={task.id} task={task} localData={storeData[task.id]} onOpen={onOpen} />
        ))}
      </div>

      {selesai.length > 0 && filter !== "selesai" && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-mhs-border" />
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-mhs-green/10 border border-mhs-green/20">
            <div className="w-1.5 h-1.5 rounded-full bg-mhs-green" />
            <span className="text-[11px] font-semibold text-mhs-green uppercase tracking-[0.08em]">
              Selesai · {selesai.length}
            </span>
          </div>
          <div className="flex-1 h-px bg-mhs-border" />
        </div>
      )}

      {selesai.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {selesai.map(task => (
            <TaskCard key={task.id} task={task} localData={storeData[task.id]} onOpen={onOpen} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── List View ───────────────────────────────── */
function ListView({ tasks, storeData, onOpen }: { tasks: MhsTask[]; storeData: Record<string, TaskEntry>; onOpen: (t: MhsTask) => void }) {
  if (tasks.length === 0) {
    return <EmptyState icon="📭" title="Tidak ada tugas" description="Tidak ada tugas yang cocok dengan filter ini." theme="mahasiswa" />;
  }
  return (
    <div className="bg-mhs-card border border-mhs-border rounded-[14px] overflow-hidden">
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr className="bg-mhs-surface/60">
            {["Tugas", "MK", "Deadline", "Status", "Prioritas", ""].map(h => (
              <th key={h} className="text-left py-3 px-4 text-[11px] font-semibold text-mhs-muted uppercase tracking-[0.06em] border-b border-mhs-border">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => {
            const ld = storeData[task.id];
            const status = effectiveStatus(task, ld);
            const dl = deadlineInfo(task.deadline, status === "selesai");
            const totalComments = (task.comments?.length || 0) + (ld?.comments?.length || 0);
            const totalSubs     = (task.submissions?.length || 0) + (ld?.submissions?.length || 0);
            return (
              <tr
                key={task.id}
                onClick={() => onOpen(task)}
                className="border-b border-mhs-border/40 last:border-0 hover:bg-mhs-hover transition-colors group cursor-pointer"
              >
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-1 h-8 rounded-full shrink-0 ${PRIORITY_DOT[task.priority as keyof typeof PRIORITY_DOT] ?? "bg-mhs-border"}`} />
                    <div>
                      <div className="font-medium text-mhs-text group-hover:text-mhs-amber transition-colors">{task.title}</div>
                      <div className="text-[11px] text-mhs-muted mt-0.5 capitalize">{task.type}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${mkColor(task.course)}`}>{task.course}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`font-mono text-[11px] px-2 py-0.5 rounded-md ${dl.cls}`}>{dl.label}</span>
                </td>
                <td className="py-3.5 px-4">
                  {(() => {
                    const map = { "selesai": "bg-mhs-green/15 text-mhs-green", "sedang dikerjakan": "bg-mhs-teal/15 text-mhs-teal", "menunggu review": "bg-mhs-purple/15 text-mhs-purple", "belum mulai": "bg-mhs-muted/15 text-mhs-muted" };
                    return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${map[status as keyof typeof map] ?? "bg-mhs-muted/10 text-mhs-muted"}`}>{status}</span>;
                  })()}
                </td>
                <td className="py-3.5 px-4">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md capitalize ${(PRIORITY_LABEL[task.priority as keyof typeof PRIORITY_LABEL])?.cls ?? "bg-mhs-muted/10 text-mhs-muted"}`}>{task.priority}</span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5 text-mhs-muted">
                    {totalComments > 0 && (
                      <div className="flex items-center gap-1"><MessageSquare size={12} /><span className="text-[10px]">{totalComments}</span></div>
                    )}
                    {totalSubs > 0 && (
                      <div className="flex items-center gap-1 text-mhs-green"><Paperclip size={12} /><span className="text-[10px]">{totalSubs}</span></div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ── Main Page ───────────────────────────────── */
export default function TugasPage() {
  const topbarQ = useSearch();
  const [view, setView]           = useState("kanban");
  const [filter, setFilter]       = useState("semua");
  const [search, setSearch]       = useState("");
  const [selectedTask, setSelectedTask] = useState<MhsTask | null>(null);
  const [storeData, setStoreData] = useState<Record<string, TaskEntry>>({});
  const [loading, setLoading] = useState(true);

  const tasks = allData.tasks.filter(t => t.type === "individu");

  // Load from localStorage on mount
  useEffect(() => {
    setStoreData(getAllTaskData());
    setLoading(false);
  }, []);

  function refreshStore() {
    setStoreData(getAllTaskData());
  }

  const filtered = tasks.filter(t => {
    const matchFilter =
      filter === "semua"    ? true :
      filter === "aktif"    ? effectiveStatus(t, storeData[t.id]) !== "selesai" :
      filter === "selesai"  ? effectiveStatus(t, storeData[t.id]) === "selesai" :
      filter === "deadline" ? (() => { const d = Math.ceil((new Date(t.deadline).getTime() - Date.now()) / 86400000); return d >= 0 && d <= 7 && effectiveStatus(t, storeData[t.id]) !== "selesai"; })() : true;
    const term = search || topbarQ;
    const matchSearch = term === "" || t.title.toLowerCase().includes(term.toLowerCase()) || t.course.toLowerCase().includes(term.toLowerCase());
    return matchFilter && matchSearch;
  });

  const filterTabs = [
    { id: "semua",   label: "Semua",   count: tasks.length },
    { id: "aktif",   label: "Aktif",   count: tasks.filter(t => effectiveStatus(t, storeData[t.id]) !== "selesai").length },
    { id: "selesai", label: "Selesai", count: tasks.filter(t => effectiveStatus(t, storeData[t.id]) === "selesai").length },
    { id: "deadline",  label: "Mendesak",  count: tasks.filter(t => { const d = Math.ceil((new Date(t.deadline).getTime() - Date.now()) / 86400000); return d >= 0 && d <= 7 && effectiveStatus(t, storeData[t.id]) !== "selesai"; }).length },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* DETAIL PANEL */}
      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          localData={storeData[selectedTask.id]}
          onClose={() => setSelectedTask(null)}
          onSubmitted={() => refreshStore()}
          onCommented={() => refreshStore()}
        />
      )}

      {/* PAGE HEADER */}
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[11px] text-mhs-muted uppercase tracking-[0.1em] mb-0.5">Modul</div>
          <div className="font-serif text-[26px] text-mhs-text leading-tight">
            Manajemen <span className="text-mhs-amber">Tugas</span>
          </div>
          <div className="text-[12px] text-mhs-muted mt-1">Semester Genap 2025/2026 · {tasks.length} tugas total</div>
        </div>
      </div>

      {/* FILTER + SEARCH + VIEW TOGGLE */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-0.5 bg-mhs-surface border border-mhs-border rounded-xl p-1">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg transition-all ${
                filter === tab.id ? "bg-mhs-card text-mhs-text shadow-sm" : "text-mhs-muted hover:text-mhs-text"
              }`}
            >
              {tab.label}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${filter === tab.id ? "bg-mhs-amber/20 text-mhs-amber" : "bg-mhs-border/60 text-mhs-muted"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-[220px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mhs-muted text-[13px]">🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari tugas…"
            className="w-full bg-mhs-card border border-mhs-border text-mhs-text pl-8 pr-3 py-2 rounded-xl text-[12px] outline-none focus:border-mhs-amber transition-colors placeholder:text-mhs-muted"
          />
        </div>
        <div className="ml-auto flex items-center gap-1.5 bg-mhs-surface border border-mhs-border rounded-xl p-1">
          <button onClick={() => setView("kanban")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${view === "kanban" ? "bg-mhs-card text-mhs-text shadow-sm" : "text-mhs-muted hover:text-mhs-text"}`}>
            <span>⊞</span> Kanban
          </button>
          <button onClick={() => setView("list")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${view === "list" ? "bg-mhs-card text-mhs-text shadow-sm" : "text-mhs-muted hover:text-mhs-text"}`}>
            <span>☰</span> List
          </button>
        </div>
      </div>

      {/* BOARD / LIST */}
      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : view === "kanban" ? (
        <KanbanBoard tasks={filtered} storeData={storeData} onOpen={setSelectedTask} filter={filter} />
      ) : (
        <ListView tasks={filtered} storeData={storeData} onOpen={setSelectedTask} />
      )}
    </div>
  );
}
