import { useEffect, useState, useRef, useCallback } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { WeddingConfig, BudgetItem, Milestone, DoteItem, GuestItem } from '../types';
import {
  INITIAL_CONFIG,
  DEFAULT_MILESTONES,
  DEFAULT_DOTE_ITEMS,
  DEFAULT_GUESTS,
  generateDefaultBudget,
} from '../data/defaultData';

export interface WeddingCloudData {
  config: WeddingConfig;
  items: BudgetItem[];
  doteItems: DoteItem[];
  guests: GuestItem[];
  milestones: Milestone[];
  updatedAt?: string;
}

const DOCUMENT_ID = 'judia_joste_2026';

export function useWeddingSync() {
  const [config, setConfigState] = useState<WeddingConfig>(() => {
    const saved = localStorage.getItem('wedding_config_2026_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CONFIG;
  });

  const [items, setItemsState] = useState<BudgetItem[]>(() => {
    const saved = localStorage.getItem('wedding_budget_items_2026_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return generateDefaultBudget(INITIAL_CONFIG);
  });

  const [doteItems, setDoteItemsState] = useState<DoteItem[]>(() => {
    const saved = localStorage.getItem('wedding_dote_items_2026_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_DOTE_ITEMS;
  });

  const [guests, setGuestsState] = useState<GuestItem[]>(() => {
    const saved = localStorage.getItem('wedding_guests_2026_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_GUESTS;
  });

  const [milestones, setMilestonesState] = useState<Milestone[]>(() => {
    const saved = localStorage.getItem('wedding_milestones_2026_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_MILESTONES;
  });

  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'offline' | 'loading'>('loading');
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Unified Ref that always holds the exact latest state across renders and async timeouts
  const latestStateRef = useRef<WeddingCloudData>({
    config,
    items,
    doteItems,
    guests,
    milestones,
  });

  // Keep latestStateRef in sync with state changes
  useEffect(() => {
    latestStateRef.current = {
      config,
      items,
      doteItems,
      guests,
      milestones,
    };
  }, [config, items, doteItems, guests, milestones]);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced push to Cloud Firestore using the guaranteed latestStateRef
  const scheduleCloudPush = useCallback(() => {
    setSyncStatus('saving');
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const payload: WeddingCloudData = {
          ...latestStateRef.current,
          updatedAt: new Date().toISOString(),
        };

        const docRef = doc(db, 'weddings', DOCUMENT_ID);
        await setDoc(docRef, payload);
        setSyncStatus('synced');
        setLastSyncTime(
          new Date().toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        );
      } catch (err) {
        console.error('Failed to sync to Cloud Firestore:', err);
        setSyncStatus('offline');
      }
    }, 800);
  }, []);

  // Firestore real-time listener (ignores pending local writes to prevent typing interference)
  useEffect(() => {
    const docRef = doc(db, 'weddings', DOCUMENT_ID);

    const unsubscribe = onSnapshot(
      docRef,
      { includeMetadataChanges: true },
      (docSnap) => {
        // If snapshot comes from our own pending writes in progress, DO NOT overwrite local UI state!
        if (docSnap.metadata.hasPendingWrites) {
          return;
        }

        if (docSnap.exists()) {
          const data = docSnap.data() as WeddingCloudData;

          // Safely update state only if remote data is different to avoid flickering/cursor jumps
          if (data.config && JSON.stringify(data.config) !== JSON.stringify(latestStateRef.current.config)) {
            setConfigState(data.config);
            localStorage.setItem('wedding_config_2026_v2', JSON.stringify(data.config));
          }
          if (data.items && JSON.stringify(data.items) !== JSON.stringify(latestStateRef.current.items)) {
            setItemsState(data.items);
            localStorage.setItem('wedding_budget_items_2026_v2', JSON.stringify(data.items));
          }
          if (data.doteItems && JSON.stringify(data.doteItems) !== JSON.stringify(latestStateRef.current.doteItems)) {
            setDoteItemsState(data.doteItems);
            localStorage.setItem('wedding_dote_items_2026_v2', JSON.stringify(data.doteItems));
          }
          if (data.guests && JSON.stringify(data.guests) !== JSON.stringify(latestStateRef.current.guests)) {
            setGuestsState(data.guests);
            localStorage.setItem('wedding_guests_2026_v2', JSON.stringify(data.guests));
          }
          if (data.milestones && JSON.stringify(data.milestones) !== JSON.stringify(latestStateRef.current.milestones)) {
            setMilestonesState(data.milestones);
            localStorage.setItem('wedding_milestones_2026_v2', JSON.stringify(data.milestones));
          }

          setSyncStatus('synced');
          setLastSyncTime(
            new Date().toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
          );
        } else {
          // Document does not exist yet: initialize with current baseline
          const initialPayload: WeddingCloudData = {
            config: latestStateRef.current.config,
            items: latestStateRef.current.items,
            doteItems: latestStateRef.current.doteItems,
            guests: latestStateRef.current.guests,
            milestones: latestStateRef.current.milestones,
            updatedAt: new Date().toISOString(),
          };
          setDoc(docRef, initialPayload)
            .then(() => {
              setSyncStatus('synced');
              setLastSyncTime(
                new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
              );
            })
            .catch((err) => {
              console.error('Error seeding initial Cloud document:', err);
              setSyncStatus('offline');
            });
        }
      },
      (error) => {
        console.error('Firestore onSnapshot error:', error);
        setSyncStatus('offline');
      }
    );

    return () => unsubscribe();
  }, []);

  // Stable State Setters
  const setConfig = useCallback((newVal: WeddingConfig | ((prev: WeddingConfig) => WeddingConfig)) => {
    setConfigState((prev) => {
      const next = typeof newVal === 'function' ? newVal(prev) : newVal;
      latestStateRef.current.config = next;
      localStorage.setItem('wedding_config_2026_v2', JSON.stringify(next));
      scheduleCloudPush();
      return next;
    });
  }, [scheduleCloudPush]);

  const setItems = useCallback((newVal: BudgetItem[] | ((prev: BudgetItem[]) => BudgetItem[])) => {
    setItemsState((prev) => {
      const next = typeof newVal === 'function' ? newVal(prev) : newVal;
      latestStateRef.current.items = next;
      localStorage.setItem('wedding_budget_items_2026_v2', JSON.stringify(next));
      scheduleCloudPush();
      return next;
    });
  }, [scheduleCloudPush]);

  const setDoteItems = useCallback((newVal: DoteItem[] | ((prev: DoteItem[]) => DoteItem[])) => {
    setDoteItemsState((prev) => {
      const next = typeof newVal === 'function' ? newVal(prev) : newVal;
      latestStateRef.current.doteItems = next;
      localStorage.setItem('wedding_dote_items_2026_v2', JSON.stringify(next));
      scheduleCloudPush();
      return next;
    });
  }, [scheduleCloudPush]);

  const setGuests = useCallback((newVal: GuestItem[] | ((prev: GuestItem[]) => GuestItem[])) => {
    setGuestsState((prev) => {
      const next = typeof newVal === 'function' ? newVal(prev) : newVal;
      latestStateRef.current.guests = next;
      localStorage.setItem('wedding_guests_2026_v2', JSON.stringify(next));
      scheduleCloudPush();
      return next;
    });
  }, [scheduleCloudPush]);

  const setMilestones = useCallback((newVal: Milestone[] | ((prev: Milestone[]) => Milestone[])) => {
    setMilestonesState((prev) => {
      const next = typeof newVal === 'function' ? newVal(prev) : newVal;
      latestStateRef.current.milestones = next;
      localStorage.setItem('wedding_milestones_2026_v2', JSON.stringify(next));
      scheduleCloudPush();
      return next;
    });
  }, [scheduleCloudPush]);

  // Combined update for when both config and items change together (e.g. changing guest count)
  const updateConfigAndItems = useCallback((newConfig: WeddingConfig, newItems?: BudgetItem[]) => {
    setConfigState(newConfig);
    latestStateRef.current.config = newConfig;
    localStorage.setItem('wedding_config_2026_v2', JSON.stringify(newConfig));

    if (newItems) {
      setItemsState(newItems);
      latestStateRef.current.items = newItems;
      localStorage.setItem('wedding_budget_items_2026_v2', JSON.stringify(newItems));
    }

    scheduleCloudPush();
  }, [scheduleCloudPush]);

  const resetAllToDefaults = useCallback(() => {
    const defaultBudget = generateDefaultBudget(INITIAL_CONFIG);

    setConfigState(INITIAL_CONFIG);
    setItemsState(defaultBudget);
    setDoteItemsState(DEFAULT_DOTE_ITEMS);
    setGuestsState(DEFAULT_GUESTS);
    setMilestonesState(DEFAULT_MILESTONES);

    latestStateRef.current = {
      config: INITIAL_CONFIG,
      items: defaultBudget,
      doteItems: DEFAULT_DOTE_ITEMS,
      guests: DEFAULT_GUESTS,
      milestones: DEFAULT_MILESTONES,
    };

    localStorage.removeItem('wedding_config_2026_v2');
    localStorage.removeItem('wedding_budget_items_2026_v2');
    localStorage.removeItem('wedding_dote_items_2026_v2');
    localStorage.removeItem('wedding_guests_2026_v2');
    localStorage.removeItem('wedding_milestones_2026_v2');

    scheduleCloudPush();
  }, [scheduleCloudPush]);

  return {
    config,
    items,
    doteItems,
    guests,
    milestones,
    setConfig,
    setItems,
    setDoteItems,
    setGuests,
    setMilestones,
    updateConfigAndItems,
    resetAllToDefaults,
    syncStatus,
    lastSyncTime,
  };
}
