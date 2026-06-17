/* SignalDesk Mini — US-003 Insights export summary action */
(function () {
  'use strict';

  window.actExportSummary = function () {
    const records = (window.insightsState && window.insightsState.records) || [];
    try {
      const payload = {
        records: records,
        exportedAt: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'signaldesk-summary.json';
      a.click();
      setTimeout(function () { URL.revokeObjectURL(url); }, 100);
    } catch (_) {
      // Export is best-effort; ignore environments that block downloads.
    }
  };
})();
