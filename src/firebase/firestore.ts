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
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './config';
import { PhoneModel, PhoneListing } from '../types';
import { ADMIN_EMAIL } from '../context/AuthContext';
import { seedInitialModelsToFirestore } from './seed';

const MODELS_COLLECTION = 'models';
const LISTINGS_COLLECTION = 'listings';

// --- Auto-seed on first run --------------------------------------------------
// The Firestore "models" snapshot and Firebase Auth's session restore both
// resolve asynchronously and can finish in either order on page load, so we
// track "is the collection empty" independently of "is the admin logged in"
// and re-check the combined condition whenever either one changes.
let modelsCollectionIsEmpty: boolean | null = null;
let hasAttemptedAutoSeed = false;

function maybeAutoSeed() {
  if (
    modelsCollectionIsEmpty === true &&
    !hasAttemptedAutoSeed &&
    auth.currentUser?.email === ADMIN_EMAIL
  ) {
    hasAttemptedAutoSeed = true;
    seedInitialModelsToFirestore()
      .then((count) => {
        console.log(`[Firestore] Auto-seeded ${count} models (collection was empty).`);
      })
      .catch((err) => {
        console.error('[Firestore] Auto-seed failed:', err);
        hasAttemptedAutoSeed = false; // allow retry, e.g. after a transient network error
      });
  }
}

// Re-run the check the moment sign-in state changes (covers the case where
// the admin logs in *after* the empty snapshot has already been observed).
onAuthStateChanged(auth, () => maybeAutoSeed());

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
      modelsCollectionIsEmpty = snapshot.empty;
      maybeAutoSeed();

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
  // Create a safe copy of the listing, replacing undefined with an empty string
  const safeListing = {
    ...listing,
    gsmarena_url: listing.gsmarena_url || "",
  };
  
  await setDoc(doc(db, LISTINGS_COLLECTION, listing.id), safeListing);
}

export async function deleteListing(listingId: string): Promise<void> {
  await deleteDoc(doc(db, LISTINGS_COLLECTION, listingId));
}
