"use client";

import { useState, useEffect } from "react";
import { X, Plus, UserPlus, Search, Check, Users } from "lucide-react";
import { Toast, type ToastType } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { useSearch } from "@/lib/search-context";

type Member = { nim: string; nama: string; role: string; joinedAt: string };
type Group = {
  id: string;
  name: string;
  course: string;
  maxSize: number;
  createdBy: string;
  mode: "mahasiswa" | "dosen_manual" | "dosen_random";
  members: Member[];
  createdAt: string;
  isOpen?: boolean;
};
type InvStatus = "pending" | "accepted" | "declined";
type Invitation = {
  id: string;
  kelompokId: string;
  kelompokName: string;
  course: string;
  fromNim: string;
  fromNama: string;
  toNim: string;
  toNama: string;
  status: InvStatus;
  sentAt: string;
};
type JoinReqStatus = "pending" | "accepted" | "declined";
type JoinRequest = {
  id: string;
  groupId: string;
  groupName: string;
  course: string;
  fromNim: string;
  fromNama: string;
  status: JoinReqStatus;
  sentAt: string;
};

const ME = { nim: "231011450284", nama: "Hendra Saputra" };

const COURSES = [
  "Analisis SI",
  "Keamanan Sistem",
  "SI Enterprise",
  "PPL",
  "Interaksi Manusia & Komputer",
];

const ALL_STUDENTS = [
  { nim: "221011400114", nama: "ALDI AL KAHFI" },
  { nim: "231011450403", nama: "Andi Pratama" },
  { nim: "231011400651", nama: "Budi Santoso" },
  { nim: "231011450408", nama: "Candra Wiguna" },
  { nim: "231011450319", nama: "FAJAR NUGRAHA" },
  { nim: "231011400835", nama: "GILANG RAMADHAN" },
  { nim: "221011400227", nama: "HENDRA SAPUTRA" },
  { nim: "231011450512", nama: "INDRA PERMANA" },
  { nim: "231011400943", nama: "JOKO SANTOSO" },
  { nim: "231011450601", nama: "KEVIN ALVARO" },
  { nim: "221011400308", nama: "LUTHFI HAKIM" },
];

const SEED_GROUPS: Group[] = [
  {
    id: "grp-seed-1",
    name: "Kelompok Alfa",
    course: "Analisis SI",
    maxSize: 5,
    createdBy: ME.nim,
    mode: "mahasiswa",
    isOpen: true,
    members: [
      { nim: ME.nim, nama: ME.nama, role: "Leader", joinedAt: "2026-04-01" },
      { nim: "231011450403", nama: "Andi Pratama", role: "Anggota", joinedAt: "2026-04-01" },
      { nim: "231011400651", nama: "Budi Santoso", role: "Anggota", joinedAt: "2026-04-02" },
    ],
    createdAt: "2026-04-01",
  },
];

const SEED_INVITATIONS: Invitation[] = [
  {
    id: "inv-seed-1",
    kelompokId: "grp-ext-1",
    kelompokName: "UX Squad",
    course: "Interaksi Manusia & Komputer",
    fromNim: "231011450319",
    fromNama: "FAJAR NUGRAHA",
    toNim: ME.nim,
    toNama: ME.nama,
    status: "accepted",
    sentAt: "2026-04-20",
  },
  {
    id: "inv-seed-2",
    kelompokId: "grp-ext-2",
    kelompokName: "Tim PPL Alpha",
    course: "PPL",
    fromNim: "231011400835",
    fromNama: "GILANG RAMADHAN",
    toNim: ME.nim,
    toNama: ME.nama,
    status: "declined",
    sentAt: "2026-04-22",
  },
  {
    id: "inv-seed-3",
    kelompokId: "grp-ext-3",
    kelompokName: "Basis Data Gemilang",
    course: "Basis Data",
    fromNim: "231011450601",
    fromNama: "KEVIN ALVARO",
    toNim: ME.nim,
    toNama: ME.nama,
    status: "pending",
    sentAt: "2026-04-23",
  },
  {
    id: "inv-seed-4",
    kelompokId: "grp-ext-4",
    kelompokName: "Keamanan Cyber Tim A",
    course: "Keamanan Sistem",
    fromNim: "231011450512",
    fromNama: "INDRA PERMANA",
    toNim: ME.nim,
    toNama: ME.nama,
    status: "pending",
    sentAt: "2026-04-23",
  },
  {
    id: "inv-seed-5",
    kelompokId: "grp-ext-5",
    kelompokName: "SI Enterprise Force",
    course: "SI Enterprise",
    fromNim: "221011400308",
    fromNama: "LUTHFI HAKIM",
    toNim: ME.nim,
    toNama: ME.nama,
    status: "pending",
    sentAt: "2026-04-24",
  },
];

// Permintaan masuk ke kelompok ME (sebagai ketua) — seed untuk demo
const SEED_JOIN_REQUESTS: JoinRequest[] = [
  {
    id: "jr-seed-1",
    groupId: "grp-seed-1",
    groupName: "Kelompok Alfa",
    course: "Analisis SI",
    fromNim: "231011400943",
    fromNama: "JOKO SANTOSO",
    status: "pending",
    sentAt: "2026-04-28",
  },
  {
    id: "jr-seed-2",
    groupId: "grp-seed-1",
    groupName: "Kelompok Alfa",
    course: "Analisis SI",
    fromNim: "231011450601",
    fromNama: "KEVIN ALVARO",
    status: "pending",
    sentAt: "2026-04-29",
  },
];

