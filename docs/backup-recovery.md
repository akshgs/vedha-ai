# Database Backup & Recovery Plan - Phase 12

This document details the database backup scheduling, recovery runbooks, and validation testing procedures.

---

## 1. Automated Backup Procedures

To protect production data, database dumps are scheduled using `pg_dump` tools:
- **Dumping Command:**
  ```bash
  docker exec -t vedha_postgres_prod pg_dump -U vedha_user -d vedha_ai -F c -b -v -f /backups/vedha_backup_$(date +%F).dump
  ```
- **Scheduling (Cron):** A cron job is scheduled to execute daily at 2:00 AM on the host VM:
  ```cron
  0 2 * * * /path/to/backup_script.sh >> /var/log/backup.log 2>&1
  ```
- **Backup Storage:** To guard against single-point-of-failure risks, backup dumps should be synced daily to off-site cloud object storage (e.g. AWS S3 or GCP Cloud Storage) with lifecycle rules configured to prune backups older than 30 days.

---

## 2. Restore and Disaster Recovery

In the event of database corruption or hardware failure, follow this restore runbook:

1. **Re-create an empty target database:**
   ```bash
   docker exec -it vedha_postgres_prod psql -U postgres -c "DROP DATABASE IF EXISTS vedha_ai;"
   docker exec -it vedha_postgres_prod psql -U postgres -c "CREATE DATABASE vedha_ai WITH OWNER vedha_user;"
   ```
2. **Execute restore tool:**
   ```bash
   docker exec -i vedha_postgres_prod pg_restore -U vedha_user -d vedha_ai -v /backups/target_backup.dump
   ```
3. **Validate:** Confirm that tables, sequences, indices, and seeded data are restored correctly.
