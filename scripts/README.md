# Migration Scripts

## Order Status Migration

This script migrates old English status values to new Romanian ones.

### Setup

1. Download your Firebase service account key:
   - Go to Firebase Console
   - Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `serviceAccountKey.json` in this `scripts/` folder

2. Install dependencies:
   ```bash
   npm install firebase-admin
   ```

3. Run the migration:
   ```bash
   node scripts/migrateOrderStatuses.js
   ```

### Status Mapping

| Old (English) | New (Romanian) |
|---------------|----------------|
| `pending`     | `noua`         |
| `accepted`    | `acceptata`    |
| `in_transit`  | `in_tranzit`   |
| `completed`   | `livrata`      |
| `cancelled`   | `anulata`      |

### Safety

- The script uses batched writes for efficiency
- Orders with already-migrated statuses are skipped
- A timestamp (`statusUpdatedAt`) is added to track when the migration happened
- No data is deleted, only the `status` field is updated

### Rollback

If you need to rollback, manually update the status values in Firestore Console or create a reverse migration script with the opposite mapping.
