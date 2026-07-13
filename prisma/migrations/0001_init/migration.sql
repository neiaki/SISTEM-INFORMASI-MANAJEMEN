-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MAHASISWA', 'DOSEN', 'ADMIN', 'STAFF_TU');

-- CreateEnum
CREATE TYPE "JenisNotifikasi" AS ENUM ('DEADLINE', 'PROGRES', 'INFO', 'SISTEM', 'BROADCAST');

-- CreateEnum
CREATE TYPE "ChannelNotifikasi" AS ENUM ('IN_APP', 'EMAIL', 'TELEGRAM');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "preferences" JSONB,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mahasiswa" (
    "id" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "NIM" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "no_hp" TEXT,
    "semester_aktif" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mahasiswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dosen" (
    "id" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "no_hp" TEXT,
    "nidn" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dosen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_campus" (
    "id" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_campus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_tu" (
    "id" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_tu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mata_kuliah" (
    "id" TEXT NOT NULL,
    "nama_mk" TEXT NOT NULL,
    "kode_mk" TEXT NOT NULL,
    "id_dosen" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "tahun_ajar" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mata_kuliah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollment" (
    "id" TEXT NOT NULL,
    "id_mahasiswa" TEXT NOT NULL,
    "id_mk" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "tahun_ajar" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tugas" (
    "id" TEXT NOT NULL,
    "id_mk" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "tanggal_diberikan" TIMESTAMP(3) NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "bobot_nilai" INTEGER NOT NULL,
    "jenis" TEXT NOT NULL,
    "status_global" TEXT NOT NULL,
    "tipe" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tugas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proyek" (
    "id" TEXT NOT NULL,
    "id_mk" TEXT NOT NULL,
    "nama_proyek" TEXT NOT NULL,
    "deskripsi" TEXT,
    "tanggal_mulai" TIMESTAMP(3) NOT NULL,
    "deadline_akhir" TIMESTAMP(3) NOT NULL,
    "progres_proyek" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proyek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliverable" (
    "id" TEXT NOT NULL,
    "id_tugas" TEXT,
    "id_proyek" TEXT,
    "nama_aktivitas" TEXT NOT NULL,
    "id_penanggung_jawab" TEXT,
    "status" TEXT NOT NULL,
    "deadline_khusus" TIMESTAMP(3),
    "persentase_bobot" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deliverable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kelompok" (
    "id" TEXT NOT NULL,
    "id_mk" TEXT NOT NULL,
    "id_proyek" TEXT,
    "nama_kelompok" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kelompok_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anggota_kelompok" (
    "id" TEXT NOT NULL,
    "id_kelompok" TEXT NOT NULL,
    "id_mahasiswa" TEXT NOT NULL,
    "peran" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anggota_kelompok_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log_aktivitas" (
    "id" TEXT NOT NULL,
    "id_referensi" TEXT NOT NULL,
    "id_mahasiswa" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "catatan" TEXT NOT NULL,
    "persen_progres" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "log_aktivitas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission" (
    "id" TEXT NOT NULL,
    "id_tugas" TEXT,
    "id_kelompok" TEXT,
    "id_mahasiswa" TEXT NOT NULL,
    "file_name" TEXT,
    "file_size" TEXT,
    "note" TEXT,
    "url" TEXT,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "nilai" INTEGER,

    CONSTRAINT "submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" TEXT NOT NULL,
    "id_tugas" TEXT,
    "id_kelompok" TEXT,
    "id_mahasiswa" TEXT,
    "id_dosen" TEXT,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifikasi" (
    "id" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "pesan" TEXT NOT NULL,
    "jenis" "JenisNotifikasi" NOT NULL,
    "waktu_kirim" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status_baca" BOOLEAN NOT NULL DEFAULT false,
    "channel" "ChannelNotifikasi" NOT NULL DEFAULT 'IN_APP',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifikasi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "mahasiswa_id_user_key" ON "mahasiswa"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "mahasiswa_NIM_key" ON "mahasiswa"("NIM");

-- CreateIndex
CREATE UNIQUE INDEX "mahasiswa_email_key" ON "mahasiswa"("email");

-- CreateIndex
CREATE UNIQUE INDEX "dosen_id_user_key" ON "dosen"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "dosen_email_key" ON "dosen"("email");

-- CreateIndex
CREATE UNIQUE INDEX "dosen_nidn_key" ON "dosen"("nidn");

-- CreateIndex
CREATE UNIQUE INDEX "admin_campus_id_user_key" ON "admin_campus"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "admin_campus_email_key" ON "admin_campus"("email");

-- CreateIndex
CREATE UNIQUE INDEX "staff_tu_id_user_key" ON "staff_tu"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "staff_tu_email_key" ON "staff_tu"("email");

-- CreateIndex
CREATE UNIQUE INDEX "mata_kuliah_kode_mk_key" ON "mata_kuliah"("kode_mk");

-- CreateIndex
CREATE INDEX "enrollment_id_mahasiswa_id_mk_idx" ON "enrollment"("id_mahasiswa", "id_mk");

-- CreateIndex
CREATE UNIQUE INDEX "enrollment_id_mahasiswa_id_mk_tahun_ajar_key" ON "enrollment"("id_mahasiswa", "id_mk", "tahun_ajar");

-- CreateIndex
CREATE INDEX "tugas_id_mk_deadline_idx" ON "tugas"("id_mk", "deadline");

-- CreateIndex
CREATE INDEX "proyek_id_mk_deadline_akhir_idx" ON "proyek"("id_mk", "deadline_akhir");

-- CreateIndex
CREATE UNIQUE INDEX "anggota_kelompok_id_kelompok_id_mahasiswa_key" ON "anggota_kelompok"("id_kelompok", "id_mahasiswa");

-- CreateIndex
CREATE INDEX "submission_id_tugas_id_mahasiswa_idx" ON "submission"("id_tugas", "id_mahasiswa");

-- CreateIndex
CREATE INDEX "notifikasi_id_user_status_baca_idx" ON "notifikasi"("id_user", "status_baca");

-- AddForeignKey
ALTER TABLE "mahasiswa" ADD CONSTRAINT "mahasiswa_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dosen" ADD CONSTRAINT "dosen_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_campus" ADD CONSTRAINT "admin_campus_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_tu" ADD CONSTRAINT "staff_tu_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mata_kuliah" ADD CONSTRAINT "mata_kuliah_id_dosen_fkey" FOREIGN KEY ("id_dosen") REFERENCES "dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_id_mahasiswa_fkey" FOREIGN KEY ("id_mahasiswa") REFERENCES "mahasiswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_id_mk_fkey" FOREIGN KEY ("id_mk") REFERENCES "mata_kuliah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tugas" ADD CONSTRAINT "tugas_id_mk_fkey" FOREIGN KEY ("id_mk") REFERENCES "mata_kuliah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proyek" ADD CONSTRAINT "proyek_id_mk_fkey" FOREIGN KEY ("id_mk") REFERENCES "mata_kuliah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliverable" ADD CONSTRAINT "deliverable_id_penanggung_jawab_fkey" FOREIGN KEY ("id_penanggung_jawab") REFERENCES "mahasiswa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliverable" ADD CONSTRAINT "deliverable_id_proyek_fkey" FOREIGN KEY ("id_proyek") REFERENCES "proyek"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliverable" ADD CONSTRAINT "deliverable_id_tugas_fkey" FOREIGN KEY ("id_tugas") REFERENCES "tugas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kelompok" ADD CONSTRAINT "kelompok_id_mk_fkey" FOREIGN KEY ("id_mk") REFERENCES "mata_kuliah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kelompok" ADD CONSTRAINT "kelompok_id_proyek_fkey" FOREIGN KEY ("id_proyek") REFERENCES "proyek"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anggota_kelompok" ADD CONSTRAINT "anggota_kelompok_id_kelompok_fkey" FOREIGN KEY ("id_kelompok") REFERENCES "kelompok"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anggota_kelompok" ADD CONSTRAINT "anggota_kelompok_id_mahasiswa_fkey" FOREIGN KEY ("id_mahasiswa") REFERENCES "mahasiswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_aktivitas" ADD CONSTRAINT "log_aktivitas_id_mahasiswa_fkey" FOREIGN KEY ("id_mahasiswa") REFERENCES "mahasiswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission" ADD CONSTRAINT "submission_id_kelompok_fkey" FOREIGN KEY ("id_kelompok") REFERENCES "kelompok"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission" ADD CONSTRAINT "submission_id_mahasiswa_fkey" FOREIGN KEY ("id_mahasiswa") REFERENCES "mahasiswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission" ADD CONSTRAINT "submission_id_tugas_fkey" FOREIGN KEY ("id_tugas") REFERENCES "tugas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_id_dosen_fkey" FOREIGN KEY ("id_dosen") REFERENCES "dosen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_id_kelompok_fkey" FOREIGN KEY ("id_kelompok") REFERENCES "kelompok"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_id_mahasiswa_fkey" FOREIGN KEY ("id_mahasiswa") REFERENCES "mahasiswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_id_tugas_fkey" FOREIGN KEY ("id_tugas") REFERENCES "tugas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifikasi" ADD CONSTRAINT "notifikasi_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

