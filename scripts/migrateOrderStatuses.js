/**
 * Migration script to update old English status values to new Romanian ones
 * Run this once to migrate existing orders in Firestore
 * 
 * Usage: node scripts/migrateOrderStatuses.js
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Initialize Firebase Admin (you'll need to add your service account key)
// Download from Firebase Console > Project Settings > Service Accounts
const serviceAccount = JSON.parse(
  readFileSync('./serviceAccountKey.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const statusMapping = {
  'pending': 'noua',
  'accepted': 'acceptata',
  'in_transit': 'in_tranzit',
  'completed': 'livrata',
  'cancelled': 'anulata',
};

async function migrateStatuses() {
  console.log('Starting status migration...');
  
  try {
    const ordersRef = db.collection('comenzi');
    const snapshot = await ordersRef.get();
    
    let migrated = 0;
    let skipped = 0;
    const batch = db.batch();
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      const oldStatus = data.status;
      
      if (statusMapping[oldStatus]) {
        const newStatus = statusMapping[oldStatus];
        console.log(`Migrating order ${doc.id}: ${oldStatus} → ${newStatus}`);
        batch.update(doc.ref, { 
          status: newStatus,
          statusUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        migrated++;
      } else {
        console.log(`Skipping order ${doc.id}: status '${oldStatus}' is already in new format`);
        skipped++;
      }
    });
    
    if (migrated > 0) {
      await batch.commit();
      console.log(`\n✅ Migration complete!`);
      console.log(`   Migrated: ${migrated} orders`);
      console.log(`   Skipped: ${skipped} orders`);
    } else {
      console.log('\n✅ No orders to migrate - all statuses are up to date!');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

migrateStatuses();
