// IndexedDB persistence layer for offline operational form drafts and pending sync submissions

export type OperativeFormModule =
  | 'fichaje'
  | 'gastos'
  | 'reservas_voz'
  | 'rrhh_turnos'
  | 'economico_alertas';

export interface IndexedDbFormDraft<T = unknown> {
  formId: string;
  module: OperativeFormModule;
  data: T;
  updatedAt: string;
  dirty: boolean;
}

export interface IndexedDbPendingSubmission<T = unknown> {
  id: string;
  formId: string;
  module: OperativeFormModule;
  payload: T;
  createdAt: string;
  status: 'pending_offline' | 'syncing' | 'synced';
  retryCount: number;
  lastError?: string;
}

const DB_NAME = 'confia360_offline_forms_db';
const DB_VERSION = 1;
const STORE_DRAFTS = 'form_drafts';
const STORE_SUBMISSIONS = 'pending_submissions';
const FALLBACK_DRAFTS_PREFIX = 'confia360_idb_draft_';
const FALLBACK_SUBMISSIONS_KEY = 'confia360_idb_pending_submissions';
export const CONFIA360_IDB_CHANGED_EVENT = 'confia360:idb-forms-changed';

let dbPromise: Promise<IDBDatabase> | null = null;
const activeSyncLocks = new Set<string>();

function notifyIdbChanged(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CONFIA360_IDB_CHANGED_EVENT));
  }
}

function isIndexedDbSupported(): boolean {
  return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
}

function openFormsDatabase(): Promise<IDBDatabase> {
  if (!isIndexedDbSupported()) {
    return Promise.reject(new Error('IndexedDB is not available'));
  }
  if (dbPromise) return dbPromise;

  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_DRAFTS)) {
          const draftStore = db.createObjectStore(STORE_DRAFTS, { keyPath: 'formId' });
          draftStore.createIndex('by_module', 'module', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORE_SUBMISSIONS)) {
          const subStore = db.createObjectStore(STORE_SUBMISSIONS, { keyPath: 'id' });
          subStore.createIndex('by_form', 'formId', { unique: false });
          subStore.createIndex('by_status', 'status', { unique: false });
        }
      };

      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => {
          db.close();
          dbPromise = null;
        };
        resolve(db);
      };

      request.onerror = () => {
        dbPromise = null;
        reject(request.error || new Error('Failed to open IndexedDB'));
      };

      request.onblocked = () => {
        dbPromise = null;
      };
    } catch (err) {
      dbPromise = null;
      reject(err);
    }
  });

  return dbPromise;
}

function readFallbackDraft<T>(formId: string): IndexedDbFormDraft<T> | null {
  try {
    const raw = localStorage.getItem(`${FALLBACK_DRAFTS_PREFIX}${formId}`);
    return raw ? (JSON.parse(raw) as IndexedDbFormDraft<T>) : null;
  } catch {
    return null;
  }
}

function readAllFallbackDrafts(): IndexedDbFormDraft[] {
  try {
    const results: IndexedDbFormDraft[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(FALLBACK_DRAFTS_PREFIX)) {
        const raw = localStorage.getItem(key);
        if (raw) {
          results.push(JSON.parse(raw) as IndexedDbFormDraft);
        }
      }
    }
    return results;
  } catch {
    return [];
  }
}

function writeFallbackDraft<T>(draft: IndexedDbFormDraft<T>): void {
  try {
    localStorage.setItem(`${FALLBACK_DRAFTS_PREFIX}${draft.formId}`, JSON.stringify(draft));
  } catch {
    // Ignore quota errors in fallback mode
  }
}

function deleteFallbackDraft(formId: string): void {
  try {
    localStorage.removeItem(`${FALLBACK_DRAFTS_PREFIX}${formId}`);
  } catch {
    // Ignore
  }
}

function readFallbackSubmissions(): IndexedDbPendingSubmission[] {
  try {
    const raw = localStorage.getItem(FALLBACK_SUBMISSIONS_KEY);
    return raw ? (JSON.parse(raw) as IndexedDbPendingSubmission[]) : [];
  } catch {
    return [];
  }
}

function writeFallbackSubmissions(items: IndexedDbPendingSubmission[]): void {
  try {
    localStorage.setItem(FALLBACK_SUBMISSIONS_KEY, JSON.stringify(items));
  } catch {
    // Ignore
  }
}

