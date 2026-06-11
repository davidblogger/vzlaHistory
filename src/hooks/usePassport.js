import { useState, useCallback, useMemo } from 'react';
import { ERA_ORDER } from '../config';

const STORAGE_KEY = 'historiave-passport';

function loadPassport() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      if (data && typeof data === 'object') {
        return {
          stamps: Array.isArray(data.stamps) ? data.stamps : [],
          completedEras: Array.isArray(data.completedEras) ? data.completedEras : [],
        };
      }
    }
  } catch {
    // Ignored
  }
  return { stamps: [], completedEras: [] };
}

function savePassport(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getEraName(eraId) {
  const names = {
    prehispanico: 'Prehispánico',
    colonia: 'Colonia',
    independencia: 'Independencia',
    'siglo-xix-xx': 'Siglo XIX – XX',
    contemporanea: 'Contemporánea',
  };
  return names[eraId] || eraId;
}

export function usePassport() {
  const [passport, setPassport] = useState(loadPassport);

  const persist = useCallback((next) => {
    setPassport(next);
    savePassport(next);
  }, []);

  const isEraUnlocked = useCallback((eraId) => {
    if (eraId === ERA_ORDER[0]) return true;
    const idx = ERA_ORDER.indexOf(eraId);
    if (idx === -1) return false;
    const prevId = ERA_ORDER[idx - 1];
    return passport.stamps.some(s => s.eraId === prevId);
  }, [passport.stamps]);

  const isEraCompleted = useCallback((eraId) => {
    return passport.completedEras.includes(eraId);
  }, [passport.completedEras]);

  const isEraStamped = useCallback((eraId) => {
    return passport.stamps.some(s => s.eraId === eraId);
  }, [passport.stamps]);

  const completeEra = useCallback((eraId) => {
    if (passport.completedEras.includes(eraId)) return;
    const next = {
      ...passport,
      completedEras: [...passport.completedEras, eraId],
    };
    persist(next);
  }, [passport, persist]);

  const claimStamp = useCallback((eraId, walletAddress, transactionSignature) => {
    if (passport.stamps.some(s => s.eraId === eraId)) return;

    const stamp = {
      badgeId: `stamp-${eraId}`,
      eraId,
      eraName: getEraName(eraId),
      walletAddress,
      transactionSignature,
      claimedAt: new Date().toISOString(),
      status: 'claimed',
    };
    const next = {
      ...passport,
      stamps: [...passport.stamps, stamp],
    };
    persist(next);
    return stamp;
  }, [passport, persist]);

  const getStamps = useCallback(() => passport.stamps, [passport.stamps]);

  const getProgress = useCallback(() => {
    return Math.round((passport.stamps.length / ERA_ORDER.length) * 100);
  }, [passport.stamps.length]);

  const getLastSignature = useCallback(() => {
    if (passport.stamps.length === 0) return null;
    return passport.stamps[passport.stamps.length - 1].transactionSignature;
  }, [passport.stamps]);

  const getNextEra = useCallback(() => {
    for (const id of ERA_ORDER) {
      if (!passport.stamps.some(s => s.eraId === id)) {
        return { id, name: getEraName(id), unlocked: isEraUnlocked(id) };
      }
    }
    return null;
  }, [passport.stamps, isEraUnlocked]);

  const getEraStatus = useCallback((eraId) => {
    if (isEraStamped(eraId)) return 'stamped';
    if (isEraCompleted(eraId)) return 'completed';
    if (isEraUnlocked(eraId)) return 'unlocked';
    return 'locked';
  }, [isEraStamped, isEraCompleted, isEraUnlocked]);

  const refresh = useCallback(() => {
    setPassport(loadPassport());
  }, []);

  return useMemo(() => ({
    isEraUnlocked,
    isEraCompleted,
    isEraStamped,
    completeEra,
    claimStamp,
    getStamps,
    getProgress,
    getLastSignature,
    getNextEra,
    getEraStatus,
    refresh,
    stamps: passport.stamps,
    completedEras: passport.completedEras,
  }), [
    isEraUnlocked,
    isEraCompleted,
    isEraStamped,
    completeEra,
    claimStamp,
    getStamps,
    getProgress,
    getLastSignature,
    getNextEra,
    getEraStatus,
    refresh,
    passport.stamps,
    passport.completedEras,
  ]);
}