const SEED_ROOM_GROUPS: Group[] = [
  {
    id: "room-grp-1",
    name: "Tim Backend Warriors",
    course: "PPL",
    maxSize: 5,
    createdBy: "231011450403",
    mode: "mahasiswa",
    isOpen: true,
    members: [
      { nim: "231011450403", nama: "Andi Pratama", role: "Leader", joinedAt: "2026-04-10" },
      { nim: "231011400651", nama: "Budi Santoso", role: "Anggota", joinedAt: "2026-04-11" },
    ],
    createdAt: "2026-04-10",
  },
  {
    id: "room-grp-2",
    name: "Analisis Kritis Squad",
    course: "Analisis SI",
    maxSize: 4,
    createdBy: "231011450319",
    mode: "mahasiswa",
    isOpen: true,
    members: [
      { nim: "231011450319", nama: "FAJAR NUGRAHA", role: "Leader", joinedAt: "2026-04-12" },
      { nim: "231011400943", nama: "JOKO SANTOSO", role: "Anggota", joinedAt: "2026-04-13" },
    ],
    createdAt: "2026-04-12",
  },
  {
    id: "room-grp-3",
    name: "Keamanan Cyber Tim B",
    course: "Keamanan Sistem",
    maxSize: 6,
    createdBy: "221011400227",
    mode: "mahasiswa",
    isOpen: true,
    members: [
      { nim: "221011400227", nama: "HENDRA SAPUTRA", role: "Leader", joinedAt: "2026-04-15" },
      { nim: "231011450512", nama: "INDRA PERMANA", role: "Anggota", joinedAt: "2026-04-15" },
    ],
    createdAt: "2026-04-15",
  },
  {
    id: "room-grp-4",
    name: "IMK Pro Team",
    course: "Interaksi Manusia & Komputer",
    maxSize: 5,
    createdBy: "221011400114",
    mode: "mahasiswa",
    isOpen: true,
    members: [
      { nim: "221011400114", nama: "ALDI AL KAHFI", role: "Leader", joinedAt: "2026-04-16" },
      { nim: "221011400308", nama: "LUTHFI HAKIM", role: "Anggota", joinedAt: "2026-04-17" },
      { nim: "231011450601", nama: "KEVIN ALVARO", role: "Anggota", joinedAt: "2026-04-17" },
    ],
    createdAt: "2026-04-16",
  },
  {
    id: "room-grp-5",
    name: "Enterprise Vision",
    course: "SI Enterprise",
    maxSize: 5,
    createdBy: "231011400943",
    mode: "mahasiswa",
    isOpen: true,
    members: [
      { nim: "231011400943", nama: "JOKO SANTOSO", role: "Leader", joinedAt: "2026-04-18" },
    ],
    createdAt: "2026-04-18",
  },
  {
    id: "room-grp-6",
    name: "Data Mining Circle",
    course: "Analisis SI",
    maxSize: 4,
    createdBy: "231011400835",
    mode: "mahasiswa",
    isOpen: true,
    members: [
      { nim: "231011400835", nama: "GILANG RAMADHAN", role: "Leader", joinedAt: "2026-04-19" },
    ],
    createdAt: "2026-04-19",
  },
];

