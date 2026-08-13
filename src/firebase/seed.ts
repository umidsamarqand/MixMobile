import { writeBatch, doc, collection } from 'firebase/firestore';
import { db } from './config';
import { INITIAL_MODELS } from '../data/initialData';

/**
 * One-time setup helper: pushes the built-in MASTER_PHONE_MODELS catalog into
 * the Firestore "models" collection. Safe to run more than once (it overwrites
 * by id, it does not duplicate). Intended to be triggered once from the Admin
 * Portal after the Firebase project is freshly connected and Firestore is empty.
 */
export async function seedInitialModelsToFirestore(): Promise<number> {
  const batch = writeBatch(db);
  const modelsRef = collection(db, 'models');

  INITIAL_MODELS.forEach((model) => {
    batch.set(doc(modelsRef, model.id), model);
  });

  await batch.commit();
  return INITIAL_MODELS.length;
}
