/**
 * Hard Refresh Cache Utility
 * Clears Service Worker, CacheStorage and forces a fresh reload bypassing browser cache
 */
export async function forceRefreshAppCache() {
  try {
    // 1. Unregister all existing Service Workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        await reg.unregister();
      }
    }

    // 2. Clear all browser Cache Storage (PWAs & Offline assets)
    if ('caches' in window) {
      const keys = await caches.keys();
      for (const key of keys) {
        await caches.delete(key);
      }
    }
  } catch (e) {
    console.warn('Failed to clear caches:', e);
  }

  // 3. Force reload with cache-busting timestamp query parameter
  const url = new URL(window.location.href);
  url.searchParams.set('_t', Date.now().toString());
  window.location.replace(url.toString());
}
