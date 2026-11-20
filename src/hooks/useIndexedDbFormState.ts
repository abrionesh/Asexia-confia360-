import { useState, useEffect, useCallback, useRef } from 'react';
import {
  IndexedDbFormsStore,
  IndexedDbPendingSubmission,
  OperativeFormModule,
} from '../services/indexedDbForms';

export interface UseIndexedDbFormStateOptions<T extends Record<string, unknown>> {
  formId: string;
  module: OperativeFormModule;
  initialState: T;
  isOnline: boolean;
  onSyncPending?: (payload: T) => Promise<void>;
  debounceMs?: number;
  isDraftDirty?: (state: T, initial: T) => boolean;
}

export interface UseIndexedDbFormStateReturn<T extends Record<string, unknown>> {
  formState: T;
  setFormState: (updater: T | ((prev: T) => T)) => void;
  updateField: <K extends keyof T>(field: K, value: T[K]) => void;
  isHydrated: boolean;
  hasRecoveredDraft: boolean;
  dismissRecoveredNotice: () => void;
  lastSavedAt: string | null;
  pendingSubmissionsCount: number;
  isSyncingPending: boolean;
  queueSubmission: (payload?: T) => Promise<{ id: string; queuedOffline: boolean }>;
  flushPendingSubmissions: () => Promise<number>;
  clearDraft: () => Promise<void>;
}

