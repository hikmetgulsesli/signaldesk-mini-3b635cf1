/* SignalDesk Mini — US-004 Settings save preferences action */
(function () {
  'use strict';

  const STORAGE_KEY = 'signaldesk-mini-state';

  function getSharedSnapshot() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (err) {
      // Fall through to empty snapshot
    }
    return {};
  }

  function setSharedSnapshot(snapshot) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      return true;
    } catch (err) {
      return false;
    }
  }

  function readPreferencesForm() {
    const densityEl = document.querySelector('[name="pref-density"]:checked');
    const sidebarEl = document.querySelector('[name="pref-sidebar"]:checked');
    const themeEl = document.querySelector('[name="pref-theme"]:checked');
    const notificationsEl = document.querySelector('[data-pref="notifications"]');
    const tooltipsEl = document.querySelector('[data-pref="tooltips"]');
    const compactTablesEl = document.querySelector('[data-pref="compactTables"]');
    const defaultViewEl = document.getElementById('pref-default-view');

    return {
      density: densityEl ? densityEl.value : 'comfortable',
      sidebar: sidebarEl ? sidebarEl.value : 'expanded',
      theme: themeEl ? themeEl.value : 'system',
      notifications: notificationsEl ? notificationsEl.checked : true,
      tooltips: tooltipsEl ? tooltipsEl.checked : true,
      compactTables: compactTablesEl ? compactTablesEl.checked : false,
      defaultView: defaultViewEl ? defaultViewEl.value : 'operations'
    };
  }

  function showFeedback(message, isError) {
    const banner = document.getElementById('error-banner');
    const feedback = document.getElementById('save-feedback');
    if (feedback) {
      feedback.textContent = message;
      feedback.classList.toggle('error-banner', !!isError);
      feedback.classList.remove('hidden');
      setTimeout(function () { feedback.classList.add('hidden'); }, 3000);
    } else if (banner) {
      banner.textContent = message;
      banner.classList.toggle('hidden', false);
      setTimeout(function () { banner.classList.add('hidden'); }, 3000);
    }
  }

  window.actSavePreferences = function () {
    const preferences = readPreferencesForm();
    const snapshot = getSharedSnapshot();
    snapshot.preferences = Object.assign(snapshot.preferences || {}, preferences);

    if (setSharedSnapshot(snapshot)) {
      showFeedback('Preferences saved.');
      document.dispatchEvent(new CustomEvent('preferences:saved', { detail: preferences }));
      return true;
    }

    showFeedback('Could not save preferences.', true);
    return false;
  };
})();
