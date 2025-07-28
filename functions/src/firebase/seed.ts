// functions/src/firebase/seed.ts
import { getFirestore } from 'firebase-admin/firestore';
import * as data from '../data';

export async function seed() {
  const db = getFirestore();
  const report: Record<string, string[]> = {};

  for (const [collectionName, docs] of Object.entries(data)) {
    const items = (docs as any[]) || [];
    report[collectionName] = [];

    for (const item of items) {
      if (!item.id) continue;
      await db.collection(collectionName).doc(item.id).set(item);
      report[collectionName].push(`🌱 Seeded ${collectionName}/${item.id}`);
    }
  }

  return report;
}