export function useIndexedDbFormState<T extends Record<string, unknown>>({
  formId,
  module,
  initialState,
  isOnline,
  onSyncPending,
  debounceMs = 250,
  isDraftDirty,
}: UseIndexedDbFormStateOptions<T>): UseIndexedDbFormStateReturn<T> {
  const [formState, setFormStateInternal] = useState<T>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasRecoveredDraft, setHasRecoveredDraft] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [pendingSubmissionsCount, setPendingSubmissionsCount] = useState(0);
  const [isSyncingPending, setIsSyncingPending] = useState(false);

  const initialStateRef = useRef(initialState);
  const formStateRef = useRef(formState);
  const isOnlineRef = useRef(isOnline);
  const onSyncPendingRef = useRef(onSyncPending);
  const isDraftDirtyRef = useRef(isDraftDirty);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasUserMutatedRef = useRef(false);
  const isFlushingRef = useRef(false);

  formStateRef.current = formState;
  isOnlineRef.current = isOnline;
  onSyncPendingRef.current = onSyncPending;
  isDraftDirtyRef.current = isDraftDirty;

  // Hydrate persisted draft & pending submissions count from IndexedDB on mount + keep in sync
  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const [draft, pending] = await Promise.all([
        IndexedDbFormsStore.getDraft<T>(formId),
        IndexedDbFormsStore.getPendingSubmissions<T>(formId),
      ]);

      if (cancelled) return;

      if (draft && draft.data && !hasUserMutatedRef.current) {
        const merged = { ...initialStateRef.current, ...draft.data };
        setFormStateInternal(merged);
        setLastSavedAt(draft.updatedAt);
        if (draft.dirty) {
          setHasRecoveredDraft(true);
        }
      } else if (!draft && !hasUserMutatedRef.current) {
        setHasRecoveredDraft(false);
        setLastSavedAt(null);
      }

      setPendingSubmissionsCount(pending.length);
      setIsHydrated(true);
    }

    hydrate();

    const unsubscribe = IndexedDbFormsStore.subscribe(async () => {
      if (cancelled) return;
      const [draft, pending] = await Promise.all([
        IndexedDbFormsStore.getDraft<T>(formId),
        IndexedDbFormsStore.getPendingSubmissions<T>(formId),
      ]);
      if (cancelled) return;
      setPendingSubmissionsCount(pending.length);
      if (!draft) {
        setHasRecoveredDraft(false);
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [formId]);

  const persistDraftNow = useCallback(
    async (nextState: T) => {
      const dirty = isDraftDirtyRef.current
        ? isDraftDirtyRef.current(nextState, initialStateRef.current)
        : JSON.stringify(nextState) !== JSON.stringify(initialStateRef.current);

      if (!dirty) {
        await IndexedDbFormsStore.deleteDraft(formId);
        setLastSavedAt(null);
        return;
      }

      const now = new Date().toISOString();
      await IndexedDbFormsStore.saveDraft({
        formId,
        module,
        data: nextState,
        updatedAt: now,
        dirty: true,
      });
      setLastSavedAt(now);
    },
    [formId, module]
  );

  const schedulePersist = useCallback(
    (nextState: T) => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      saveTimerRef.current = setTimeout(() => {
        persistDraftNow(nextState);
      }, debounceMs);
    },
    [debounceMs, persistDraftNow]
  );

  // Flush pending timer on unmount using latest state
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        persistDraftNow(formStateRef.current);
      }
    };
  }, [persistDraftNow]);

  const setFormState = useCallback(
    (updater: T | ((prev: T) => T)) => {
      hasUserMutatedRef.current = true;
      setFormStateInternal((prev) => {
        const next = typeof updater === 'function' ? (updater as (p: T) => T)(prev) : updater;
        schedulePersist(next);
        return next;
      });
    },
    [schedulePersist]
  );

  const updateField = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setFormState((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [setFormState]
  );

  const clearDraft = useCallback(async () => {
    hasUserMutatedRef.current = false;
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    setFormStateInternal(initialStateRef.current);
    setHasRecoveredDraft(false);
    setLastSavedAt(null);
    await IndexedDbFormsStore.deleteDraft(formId);
  }, [formId]);

  const dismissRecoveredNotice = useCallback(() => {
    setHasRecoveredDraft(false);
  }, []);

  const flushPendingSubmissions = useCallback(async (): Promise<number> => {
    if (!isOnlineRef.current || !onSyncPendingRef.current || isFlushingRef.current) {
      return 0;
    }

    isFlushingRef.current = true;
    setIsSyncingPending(true);
    let syncedCount = 0;

    try {
      const pending = await IndexedDbFormsStore.getPendingSubmissions<T>(formId);
      for (const item of pending) {
        if (item.status === 'syncing') continue;
        if (!IndexedDbFormsStore.acquireSubmissionLock(item.id)) continue;
        try {
          await IndexedDbFormsStore.updateSubmissionStatus(item.id, 'syncing');
          await onSyncPendingRef.current(item.payload);
          await IndexedDbFormsStore.updateSubmissionStatus(item.id, 'synced');
          syncedCount += 1;
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Sync error';
          await IndexedDbFormsStore.updateSubmissionStatus(item.id, 'pending_offline', message);
        } finally {
          IndexedDbFormsStore.releaseSubmissionLock(item.id);
        }
      }

      const remaining = await IndexedDbFormsStore.getPendingSubmissions<T>(formId);
      setPendingSubmissionsCount(remaining.length);
    } finally {
      isFlushingRef.current = false;
      setIsSyncingPending(false);
    }

    return syncedCount;
  }, [formId]);

  const queueSubmission = useCallback(
    async (payload?: T): Promise<{ id: string; queuedOffline: boolean }> => {
      const submissionPayload = payload ?? formStateRef.current;
      const id = `idb-sub-${formId}-${Date.now()}`;

      if (isOnlineRef.current && onSyncPendingRef.current) {
        try {
          await onSyncPendingRef.current(submissionPayload);
          await clearDraft();
          return { id, queuedOffline: false };
        } catch {
          // Fall through to IndexedDB offline queue on transient failure
        }
      }

      const submission: IndexedDbPendingSubmission<T> = {
        id,
        formId,
        module,
        payload: submissionPayload,
        createdAt: new Date().toISOString(),
        status: 'pending_offline',
        retryCount: 0,
      };

      await IndexedDbFormsStore.addPendingSubmission(submission);
      const pending = await IndexedDbFormsStore.getPendingSubmissions<T>(formId);
      setPendingSubmissionsCount(pending.length);
      await clearDraft();
      return { id, queuedOffline: true };
    },
    [clearDraft, formId, module]
  );

  // Auto-flush IndexedDB queued submissions once connectivity returns
  useEffect(() => {
    if (isOnline && isHydrated && pendingSubmissionsCount > 0 && onSyncPendingRef.current) {
      flushPendingSubmissions();
    }
  }, [isOnline, isHydrated, pendingSubmissionsCount, flushPendingSubmissions]);

  return {
    formState,
    setFormState,
    updateField,
    isHydrated,
    hasRecoveredDraft,
    dismissRecoveredNotice,
    lastSavedAt,
    pendingSubmissionsCount,
    isSyncingPending,
    queueSubmission,
    flushPendingSubmissions,
    clearDraft,
  };
}
