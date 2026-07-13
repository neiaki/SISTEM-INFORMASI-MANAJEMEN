#!/usr/bin/env sh
# scripts/cron-deadline-reminder.sh
# Pemanggil endpoint cron deadline-reminder untuk environment VPS (bukan Vercel).
# Daftarkan via crontab agar berjalan tiap hari jam 07:00:
#   0 7 * * * /path/to/scripts/cron-deadline-reminder.sh >> /var/log/sim-tugas-cron.log 2>&1

APP_URL="${APP_URL:-http://localhost:3000}"
CRON_SECRET="${CRON_SECRET:-}"

if [ -z "$CRON_SECRET" ]; then
  echo "[$(date)] CRON_SECRET kosong — pemanggilan mungkin ditolak (401) jika diaktifkan di server."
fi

curl -sS -X GET \
  -H "Authorization: Bearer ${CRON_SECRET}" \
  "${APP_URL}/api/cron/deadline-reminder"

echo ""
echo "[$(date)] cron deadline-reminder selesai."
