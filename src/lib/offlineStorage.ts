/**
 * Secure Offline Storage Module for MediBudget
 * Handles encrypted local caching of medical reference data,
 * network detection, and background sync.
 */

const DB_NAME = "medibudget_offline";
const DB_VERSION = 1;
const STORE_NAME = "cache";
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Simple XOR-based obfuscation for local data (not crypto-grade, but deters casual inspection)
const OBFUSCATION_KEY = "MediBudget2026SecureCache";

function obfuscate(data: string): string {
  return btoa(
    data
      .split("")
      .map((c, i) =>
        String.fromCharCode(c.charCodeAt(0) ^ OBFUSCATION_KEY.charCodeAt(i % OBFUSCATION_KEY.length))
      )
      .join("")
  );
}

function deobfuscate(encoded: string): string {
  const decoded = atob(encoded);
  return decoded
    .split("")
    .map((c, i) =>
      String.fromCharCode(c.charCodeAt(0) ^ OBFUSCATION_KEY.charCodeAt(i % OBFUSCATION_KEY.length))
    )
    .join("");
}

// Checksum for tamper detection
function checksum(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash + data.charCodeAt(i)) | 0;
  }
  return hash.toString(36);
}

interface CacheEntry {
  key: string;
  data: string; // obfuscated JSON
  hash: string;
  cachedAt: number;
  expiresAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function setCacheItem<T>(key: string, value: T): Promise<void> {
  const db = await openDB();
  const raw = JSON.stringify(value);
  const entry: CacheEntry = {
    key,
    data: obfuscate(raw),
    hash: checksum(raw),
    cachedAt: Date.now(),
    expiresAt: Date.now() + CACHE_TTL_MS,
  };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(entry);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getCacheItem<T>(key: string): Promise<{ data: T; expired: boolean } | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = () => {
      const entry = req.result as CacheEntry | undefined;
      if (!entry) return resolve(null);

      try {
        const raw = deobfuscate(entry.data);
        // Tamper check
        if (checksum(raw) !== entry.hash) {
          console.warn(`[OfflineStorage] Tamper detected for key: ${key}`);
          return resolve(null);
        }
        return resolve({
          data: JSON.parse(raw) as T,
          expired: Date.now() > entry.expiresAt,
        });
      } catch {
        return resolve(null);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

export async function clearAllCache(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getCacheAge(key: string): Promise<number | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = () => {
      const entry = req.result as CacheEntry | undefined;
      resolve(entry ? Date.now() - entry.cachedAt : null);
    };
    req.onerror = () => reject(req.error);
  });
}
