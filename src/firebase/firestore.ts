import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import { PhoneModel, PhoneListing } from '../types';

const MODELS_COLLECTION = 'models';
const LISTINGS_COLLECTION = 'listings';

// --- Live subscriptions -----------------------------------------------------
// These use Firestore's onSnapshot listener, which pushes updates the moment
// data changes on the server (or from any other device/tab). There is no
// stale-cache problem to solve here the way there is with a plain fetch():
// the listener stays open and the UI re-renders automatically whenever the
// server-side data changes, so every user always sees live data without
// needing a manual refresh.

export function subscribeToModels(
  onData: (models: PhoneModel[]) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const q = query(collection(db, MODELS_COLLECTION), orderBy('releaseYear', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const models = snapshot.docs.map((d) => ({ ...(d.data() as PhoneModel), id: d.id }));
      onData(models);
    },
    (err) => {
      console.error('Failed to subscribe to models', err);
      onError?.(err);
    }
  );
}

export function subscribeToListings(
  onData: (listings: PhoneListing[]) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const q = query(collection(db, LISTINGS_COLLECTION), orderBy('dateListed', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const listings = snapshot.docs.map((d) => ({ ...(d.data() as PhoneListing), id: d.id }));
      onData(listings);
    },
    (err) => {
      console.error('Failed to subscribe to listings', err);
      onError?.(err);
    }
  );
}

// --- Writes ------------------------------------------------------------------

export async function saveModel(model: PhoneModel): Promise<void> {
  await setDoc(doc(db, MODELS_COLLECTION, model.id), model);
}

export async function deleteModel(modelId: string): Promise<void> {
  await deleteDoc(doc(db, MODELS_COLLECTION, modelId));
}

export async function saveListing(listing: PhoneListing): Promise<void> {
  await setDoc(doc(db, LISTINGS_COLLECTION, listing.id), listing);
}

export async function deleteListing(listingId: string): Promise<void> {
  await deleteDoc(doc(db, LISTINGS_COLLECTION, listingId));
}
