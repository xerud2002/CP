/**
 * Script to delete archived orders older than 30 days
 * Run this script periodically (e.g., daily via cron job or Firebase Functions)
 * 
 * Usage: node scripts/deleteOldArchivedOrders.js
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function deleteOldArchivedOrders() {
  console.log('🔍 Starting cleanup of archived orders...');
  
  // Calculate date 30 days ago
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  console.log(`📅 Cutoff date: ${thirtyDaysAgo.toISOString()}`);

  try {
    // Query for archived orders older than 30 days
    const snapshot = await db.collection('comenzi')
      .where('archived', '==', true)
      .where('archivedAt', '<', admin.firestore.Timestamp.fromDate(thirtyDaysAgo))
      .get();

    if (snapshot.empty) {
      console.log('✅ No archived orders to delete');
      return;
    }

    console.log(`📦 Found ${snapshot.size} orders to delete`);

    // Delete in batches of 500 (Firestore limit)
    const batchSize = 500;
    let totalDeleted = 0;
    
    for (let i = 0; i < snapshot.docs.length; i += batchSize) {
      const batch = db.batch();
      const batchDocs = snapshot.docs.slice(i, i + batchSize);
      
      batchDocs.forEach(doc => {
        console.log(`🗑️  Deleting order #${doc.data().orderNumber || doc.id}`);
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      totalDeleted += batchDocs.length;
      console.log(`✅ Deleted batch: ${batchDocs.length} orders (Total: ${totalDeleted}/${snapshot.size})`);
    }

    console.log(`🎉 Successfully deleted ${totalDeleted} archived orders!`);
  } catch (error) {
    console.error('❌ Error deleting archived orders:', error);
    throw error;
  }
}

// Run the cleanup
deleteOldArchivedOrders()
  .then(() => {
    console.log('✅ Cleanup completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  });
