/**
 * lib/sso.ts
 * Konfigurasi SSO Kampus (SAML/LDAP) — kerangka (scaffolding).
 *
 * SSO membutuhkan layanan eksternal (IdP kampus):
 *  - SAML:但通过 BoxyHQ Jackson (service terpisah) ATAU package `@boxyhq/saml`.
 *    Provider `next-auth/providers/boxyhq-saml` sudah ada di next-auth v5,
 *    namun butuh Jackson berjalan. Aktifkan hanya bila SSO_ENABLED="true"
 *    DAN kredensial IdP sudah diisi di env.
 *  - LDAP: butuh package tambahan (belum terpasang) — install saat dibutuhkan.
 *
 * Modul ini hanya membaca env secara graceful; tidak memuat dependency eksternal.
 */

export type SsoType = "saml" | "ldap";

export interface SsoConfig {
  enabled: boolean;
  type: SsoType;
  label: string;
  /** Issuer / Entity ID dari IdP (SAML via Jackson). */
  issuer: string;
  clientId: string;
  clientSecret: string;
  /** URL metadata/entry-point IdP (SAML) atau LDAP host (LDAP). */
  entryPoint: string;
  /** Sertifikat IdP (SAML) — isi mentah atau path. */
  cert: string;
}

/** True bila SSO dikonfigurasi dan boleh ditampilkan di UI/login. */
export function isSsoConfigured(): boolean {
  return process.env.SSO_ENABLED === "true" && Boolean(process.env.SSO_ISSUER);
}

/** Mengembalikan konfigurasi SSO, atau null bila tidak aktif. */
export function getSsoConfig(): SsoConfig | null {
  if (!isSsoConfigured()) return null;

  const type = (process.env.SSO_TYPE === "ldap" ? "ldap" : "saml") as SsoType;

  return {
    enabled: true,
    type,
    label: process.env.SSO_LABEL ?? "SSO Kampus",
    issuer: process.env.SSO_ISSUER ?? "",
    clientId: process.env.SSO_CLIENT_ID ?? "",
    clientSecret: process.env.SSO_CLIENT_SECRET ?? "",
    entryPoint: process.env.SSO_ENTRY_POINT ?? "",
    cert: process.env.SSO_CERT ?? "",
  };
}

/**
 * ── CARA MENGAKTIFKAN SSO (setelah IdP/dependency siap) ─────────────────────
 *
 * 1. SAML: jalankan BoxyHQ Jackson (service terpisah) ATAU pasang
 *    `@boxyhq/saml`. Lalu tambahkan provider ke array `providers` di
 *    lib/auth.config.ts (di belakang pengecekan SSO_ENABLED):
 *
 *      if (process.env.SSO_ENABLED === "true") {
 *        const { default: BoxyHQSAML } = await import("next-auth/providers/boxyhq-saml");
 *        providers.push(BoxyHQSAML({
 *          clientId: process.env.SSO_CLIENT_ID!,
 *          clientSecret: process.env.SSO_CLIENT_SECRET!,
 *          issuer: process.env.SSO_ISSUER!,
 *          authorization: { params: { scope: "" } },
 *        }));
 *      }
 *
 *    Pastikan `.env` berisi SSO_ENABLED=true dan kredensial IdP.
 *
 * 2. LDAP: butuh package tambahan (belum terpasang). Install saat dibutuhkan
 *    dan buat provider LDAP sesuai dokumentasi package tersebut.
 *
 * Hingga dependency/IdP disiapkan, modul ini cukup membaca env secara
 * graceful — tidak memuat provider manapun, sehingga auth tetap aman.
 * ───────────────────────────────────────────────────────────────────────────
 */
