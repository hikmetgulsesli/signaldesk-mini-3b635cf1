/* SignalDesk Mini — persistence and boot module */
(function () {
  'use strict';

  const STORAGE_KEY = 'signaldesk-mini-state';
  const store = window.app && window.app.store;
  const stateApi = window.SignalDeskState;

  if (!store || !stateApi) {
    console.error('SignalDesk state module must be loaded before storage module.');
    return;
  }

  function loadStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) return { empty: true };
      return { data: JSON.parse(raw) };
    } catch (err) {
      return { corrupt: true, error: String(err) };
    }
  }

  function clearStorage() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      // Storage may be unavailable
    }
  }

  function saveStorage(state) {
    try {
      const snapshot = {
        records: state.records,
        nextId: state.nextId,
        preferences: state.preferences,
        filter: state.filter,
        view: state.view
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch (err) {
      // Storage may be full or unavailable
    }
  }

  async function loadSeedData() {
    try {
      const response = await fetch('assets/data/signaldesk-mini.json');
      if (response.ok) return await response.json();
    } catch (err) {
      // Seed data unavailable (e.g. file:// origin)
    }
    return null;
  }

  async function boot() {
    const loaded = loadStorage();
    let saved = null;
    let isCorrupt = false;

    if (loaded.corrupt) {
      store.dispatch({ type: 'SET_ERROR', error: 'Saved data is corrupted and could not be loaded.' });
      isCorrupt = true;
    } else if (loaded.data) {
      saved = loaded.data;
    }

    if (!saved && !isCorrupt) {
      const seed = await loadSeedData();
      if (seed) saved = seed;
    }

    if (saved) {
      store.dispatch({ type: 'HYDRATE', saved });
    } else if (!isCorrupt) {
      store.dispatch({ type: 'HYDRATE', saved: {} });
    }

    // Persist every state change except TICK and CLEAR_DATA
    store.subscribe(function (state, action) {
      if (action && action.type === 'TICK') return;
      if (action && action.type === 'CLEAR_DATA') {
        clearStorage();
        return;
      }
      saveStorage(state);
    });

    // Visible scheduled runtime loop that advances state
    setInterval(function () {
      store.dispatch({ type: 'TICK' });
    }, 1000);

    // Render initial view
    if (typeof window.renderSignalDesk === 'function') {
      window.renderSignalDesk();
    }
  }

  // Ensure DOM is parsed before booting because scripts are deferred,
  // but guard against early execution just in case.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
