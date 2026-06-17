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
      if (raw) return JSON.parse(raw);
    } catch (err) {
      // Corrupt or unavailable localStorage
    }
    return null;
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
    let saved = loadStorage();
    if (!saved) {
      const seed = await loadSeedData();
      if (seed) saved = seed;
    }

    if (saved) {
      store.dispatch({ type: 'HYDRATE', saved });
    } else {
      store.dispatch({ type: 'HYDRATE', saved: {} });
    }

    // Persist every state change except TICK
    store.subscribe(function (state, action) {
      if (action && action.type === 'TICK') return;
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
