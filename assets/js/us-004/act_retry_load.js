/* SignalDesk Mini — US-004 Settings retry load action */
(function () {
  'use strict';

  const STORAGE_KEY = 'signaldesk-mini-state';

  function hideError() {
    const banner = document.getElementById('error-banner');
    if (banner) {
      banner.textContent = '';
      banner.classList.add('hidden');
    }
  }

  function loadSnapshot() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }

  window.actRetryLoad = function () {
    hideError();
    const snapshot = loadSnapshot();
    document.dispatchEvent(new CustomEvent('signaldesk:retry-load', {
      detail: { snapshot: snapshot }
    }));
    return true;
  };
})();