export const IndexedDbFormsStore = {
  acquireSubmissionLock(id: string): boolean {
    if (activeSyncLocks.has(id)) return false;
    activeSyncLocks.add(id);
    return true;
  },

  releaseSubmissionLock(id: string): void {
    activeSyncLocks.delete(id);
  },

  subscribe(listener: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    window.addEventListener(CONFIA360_IDB_CHANGED_EVENT, listener);
    return () => window.removeEventListener(CONFIA360_IDB_CHANGED_EVENT, listener);
  },

  async getDraft<T>(formId: string): Promise<IndexedDbFormDraft<T> | null> {
    try {
      const db = await openFormsDatabase();
      return await new Promise<IndexedDbFormDraft<T> | null>((resolve, reject) => {
        const tx = db.transaction(STORE_DRAFTS, 'readonly');
        const store = tx.objectStore(STORE_DRAFTS);
        const req = store.get(formId);
        req.onsuccess = () => resolve((req.result as IndexedDbFormDraft<T>) || null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return readFallbackDraft<T>(formId);
    }
  },

  async getAllDrafts(): Promise<IndexedDbFormDraft[]> {
    try {
      const db = await openFormsDatabase();
      return await new Promise<IndexedDbFormDraft[]>((resolve, reject) => {
        const tx = db.transaction(STORE_DRAFTS, 'readonly');
        const store = tx.objectStore(STORE_DRAFTS);
        const req = store.getAll();
        req.onsuccess = () => resolve(((req.result as IndexedDbFormDraft[]) || []).filter((d) => d.dirty));
        req.onerror = () => reject(req.error);
      });
    } catch {
      return readAllFallbackDrafts().filter((d) => d.dirty);
    }
  },

  async saveDraft<T>(draft: IndexedDbFormDraft<T>): Promise<void> {
    try {
      const db = await openFormsDatabase();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_DRAFTS, 'readwrite');
        const store = tx.objectStore(STORE_DRAFTS);
        const req = store.put(draft);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      writeFallbackDraft(draft);
    }
    notifyIdbChanged();
  },

  async deleteDraft(formId: string): Promise<void> {
    try {
      const db = await openFormsDatabase();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_DRAFTS, 'readwrite');
        const store = tx.objectStore(STORE_DRAFTS);
        const req = store.delete(formId);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      deleteFallbackDraft(formId);
    }
    notifyIdbChanged();
  },

  async addPendingSubmission<T>(submission: IndexedDbPendingSubmission<T>): Promise<void> {
    try {
      const db = await openFormsDatabase();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_SUBMISSIONS, 'readwrite');
        const store = tx.objectStore(STORE_SUBMISSIONS);
        const req = store.put(submission);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      const current = readFallbackSubmissions();
      writeFallbackSubmissions([submission, ...current.filter((item) => item.id !== submission.id)]);
    }
    notifyIdbChanged();
  },

  async getPendingSubmissions<T>(formId?: string): Promise<IndexedDbPendingSubmission<T>[]> {
    try {
      const db = await openFormsDatabase();
      return await new Promise<IndexedDbPendingSubmission<T>[]>((resolve, reject) => {
        const tx = db.transaction(STORE_SUBMISSIONS, 'readonly');
        const store = tx.objectStore(STORE_SUBMISSIONS);
        const req = formId ? store.index('by_form').getAll(formId) : store.getAll();
        req.onsuccess = () => {
          const all = (req.result as IndexedDbPendingSubmission<T>[]) || [];
          resolve(all.filter((item) => item.status !== 'synced'));
        };
        req.onerror = () => reject(req.error);
      });
    } catch {
      const all = readFallbackSubmissions() as IndexedDbPendingSubmission<T>[];
      return all.filter((item) => (!formId || item.formId === formId) && item.status !== 'synced');
    }
  },

  async updateSubmissionStatus(
    id: string,
    status: IndexedDbPendingSubmission['status'],
    lastError?: string
  ): Promise<void> {
    try {
      const db = await openFormsDatabase();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_SUBMISSIONS, 'readwrite');
        const store = tx.objectStore(STORE_SUBMISSIONS);
        const getReq = store.get(id);
        getReq.onsuccess = () => {
          const record = getReq.result as IndexedDbPendingSubmission | undefined;
          if (!record) {
            resolve();
            return;
          }
          if (status === 'synced') {
            const delReq = store.delete(id);
            delReq.onsuccess = () => resolve();
            delReq.onerror = () => reject(delReq.error);
            return;
          }
          const updated: IndexedDbPendingSubmission = {
            ...record,
            status,
            retryCount: record.retryCount + (status === 'pending_offline' ? 1 : 0),
            lastError,
          };
          const putReq = store.put(updated);
          putReq.onsuccess = () => resolve();
          putReq.onerror = () => reject(putReq.error);
        };
        getReq.onerror = () => reject(getReq.error);
      });
    } catch {
      const all = readFallbackSubmissions();
      if (status === 'synced') {
        writeFallbackSubmissions(all.filter((item) => item.id !== id));
      } else {
        writeFallbackSubmissions(
          all.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status,
                  retryCount: item.retryCount + (status === 'pending_offline' ? 1 : 0),
                  lastError,
                }
              : item
          )
        );
      }
    }
    notifyIdbChanged();
  },
};