const AVATAR_COLORS = [
  "from-mhs-amber to-mhs-purple",
  "from-mhs-rose to-mhs-purple",
  "from-mhs-teal to-mhs-green",
  "from-mhs-amber to-mhs-rose",
  "from-mhs-purple to-mhs-teal",
];
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function KelompokPage() {
  const topbarQ = useSearch();
  const [tab, setTab] = useState<"myGroups" | "invitations" | "room">("myGroups");
  
  // Ambil data kelompok dari backend
  const { data: apiData, mutate: mutateKelompok } = useSWR("/api/kelompok", fetcher);
  
  const [localGroups, setLocalGroups] = useState<Group[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  
  // Mapping dari API ke format UI
  const groups: Group[] = apiData?.kelompoks
    ? apiData.kelompoks.map((k: any) => ({
        id: k.id,
        name: k.namaKelompok,
        course: k.mataKuliah?.namaMk || "Umum",
        maxSize: 5,
        createdBy: k.anggota?.[0]?.mahasiswa?.nim || "",
        mode: "mahasiswa",
        members: k.anggota?.map((a: any) => ({
          nim: a.mahasiswa?.nim,
          nama: a.mahasiswa?.nama,
          role: a.peran,
          joinedAt: new Date(a.createdAt).toISOString().split("T")[0],
        })) || [],
        createdAt: new Date(k.createdAt).toISOString().split("T")[0],
      }))
    : localGroups;

  // Untuk fallback local groups
  const setGroups = setLocalGroups;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [inviteForGroup, setInviteForGroup] = useState<string | null>(null);
  const [inviteSearch, setInviteSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", course: "", maxSize: "5" });
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [confirmDeclineId, setConfirmDeclineId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<{ groupId: string; memberNim: string } | null>(null);
  const [editingMaxSize, setEditingMaxSize] = useState<{ groupId: string; value: string } | null>(null);
  const [roomSearch, setRoomSearch] = useState("");
  const [roomCourseFilter, setRoomCourseFilter] = useState("");

  useEffect(() => {
    const g = localStorage.getItem("sim_kelompok");
    const inv = localStorage.getItem("sim_invitations");
    const jr = localStorage.getItem("sim_join_requests");

    if (g) setLocalGroups(JSON.parse(g));
    else setLocalGroups(SEED_GROUPS);

    if (inv) {
      const stored: Invitation[] = JSON.parse(inv);
      const storedIds = new Set(stored.map(i => i.id));
      const merged = [...stored, ...SEED_INVITATIONS.filter(s => !storedIds.has(s.id))];
      setInvitations(merged);
      localStorage.setItem("sim_invitations", JSON.stringify(merged));
    } else {
      setInvitations(SEED_INVITATIONS);
    }

    if (jr) {
      const stored: JoinRequest[] = JSON.parse(jr);
      const storedIds = new Set(stored.map(r => r.id));
      const merged = [...stored, ...SEED_JOIN_REQUESTS.filter(s => !storedIds.has(s.id))];
      setJoinRequests(merged);
      localStorage.setItem("sim_join_requests", JSON.stringify(merged));
    } else {
      setJoinRequests(SEED_JOIN_REQUESTS);
    }
  }, []);

  const persist = (g: Group[], inv: Invitation[]) => {
    setGroups(g);
    setInvitations(inv);
    localStorage.setItem("sim_kelompok", JSON.stringify(g));
    localStorage.setItem("sim_invitations", JSON.stringify(inv));
  };

  const persistJoinReqs = (reqs: JoinRequest[]) => {
    setJoinRequests(reqs);
    localStorage.setItem("sim_join_requests", JSON.stringify(reqs));
  };

  const flash = (msg: string, type: ToastType = "success") => {
    setToast({ message: msg, type });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (confirmDeclineId) setConfirmDeclineId(null);
      else if (inviteForGroup) setInviteForGroup(null);
      else if (isCreateOpen) setIsCreateOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [confirmDeclineId, inviteForGroup, isCreateOpen]);

  const today = () => new Date().toISOString().slice(0, 10);

  const q = topbarQ.toLowerCase();
  const myGroups = groups
    .filter((g) => g.members.some((m) => m.nim === ME.nim))
    .filter((g) => !q || g.name.toLowerCase().includes(q) || g.course.toLowerCase().includes(q) || g.members.some((m) => m.nama.toLowerCase().includes(q)));
  const pendingIn = invitations
    .filter((i) => i.toNim === ME.nim && i.status === "pending")
    .filter((i) => !q || i.kelompokName.toLowerCase().includes(q) || i.fromNama.toLowerCase().includes(q) || i.course.toLowerCase().includes(q));

  // Join requests from others TO ME's groups
  const incomingJoinReqs = joinRequests.filter(
    (r) => groups.some((g) => g.id === r.groupId && g.createdBy === ME.nim) && r.status === "pending"
  );

  // My own requests to join other groups
  const myOutgoingReqs = joinRequests.filter((r) => r.fromNim === ME.nim);

  const joinedGroupIds = new Set(groups.map((g) => g.id));
  const openRoomGroups = SEED_ROOM_GROUPS.filter((g) => {
    if (joinedGroupIds.has(g.id)) return false;
    if (g.members.length >= g.maxSize) return false;
    if (roomCourseFilter && g.course !== roomCourseFilter) return false;
    if (roomSearch) {
      const s = roomSearch.toLowerCase();
      return (
        g.name.toLowerCase().includes(s) ||
        g.course.toLowerCase().includes(s) ||
        g.members.some((m) => m.nama.toLowerCase().includes(s))
      );
    }
    return true;
  });

  const availableFor = (groupId: string | null) => {
    const taken = new Set<string>();
    if (groupId) {
      const grp = groups.find((g) => g.id === groupId);
      grp?.members.forEach((m) => taken.add(m.nim));
      invitations
        .filter((i) => i.kelompokId === groupId && i.status === "pending")
        .forEach((i) => taken.add(i.toNim));
    } else {
      taken.add(ME.nim);
    }
    return ALL_STUDENTS.filter(
      (s) =>
        !taken.has(s.nim) &&
        (inviteSearch === "" ||
          s.nama.toLowerCase().includes(inviteSearch.toLowerCase()) ||
          s.nim.includes(inviteSearch))
    );
  };

  const toggleSelect = (nim: string) =>
    setSelected((p) => (p.includes(nim) ? p.filter((n) => n !== nim) : [...p, nim]));

  const buildInvites = (groupId: string, groupName: string, course: string): Invitation[] =>
    selected.map((nim) => ({
      id: `inv-${Date.now()}-${nim}`,
      kelompokId: groupId,
      kelompokName: groupName,
      course,
      fromNim: ME.nim,
      fromNama: ME.nama,
      toNim: nim,
      toNama: ALL_STUDENTS.find((s) => s.nim === nim)!.nama,
      status: "pending" as InvStatus,
      sentAt: today(),
    }));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newGroup: Group = {
      id: `grp-${Date.now()}`,
      name: form.name,
      course: form.course,
      maxSize: parseInt(form.maxSize),
      createdBy: ME.nim,
      mode: "mahasiswa",
      isOpen: false,
      members: [{ nim: ME.nim, nama: ME.nama, role: "Leader", joinedAt: today() }],
      createdAt: today(),
    };
    const newInvs = buildInvites(newGroup.id, newGroup.name, newGroup.course);
    persist([...groups, newGroup], [...invitations, ...newInvs]);
    setForm({ name: "", course: "", maxSize: "5" });
    setSelected([]);
    setIsCreateOpen(false);
    flash("Kelompok berhasil dibuat!");
  };

  const handleSendInvites = (groupId: string) => {
    const grp = groups.find((g) => g.id === groupId)!;
    const newInvs = buildInvites(groupId, grp.name, grp.course);
    persist(groups, [...invitations, ...newInvs]);
    setSelected([]);
    setInviteSearch("");
    setInviteForGroup(null);
    flash(`${newInvs.length} undangan terkirim!`);
  };

  const handleAccept = (invId: string) => {
    const inv = invitations.find((i) => i.id === invId)!;
    const updInvs = invitations.map((i) =>
      i.id === invId ? { ...i, status: "accepted" as InvStatus } : i
    );
    let grpTarget = groups.find((g) => g.id === inv.kelompokId);
    let updGroups = groups;
    if (grpTarget && !grpTarget.members.some((m) => m.nim === ME.nim)) {
      updGroups = groups.map((g) =>
        g.id === inv.kelompokId
          ? { ...g, members: [...g.members, { nim: ME.nim, nama: ME.nama, role: "Anggota", joinedAt: today() }] }
          : g
      );
    } else if (!grpTarget) {
      const stub: Group = {
        id: inv.kelompokId,
        name: inv.kelompokName,
        course: inv.course,
        maxSize: 6,
        createdBy: inv.fromNim,
        mode: "mahasiswa",
        members: [
          { nim: inv.fromNim, nama: inv.fromNama, role: "Leader", joinedAt: inv.sentAt },
          { nim: ME.nim, nama: ME.nama, role: "Anggota", joinedAt: today() },
        ],
        createdAt: inv.sentAt,
      };
      updGroups = [...groups, stub];
    }
    persist(updGroups, updInvs);
    flash(`Bergabung ke ${inv.kelompokName}!`);
  };

  const handleDecline = (invId: string) => {
    setConfirmDeclineId(invId);
  };

  const confirmDecline = () => {
    if (!confirmDeclineId) return;
    const updInvs = invitations.map((i) =>
      i.id === confirmDeclineId ? { ...i, status: "declined" as InvStatus } : i
    );
    persist(groups, updInvs);
    setConfirmDeclineId(null);
    flash("Undangan ditolak.", "info");
  };

  const ROLES = ["Leader", "Anggota", "UI", "Analyst", "Presenter", "Notulis", "Backend", "Frontend"];

  const handleChangeRole = (groupId: string, memberNim: string, newRole: string) => {
    const updGroups = groups.map((g) => {
      if (g.id !== groupId) return g;
      const updMembers = g.members.map((m) => {
        if (m.nim === memberNim) return { ...m, role: newRole };
        if (newRole === "Leader" && m.role === "Leader" && m.nim !== memberNim)
          return { ...m, role: "Anggota" };
        return m;
      });
      const newCreatedBy = newRole === "Leader" ? memberNim : g.createdBy;
      return { ...g, members: updMembers, createdBy: newCreatedBy };
    });
    persist(updGroups, invitations);
    setEditingRole(null);
    flash(`Peran berhasil diubah menjadi ${newRole}`);
  };

  const handleKickMember = (groupId: string, memberNim: string) => {
    const updGroups = groups.map((g) =>
      g.id === groupId ? { ...g, members: g.members.filter((m) => m.nim !== memberNim) } : g
    );
    const updInvs = invitations.filter(
      (i) => !(i.kelompokId === groupId && i.toNim === memberNim && i.status === "pending")
    );
    persist(updGroups, updInvs);
    flash("Anggota telah dikeluarkan dari kelompok.");
  };

  const handleSaveMaxSize = (groupId: string) => {
    if (!editingMaxSize) return;
    const grp = groups.find((g) => g.id === groupId)!;
    const newSize = parseInt(editingMaxSize.value);
    if (isNaN(newSize) || newSize < grp.members.length) {
      flash("Ukuran tidak bisa lebih kecil dari jumlah anggota saat ini.");
      return;
    }
    if (newSize > 10) {
      flash("Kapasitas maksimal kelompok adalah 10 orang.");
      return;
    }
    const updGroups = groups.map((g) => g.id === groupId ? { ...g, maxSize: newSize } : g);
    persist(updGroups, invitations);
    setEditingMaxSize(null);
    flash(`Kapasitas kelompok diubah menjadi ${newSize} orang.`);
  };

  const handleToggleOpen = (groupId: string) => {
    const updGroups = groups.map((g) => g.id === groupId ? { ...g, isOpen: !g.isOpen } : g);
    persist(updGroups, invitations);
    const grp = updGroups.find((g) => g.id === groupId)!;
    flash(grp.isOpen ? "Rekrutmen dibuka — mahasiswa bisa mengirim permintaan gabung!" : "Rekrutmen ditutup.");
  };

  // ME meminta gabung ke room group
  const handleRequestJoin = (groupId: string) => {
    const grp = SEED_ROOM_GROUPS.find((g) => g.id === groupId)!;
    const req: JoinRequest = {
      id: `jr-${Date.now()}`,
      groupId,
      groupName: grp.name,
      course: grp.course,
      fromNim: ME.nim,
      fromNama: ME.nama,
      status: "pending",
      sentAt: today(),
    };
    persistJoinReqs([...joinRequests, req]);
    flash(`Permintaan dikirim ke ketua ${grp.name}!`);
  };

  const handleCancelRequest = (reqId: string) => {
    persistJoinReqs(joinRequests.filter((r) => r.id !== reqId));
    flash("Permintaan dibatalkan.");
  };

  // Simulasi ketua menerima permintaan ME (hanya untuk demo)
  const handleSimulateApprove = (reqId: string) => {
    const req = joinRequests.find((r) => r.id === reqId)!;
    const grp = SEED_ROOM_GROUPS.find((g) => g.id === req.groupId)!;
    const joined: Group = {
      ...grp,
      members: [...grp.members, { nim: ME.nim, nama: ME.nama, role: "Anggota", joinedAt: today() }],
    };
    persistJoinReqs(joinRequests.map((r) => r.id === reqId ? { ...r, status: "accepted" as JoinReqStatus } : r));
    persist([...groups, joined], invitations);
    setTab("myGroups");
    flash(`Diterima! Kamu bergabung ke ${req.groupName}.`);
  };

  // Ketua menerima permintaan masuk ke kelompok sendiri
  const handleAcceptJoinRequest = (reqId: string) => {
    const req = joinRequests.find((r) => r.id === reqId)!;
    const grp = groups.find((g) => g.id === req.groupId);
    if (!grp) return;
    if (grp.members.length >= grp.maxSize) {
      flash("Kelompok sudah penuh, tidak bisa menerima anggota baru.");
      return;
    }
    const updGroups = groups.map((g) =>
      g.id === req.groupId
        ? { ...g, members: [...g.members, { nim: req.fromNim, nama: req.fromNama, role: "Anggota", joinedAt: today() }] }
        : g
    );
    persistJoinReqs(joinRequests.map((r) => r.id === reqId ? { ...r, status: "accepted" as JoinReqStatus } : r));
    persist(updGroups, invitations);
    flash(`${req.fromNama.split(" ")[0]} berhasil ditambahkan ke kelompok!`);
  };

  const handleDeclineJoinRequest = (reqId: string) => {
    persistJoinReqs(joinRequests.map((r) => r.id === reqId ? { ...r, status: "declined" as JoinReqStatus } : r));
    flash("Permintaan ditolak.");
  };

  const openCreate = () => {
    setForm({ name: "", course: "", maxSize: "5" });
    setSelected([]);
    setInviteSearch("");
    setIsCreateOpen(true);
  };

  const openInvite = (groupId: string) => {
    setSelected([]);
    setInviteSearch("");
    setInviteForGroup(groupId);
  };

  return (
    <div className="flex flex-col gap-6">
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}

      {/* Confirm Decline */}
      {confirmDeclineId && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40" onClick={() => setConfirmDeclineId(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-mhs-card border border-mhs-border rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] w-full max-w-sm p-6 text-center animate-fadeIn">
              <div className="text-[32px] mb-3">🚫</div>
              <h2 className="font-serif text-[17px] text-mhs-text mb-2">Tolak Undangan?</h2>
              <p className="text-[13px] text-mhs-muted mb-5">Kamu akan menolak undangan ini. Tindakan tidak dapat dibatalkan.</p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmDeclineId(null)} className="flex-1 border border-mhs-border text-mhs-muted hover:text-mhs-text py-2 rounded-lg text-[13px] transition-colors">Batal</button>
                <button onClick={confirmDecline} className="flex-1 bg-mhs-rose text-white hover:opacity-90 py-2 rounded-lg text-[13px] font-semibold transition-colors">Tolak</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] text-mhs-muted uppercase tracking-[0.1em] mb-0.5">Modul</div>
          <div className="font-serif text-[22px] text-mhs-text">Manajemen Kelompok</div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-mhs-amber text-white px-4 py-2 rounded-lg text-[13px] font-semibold hover:bg-mhs-amber/90 transition-all hover:-translate-y-px shadow-sm"
        >
          <Plus size={15} /> Buat Kelompok
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-mhs-card border border-mhs-border rounded-xl p-1 w-fit">
        {(
          [
            { key: "myGroups", label: `Kelompok Saya (${myGroups.length})`, badge: incomingJoinReqs.length },
            { key: "invitations", label: "Undangan Masuk", badge: pendingIn.length },
            { key: "room", label: "Room Kelompok", badge: openRoomGroups.length },
          ] as const
        ).map(({ key, label, badge }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all",
              tab === key ? "bg-mhs-amber/15 text-mhs-amber" : "text-mhs-muted hover:text-mhs-text"
            )}
          >
            {label}
            {badge > 0 && (
              <span className={cn(
                "text-white text-[10px] font-bold py-[1px] px-1.5 rounded-full",
                key === "room" ? "bg-mhs-teal" : "bg-mhs-rose"
              )}>
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab: Kelompok Saya ── */}
      {tab === "myGroups" && (
        <div className="flex flex-col gap-4">
          {myGroups.length === 0 ? (
            <div className="bg-mhs-card border border-mhs-border rounded-[14px] p-12 flex flex-col items-center text-center">
              <Users size={36} className="text-mhs-muted mb-3" />
              <div className="text-[14px] font-medium text-mhs-text mb-1">Belum ada kelompok</div>
              <div className="text-[13px] text-mhs-muted">Buat kelompok baru atau terima undangan dari teman.</div>
            </div>
          ) : (
            myGroups.map((grp) => {
              const isLeader = grp.createdBy === ME.nim;
              const pendingInvites = invitations.filter((i) => i.kelompokId === grp.id && i.status === "pending");
              const pendingJoinReqs = joinRequests.filter((r) => r.groupId === grp.id && r.status === "pending");
              const isFull = grp.members.length >= grp.maxSize;
              return (
                <div key={grp.id} className="bg-mhs-card border border-mhs-border rounded-[14px] overflow-hidden">
                  {/* Card header */}
                  <div className="px-5 py-4 border-b border-mhs-border flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-mhs-amber to-mhs-purple flex items-center justify-center text-white font-bold text-[14px] shrink-0">
                      {grp.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold text-mhs-text">{grp.name}</div>
                      <div className="text-[11px] text-mhs-muted mt-0.5 flex items-center gap-1.5">
                        {grp.course} · {grp.members.length}/{grp.maxSize} anggota
                        {isLeader && (
                          editingMaxSize?.groupId === grp.id ? (
                            <span className="flex items-center gap-1 ml-1">
                              <input
                                type="number"
                                min={grp.members.length}
                                max={10}
                                value={editingMaxSize.value}
                                onChange={e => setEditingMaxSize({ groupId: grp.id, value: e.target.value })}
                                onKeyDown={e => { if (e.key === "Enter") handleSaveMaxSize(grp.id); if (e.key === "Escape") setEditingMaxSize(null); }}
                                className="w-12 px-1 py-0.5 text-[11px] bg-mhs-card border border-mhs-amber rounded text-mhs-text outline-none"
                                autoFocus
                              />
                              <button onClick={() => handleSaveMaxSize(grp.id)} className="text-mhs-green text-[10px] font-bold hover:opacity-70">✓</button>
                              <button onClick={() => setEditingMaxSize(null)} className="text-mhs-rose text-[10px] font-bold hover:opacity-70">✕</button>
                            </span>
                          ) : (
                            <button
                              onClick={() => setEditingMaxSize({ groupId: grp.id, value: String(grp.maxSize) })}
                              className="text-mhs-muted hover:text-mhs-amber transition-colors ml-0.5"
                              title="Edit kapasitas kelompok"
                            >
                              ✏️
                            </button>
                          )
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                      {isLeader && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-mhs-amber/15 text-mhs-amber">
                          Leader
                        </span>
                      )}
                      {isLeader && grp.isOpen && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-mhs-teal/15 text-mhs-teal">
                          🟢 Buka Rekrutmen
                        </span>
                      )}
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        grp.mode === "mahasiswa" ? "bg-mhs-teal/15 text-mhs-teal" : "bg-mhs-purple/15 text-mhs-purple"
                      )}>
                        {grp.mode === "mahasiswa" ? "Mandiri" : "Dosen"}
                      </span>
                    </div>
                  </div>

                  {/* Members */}
                  <div className="px-5 py-4">
                    <div className="text-[10px] text-mhs-muted uppercase tracking-wider mb-3 font-semibold">Anggota</div>
                    <div className="flex flex-wrap gap-2">
                      {grp.members.map((m, mi) => (
                        <div key={m.nim} className="flex items-center gap-2 bg-mhs-surface border border-mhs-border rounded-lg px-3 py-1.5 group/chip">
                          <div className={cn("w-6 h-6 rounded-full bg-gradient-to-br flex items-center justify-center text-[9px] font-bold text-white shrink-0", AVATAR_COLORS[mi % AVATAR_COLORS.length])}>
                            {m.nama.slice(0, 2)}
                          </div>
                          <div>
                            <div className="text-[12px] font-medium text-mhs-text leading-none">{m.nama.split(" ")[0]}</div>
                            {isLeader && m.nim !== ME.nim ? (
                              <button onClick={() => setEditingRole({ groupId: grp.id, memberNim: m.nim })} className="text-[10px] text-mhs-amber underline underline-offset-1 hover:text-mhs-amber/70 transition-colors">
                                {m.role}
                              </button>
                            ) : (
                              <div className="text-[10px] text-mhs-muted">{m.role}</div>
                            )}
                          </div>
                          {isLeader && m.nim !== ME.nim && (
                            <button onClick={() => handleKickMember(grp.id, m.nim)} title="Keluarkan dari kelompok" className="opacity-0 group-hover/chip:opacity-100 transition-opacity ml-1 text-mhs-muted hover:text-mhs-rose">
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      ))}
                      {pendingInvites.map((inv) => (
                        <div key={inv.id} className="flex items-center gap-2 border border-dashed border-mhs-border rounded-lg px-3 py-1.5 opacity-50">
                          <div className="w-6 h-6 rounded-full bg-mhs-border flex items-center justify-center text-[10px] text-mhs-muted shrink-0">?</div>
                          <div>
                            <div className="text-[12px] font-medium text-mhs-muted leading-none">{inv.toNama.split(" ")[0]}</div>
                            <div className="text-[10px] text-mhs-muted">Diundang</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Permintaan Gabung (hanya untuk leader) */}
                  {isLeader && pendingJoinReqs.length > 0 && (
                    <div className="px-5 py-3 border-t border-mhs-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-mhs-muted uppercase tracking-wider font-semibold">Permintaan Gabung</span>
                        <span className="text-[10px] font-bold text-mhs-rose bg-mhs-rose/10 px-1.5 py-0.5 rounded-full">{pendingJoinReqs.length}</span>
                      </div>
                      <div className="space-y-2">
                        {pendingJoinReqs.map((req) => (
                          <div key={req.id} className="flex items-center gap-3 bg-mhs-surface border border-mhs-border rounded-lg px-3 py-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-mhs-teal to-mhs-purple flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                              {req.fromNama.slice(0, 2)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[12px] font-semibold text-mhs-text leading-none">{req.fromNama}</div>
                              <div className="text-[10px] text-mhs-muted mt-0.5">{req.sentAt}</div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => handleDeclineJoinRequest(req.id)}
                                className="px-2.5 py-1 rounded-md border border-mhs-border text-mhs-muted hover:border-mhs-rose hover:text-mhs-rose text-[11px] font-semibold transition-all"
                              >
                                Tolak
                              </button>
                              <button
                                onClick={() => handleAcceptJoinRequest(req.id)}
                                disabled={isFull}
                                className="px-2.5 py-1 rounded-md bg-mhs-teal text-white hover:bg-mhs-teal/85 disabled:opacity-40 text-[11px] font-semibold transition-all"
                              >
                                Terima
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer (leader only) */}
                  {isLeader && (
                    <div className="px-5 py-3 border-t border-mhs-border bg-mhs-surface/40 flex items-center justify-between gap-3 flex-wrap">
                      {/* Toggle rekrutmen */}
                      <button
                        onClick={() => handleToggleOpen(grp.id)}
                        className={cn(
                          "flex items-center gap-1.5 text-[11px] font-semibold transition-colors",
                          grp.isOpen
                            ? "text-mhs-teal hover:text-mhs-teal/70"
                            : "text-mhs-muted hover:text-mhs-amber"
                        )}
                      >
                        {grp.isOpen ? "🟢 Tutup Rekrutmen" : "⭕ Buka Rekrutmen"}
                      </button>

                      <div className="flex items-center gap-3 ml-auto">
                        {pendingInvites.length > 0 && (
                          <button
                            onClick={() => {
                              const acceptedMembers: Member[] = pendingInvites.map((inv) => ({
                                nim: inv.toNim,
                                nama: inv.toNama,
                                role: "Anggota",
                                joinedAt: today(),
                              }));
                              const updGroups = groups.map((g) =>
                                g.id === grp.id
                                  ? { ...g, members: [...g.members, ...acceptedMembers], maxSize: Math.max(g.maxSize, g.members.length + acceptedMembers.length) }
                                  : g
                              );
                              const updInvs = invitations.map((i) =>
                                i.kelompokId === grp.id && i.status === "pending"
                                  ? { ...i, status: "accepted" as InvStatus }
                                  : i
                              );
                              persist(updGroups, updInvs);
                              flash(`${acceptedMembers.length} anggota berhasil bergabung!`);
                            }}
                            className="flex items-center gap-1.5 text-[12px] font-semibold text-mhs-green hover:text-mhs-green/70 transition-colors"
                          >
                            <Check size={13} /> Terima Semua ({pendingInvites.length})
                          </button>
                        )}
                        {!isFull && (
                          <button
                            onClick={() => openInvite(grp.id)}
                            className="flex items-center gap-1.5 text-[12px] font-semibold text-mhs-amber hover:text-mhs-amber/70 transition-colors"
                          >
                            <UserPlus size={13} /> Undang Anggota
                          </button>
                        )}
                        {isFull && pendingInvites.length === 0 && (
                          <span className="text-[11px] text-mhs-muted">Kelompok sudah penuh ({grp.maxSize}/{grp.maxSize})</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Tab: Undangan Masuk ── */}
      {tab === "invitations" && (
        <div className="flex flex-col gap-3">
          {pendingIn.length === 0 ? (
            <div className="bg-mhs-card border border-mhs-border rounded-[14px] p-12 flex flex-col items-center text-center">
              <div className="text-4xl mb-3">📬</div>
              <div className="text-[14px] font-medium text-mhs-text mb-1">Tidak ada undangan</div>
              <div className="text-[13px] text-mhs-muted">Saat ada teman yang mengundangmu, undangan akan muncul di sini.</div>
            </div>
          ) : (
            pendingIn.map((inv) => (
              <div key={inv.id} className="bg-mhs-card border border-mhs-border rounded-[14px] p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-mhs-teal to-mhs-green flex items-center justify-center text-white text-[20px] shrink-0">👥</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-mhs-text">{inv.kelompokName}</div>
                  <div className="text-[12px] text-mhs-muted mt-0.5">{inv.course}</div>
                  <div className="text-[11px] text-mhs-muted mt-1">
                    Diundang oleh <span className="text-mhs-text font-medium">{inv.fromNama}</span> · {inv.sentAt}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleDecline(inv.id)} className="px-3 py-1.5 rounded-lg border border-mhs-border text-mhs-muted hover:border-mhs-rose hover:text-mhs-rose text-[12px] font-semibold transition-all">Tolak</button>
                  <button onClick={() => handleAccept(inv.id)} className="px-3 py-1.5 rounded-lg bg-mhs-amber text-white hover:bg-mhs-amber/90 text-[12px] font-semibold transition-all">Terima</button>
                </div>
              </div>
            ))
          )}

          {invitations.filter((i) => i.toNim === ME.nim && i.status !== "pending").length > 0 && (
            <div className="mt-2">
              <div className="text-[11px] text-mhs-muted uppercase tracking-wider mb-2 font-semibold">Riwayat</div>
              {invitations.filter((i) => i.toNim === ME.nim && i.status !== "pending").map((inv) => (
                <div key={inv.id} className="bg-mhs-surface border border-mhs-border rounded-xl p-4 flex items-center gap-3 opacity-60 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-mhs-text">{inv.kelompokName} <span className="text-mhs-muted font-normal">· {inv.course}</span></div>
                    <div className="text-[11px] text-mhs-muted">dari {inv.fromNama}</div>
                  </div>
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", inv.status === "accepted" ? "bg-mhs-teal/15 text-mhs-teal" : "bg-mhs-rose/15 text-mhs-rose")}>
                    {inv.status === "accepted" ? "Diterima" : "Ditolak"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Room Kelompok ── */}
      {tab === "room" && (
        <div className="flex flex-col gap-4">
          {/* Search + filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-mhs-muted" />
              <input
                type="text"
                value={roomSearch}
                onChange={(e) => setRoomSearch(e.target.value)}
                placeholder="Cari nama kelompok, mata kuliah, atau anggota…"
                className="w-full bg-mhs-card border border-mhs-border text-mhs-text rounded-lg pl-8 pr-3 py-2 text-[13px] outline-none focus:border-mhs-amber transition-colors"
              />
            </div>
            <select
              value={roomCourseFilter}
              onChange={(e) => setRoomCourseFilter(e.target.value)}
              className="bg-mhs-card border border-mhs-border text-mhs-text rounded-lg px-3 py-2 text-[13px] outline-none focus:border-mhs-amber transition-colors"
            >
              <option value="">Semua Mata Kuliah</option>
              {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Info banner */}
          <div className="flex items-start gap-3 bg-mhs-teal/10 border border-mhs-teal/25 rounded-xl px-4 py-3">
            <span className="text-mhs-teal mt-0.5 shrink-0"><Users size={15} /></span>
            <p className="text-[12px] text-mhs-teal leading-relaxed">
              Kelompok di bawah ini sedang membuka rekrutmen. Klik <strong>Minta Gabung</strong> untuk mengirim permintaan — ketua kelompok akan menerima atau menolak permintaanmu.
            </p>
          </div>

          {openRoomGroups.length === 0 ? (
            <div className="bg-mhs-card border border-mhs-border rounded-[14px] p-12 flex flex-col items-center text-center">
              <Users size={36} className="text-mhs-muted mb-3" />
              <div className="text-[14px] font-medium text-mhs-text mb-1">Tidak ada kelompok terbuka</div>
              <div className="text-[13px] text-mhs-muted">
                {roomSearch || roomCourseFilter ? "Coba ubah filter pencarian." : "Semua kelompok sudah penuh atau kamu sudah bergabung."}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {openRoomGroups.map((grp) => {
                const slotsLeft = grp.maxSize - grp.members.length;
                const leader = grp.members.find((m) => m.role === "Leader");
                const myReq = myOutgoingReqs.find((r) => r.groupId === grp.id);
                const isPending = myReq?.status === "pending";
                const wasDeclined = myReq?.status === "declined";

                return (
                  <div
                    key={grp.id}
                    className={cn(
                      "bg-mhs-card border rounded-[14px] overflow-hidden transition-colors",
                      isPending ? "border-mhs-amber/50" : "border-mhs-border hover:border-mhs-amber/30"
                    )}
                  >
                    {/* Card header */}
                    <div className="px-5 py-4 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-mhs-teal to-mhs-green flex items-center justify-center text-white font-bold text-[14px] shrink-0">
                        {grp.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-semibold text-mhs-text">{grp.name}</div>
                        <div className="text-[11px] text-mhs-muted mt-0.5">
                          {grp.course} · Ketua: {leader?.nama.split(" ")[0]}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", slotsLeft <= 1 ? "bg-mhs-rose/15 text-mhs-rose" : "bg-mhs-teal/15 text-mhs-teal")}>
                          {slotsLeft} slot tersisa
                        </span>
                        <span className="text-[10px] text-mhs-muted">{grp.members.length}/{grp.maxSize} anggota</span>
                      </div>
                    </div>

                    {/* Members preview */}
                    <div className="px-5 pb-3 flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {grp.members.map((m, mi) => (
                          <div
                            key={m.nim}
                            title={`${m.nama} (${m.role})`}
                            className={cn("w-7 h-7 rounded-full bg-gradient-to-br border-2 border-mhs-card flex items-center justify-center text-[9px] font-bold text-white shrink-0", AVATAR_COLORS[mi % AVATAR_COLORS.length])}
                          >
                            {m.nama.slice(0, 2)}
                          </div>
                        ))}
                        {slotsLeft > 0 && (
                          <div className="w-7 h-7 rounded-full border-2 border-dashed border-mhs-border bg-mhs-surface flex items-center justify-center shrink-0">
                            <span className="text-[9px] text-mhs-muted font-bold">+{slotsLeft}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-[11px] text-mhs-muted leading-relaxed">
                        {grp.members.map((m) => `${m.nama.split(" ")[0]}${m.role === "Leader" ? " 👑" : ""}`).join(" · ")}
                      </div>
                    </div>

                    {/* Footer — status-aware */}
                    <div className="px-5 py-3 border-t border-mhs-border bg-mhs-surface/40 flex items-center justify-between gap-3">
                      <span className="text-[11px] text-mhs-muted">Dibuat {grp.createdAt}</span>

                      {isPending ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-mhs-amber font-medium flex items-center gap-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-mhs-amber animate-pulse" />
                            Menunggu konfirmasi ketua…
                          </span>
                          <button
                            onClick={() => handleCancelRequest(myReq!.id)}
                            className="text-[11px] text-mhs-rose hover:text-mhs-rose/70 transition-colors font-medium border border-mhs-rose/30 hover:border-mhs-rose px-2 py-0.5 rounded-md"
                          >
                            Batalkan
                          </button>
                          <button
                            onClick={() => handleSimulateApprove(myReq!.id)}
                            title="Simulasi persetujuan ketua (hanya untuk demo)"
                            className="text-[10px] text-mhs-muted border border-mhs-border px-2 py-0.5 rounded-md hover:border-mhs-teal hover:text-mhs-teal transition-all"
                          >
                            ⚡ Demo: Acc
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {wasDeclined && (
                            <span className="text-[10px] text-mhs-rose">Pernah ditolak ·</span>
                          )}
                          <button
                            onClick={() => handleRequestJoin(grp.id)}
                            className="flex items-center gap-1.5 bg-mhs-teal text-white px-4 py-1.5 rounded-lg text-[12px] font-semibold hover:bg-mhs-teal/85 transition-all hover:-translate-y-px shadow-sm"
                          >
                            <UserPlus size={13} /> Minta Gabung
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Riwayat permintaan saya */}
          {myOutgoingReqs.filter(r => r.status !== "pending").length > 0 && (
            <div className="mt-2">
              <div className="text-[11px] text-mhs-muted uppercase tracking-wider mb-2 font-semibold">Riwayat Permintaan</div>
              {myOutgoingReqs.filter(r => r.status !== "pending").map((req) => (
                <div key={req.id} className="bg-mhs-surface border border-mhs-border rounded-xl p-3 flex items-center gap-3 opacity-70 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-mhs-text">{req.groupName} <span className="text-mhs-muted font-normal">· {req.course}</span></div>
                    <div className="text-[11px] text-mhs-muted">{req.sentAt}</div>
                  </div>
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", req.status === "accepted" ? "bg-mhs-teal/15 text-mhs-teal" : "bg-mhs-rose/15 text-mhs-rose")}>
                    {req.status === "accepted" ? "Diterima" : "Ditolak"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Buat Kelompok */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)} />
          <div className="relative bg-mhs-surface border border-mhs-border rounded-2xl shadow-2xl w-full max-w-lg animate-fadeIn max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-mhs-border shrink-0">
              <div>
                <h2 className="font-serif text-[18px] text-mhs-text">Buat Kelompok Baru</h2>
                <div className="text-[12px] text-mhs-muted mt-0.5">Anda otomatis menjadi Leader kelompok</div>
              </div>
              <button onClick={() => setIsCreateOpen(false)} className="text-mhs-muted hover:text-mhs-text transition-colors"><X size={18} /></button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col overflow-hidden">
              <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="block text-[11px] text-mhs-muted uppercase tracking-wider mb-1.5">Nama Kelompok <span className="text-mhs-rose">*</span></label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="cth. Kelompok Alfa"
                    required
                    className="w-full bg-mhs-card border border-mhs-border text-mhs-text rounded-lg px-3 py-2 text-[13.5px] outline-none focus:border-mhs-amber transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-mhs-muted uppercase tracking-wider mb-1.5">Mata Kuliah <span className="text-mhs-rose">*</span></label>
                    <select value={form.course} onChange={(e) => setForm((f) => ({ ...f, course: e.target.value }))} required className="w-full bg-mhs-card border border-mhs-border text-mhs-text rounded-lg px-3 py-2 text-[13.5px] outline-none focus:border-mhs-amber transition-colors">
                      <option value="">Pilih…</option>
                      {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-mhs-muted uppercase tracking-wider mb-1.5">Maks Anggota</label>
                    <select value={form.maxSize} onChange={(e) => setForm((f) => ({ ...f, maxSize: e.target.value }))} className="w-full bg-mhs-card border border-mhs-border text-mhs-text rounded-lg px-3 py-2 text-[13.5px] outline-none focus:border-mhs-amber transition-colors">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => <option key={n} value={n}>{n} orang</option>)}
                    </select>
                  </div>
                </div>

                {(() => {
                  const createLimit = Math.max(0, parseInt(form.maxSize || "1") - 1);
                  const atCreateLimit = selected.length >= createLimit;
                  return (
                    <div>
                      <label className="block text-[11px] text-mhs-muted uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>Undang Anggota <span className="normal-case font-normal">(opsional)</span></span>
                        <span className={cn("font-semibold", atCreateLimit ? "text-mhs-rose" : "text-mhs-amber")}>{selected.length}/{createLimit} slot</span>
                      </label>
                      <div className="relative mb-2">
                        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-mhs-muted" />
                        <input type="text" value={inviteSearch} onChange={(e) => setInviteSearch(e.target.value)} placeholder="Cari nama atau NIM…" className="w-full bg-mhs-card border border-mhs-border text-mhs-text rounded-lg pl-8 pr-3 py-2 text-[13px] outline-none focus:border-mhs-amber transition-colors" />
                      </div>
                      <div className="space-y-1 max-h-[180px] overflow-y-auto pr-1">
                        {availableFor(null).map((s) => {
                          const isChecked = selected.includes(s.nim);
                          const isDisabled = !isChecked && atCreateLimit;
                          return (
                            <label key={s.nim} className={cn("flex items-center gap-3 px-3 py-2 rounded-lg transition-colors", isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-mhs-card")}>
                              <div className={cn("w-5 h-5 rounded flex items-center justify-center border-2 transition-all shrink-0", isChecked ? "bg-mhs-amber border-mhs-amber" : "border-mhs-border")}>
                                {isChecked && <Check size={11} className="text-white" strokeWidth={3} />}
                              </div>
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-mhs-teal to-mhs-purple flex items-center justify-center text-[10px] font-bold text-white shrink-0">{s.nama.slice(0, 2)}</div>
                              <div className="flex-1">
                                <div className="text-[13px] font-medium text-mhs-text">{s.nama}</div>
                                <div className="text-[10px] text-mhs-muted">{s.nim}</div>
                              </div>
                              <input type="checkbox" className="sr-only" checked={isChecked} disabled={isDisabled} onChange={() => !isDisabled && toggleSelect(s.nim)} />
                            </label>
                          );
                        })}
                        {availableFor(null).length === 0 && (
                          <div className="text-center py-4 text-[13px] text-mhs-muted">Tidak ada mahasiswa yang cocok</div>
                        )}
                      </div>
                      {atCreateLimit && createLimit > 0 && (
                        <div className="mt-2 text-[11px] text-mhs-rose font-semibold">Slot undangan penuh. Tambah kapasitas untuk mengundang lebih banyak.</div>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div className="px-6 py-4 border-t border-mhs-border shrink-0 flex gap-3">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="flex-1 border border-mhs-border text-mhs-muted hover:text-mhs-text py-2 rounded-lg text-[13px] font-semibold transition-all">Batal</button>
                <button type="submit" className="flex-1 bg-mhs-amber text-white hover:bg-mhs-amber/90 py-2 rounded-lg text-[13px] font-semibold transition-all">Buat Kelompok</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ganti Peran Anggota */}
      {editingRole && (() => {
        const grp = groups.find((g) => g.id === editingRole.groupId)!;
        const member = grp?.members.find((m) => m.nim === editingRole.memberNim);
        if (!grp || !member) return null;
        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditingRole(null)} />
            <div className="relative bg-mhs-surface border border-mhs-border rounded-2xl shadow-2xl w-full max-w-sm animate-fadeIn">
              <div className="flex items-center justify-between px-6 py-5 border-b border-mhs-border">
                <div>
                  <h2 className="font-serif text-[17px] text-mhs-text">Ganti Peran</h2>
                  <div className="text-[12px] text-mhs-muted mt-0.5">{member.nama}</div>
                </div>
                <button onClick={() => setEditingRole(null)} className="text-mhs-muted hover:text-mhs-text transition-colors"><X size={18} /></button>
              </div>
              <div className="px-6 py-4 grid grid-cols-2 gap-2">
                {ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => handleChangeRole(editingRole.groupId, editingRole.memberNim, role)}
                    className={cn("py-2.5 rounded-lg text-[13px] font-medium border transition-all text-left px-4", member.role === role ? "bg-mhs-amber/15 border-mhs-amber text-mhs-amber" : "border-mhs-border text-mhs-text hover:border-mhs-amber hover:text-mhs-amber")}
                  >
                    {role === "Leader" && <span className="mr-1">👑</span>}
                    {role}
                    {member.role === role && <span className="ml-1 text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
              {ROLES.indexOf(member.role) !== -1 && (
                <div className="px-6 pb-4 text-[11px] text-mhs-muted">
                  💡 Jika Anda mengatur anggota lain menjadi <strong>Leader</strong>, peran Anda akan berubah menjadi Anggota.
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Modal: Undang ke kelompok yang sudah ada */}
      {inviteForGroup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setInviteForGroup(null)} />
          <div className="relative bg-mhs-surface border border-mhs-border rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn">
            <div className="flex items-center justify-between px-6 py-5 border-b border-mhs-border">
              <div>
                <h2 className="font-serif text-[18px] text-mhs-text">Undang Anggota</h2>
                <div className="text-[12px] text-mhs-muted mt-0.5">{groups.find((g) => g.id === inviteForGroup)?.name}</div>
              </div>
              <button onClick={() => setInviteForGroup(null)} className="text-mhs-muted hover:text-mhs-text transition-colors"><X size={18} /></button>
            </div>

            {(() => {
              const invGrp = groups.find((g) => g.id === inviteForGroup);
              const pendingCnt = invitations.filter((i) => i.kelompokId === inviteForGroup && i.status === "pending").length;
              const inviteLimit = invGrp ? Math.max(0, invGrp.maxSize - invGrp.members.length - pendingCnt) : 0;
              const atInviteLimit = selected.length >= inviteLimit;
              return (
                <div className="px-6 py-5 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-mhs-muted uppercase tracking-wider">
                    <span>Pilih mahasiswa</span>
                    <span className={cn("font-semibold normal-case", atInviteLimit ? "text-mhs-rose" : "text-mhs-amber")}>{selected.length}/{inviteLimit} slot tersedia</span>
                  </div>
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-mhs-muted" />
                    <input type="text" value={inviteSearch} onChange={(e) => setInviteSearch(e.target.value)} placeholder="Cari nama atau NIM…" className="w-full bg-mhs-card border border-mhs-border text-mhs-text rounded-lg pl-8 pr-3 py-2 text-[13px] outline-none focus:border-mhs-amber transition-colors" />
                  </div>
                  <div className="space-y-1 max-h-[260px] overflow-y-auto pr-1">
                    {availableFor(inviteForGroup).map((s) => {
                      const isChecked = selected.includes(s.nim);
                      const isDisabled = !isChecked && atInviteLimit;
                      return (
                        <label key={s.nim} className={cn("flex items-center gap-3 px-3 py-2 rounded-lg transition-colors", isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-mhs-card")}>
                          <div className={cn("w-5 h-5 rounded flex items-center justify-center border-2 transition-all shrink-0", isChecked ? "bg-mhs-amber border-mhs-amber" : "border-mhs-border")}>
                            {isChecked && <Check size={11} className="text-white" strokeWidth={3} />}
                          </div>
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-mhs-teal to-mhs-purple flex items-center justify-center text-[10px] font-bold text-white shrink-0">{s.nama.slice(0, 2)}</div>
                          <div className="flex-1">
                            <div className="text-[13px] font-medium text-mhs-text">{s.nama}</div>
                            <div className="text-[10px] text-mhs-muted">{s.nim}</div>
                          </div>
                          <input type="checkbox" className="sr-only" checked={isChecked} disabled={isDisabled} onChange={() => !isDisabled && toggleSelect(s.nim)} />
                        </label>
                      );
                    })}
                    {availableFor(inviteForGroup).length === 0 && (
                      <div className="text-center py-8 text-[13px] text-mhs-muted">Semua mahasiswa sudah diundang atau bergabung</div>
                    )}
                  </div>
                  {atInviteLimit && inviteLimit > 0 && (
                    <div className="text-[11px] text-mhs-rose font-semibold">Slot penuh. Edit kapasitas kelompok untuk menambah lebih banyak anggota.</div>
                  )}
                </div>
              );
            })()}

            <div className="px-6 py-4 border-t border-mhs-border flex gap-3">
              <button onClick={() => setInviteForGroup(null)} className="flex-1 border border-mhs-border text-mhs-muted hover:text-mhs-text py-2 rounded-lg text-[13px] font-semibold transition-all">Batal</button>
              <button onClick={() => handleSendInvites(inviteForGroup)} disabled={selected.length === 0} className="flex-1 bg-mhs-amber text-white hover:bg-mhs-amber/90 disabled:opacity-40 py-2 rounded-lg text-[13px] font-semibold transition-all">Kirim Undangan ({selected.length})</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
